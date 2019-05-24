from rest_framework import serializers

from core.helpers import get_file_url, convert_to_byte_length, check_image_size, check_image_mime_type, get_short_key

from .models import Source, Video, VideoPart, Playlist


def get_source_form(source=None):
    name = ''
    description = ''
    picture_url = ''
    if source:
        name = source.name
        description = source.description
        picture_url = get_file_url(source.preview_picture.name)

    form = [{
        'type': 'text',
        'name': 'name',
        'value': f'{name}',
        'label': 'Название фрагмента видео',
        'placeholder': 'Введите название фрагмента видео...',
        'rules': {
            'max_length': 64,
            'required': True
        },
    }, {
        'type': 'textarea',
        'name': 'description',
        'value': f'{description}',
        'label': 'Описание фрагмента фидео',
        'placeholder': 'Введите описание фрагмента видео...',
        'rules': {
            'max_length': 1024,
            'required': False
        },
    }, {
        'type': 'image',
        'name': 'preview_picture',
        'previewUrl': f'{picture_url}',
        'label': 'Превью фрагмента видео',
        'placeholder': 'Выберите изображение...',
        'rules': {
            'mimetypes': ['image/png'],
            'max_size': convert_to_byte_length(MB=10),
            'required': False,
        }
    }, {
        'type': 'video',
        'name': 'content',
        'label': 'Фрагмент видео',
        'placeholder': 'Выберите фрагмент видео...',
        'rules': {
            'mimetypes': ['video/mp4'],
            'max_size': convert_to_byte_length(MB=20),
            'required': True,
        }
    }]

    return form


def get_video_form(channel, video=None):
    name = ''
    description = ''
    picture_url = ''

    playlists = channel.playlists.filter(status__in=[Playlist.UPLOADED, Playlist.HIDDEN, Playlist.PUBLIC])
    playlist_uploaded = playlists.get(status=Playlist.UPLOADED)
    playlist_key = playlist_uploaded.key

    if video:
        name = video.name
        description = video.description
        picture_url = get_file_url(video.preview_picture.name)
        playlist_key = video.playlist

    form = [{
        'type': 'text',
        'name': 'name',
        'value': f'{name}',
        'label': 'Название видео',
        'placeholder': 'Введите название видео...',
        'rules': {
            'max_length': 128,
            'required': True
        },
    }, {
        'type': 'textarea',
        'name': 'description',
        'value': f'{description}',
        'label': 'Описание видео',
        'placeholder': 'Введите описание видео...',
        'rules': {
            'max_length': 4096,
            'required': True
        },
    }, {
        'type': 'image',
        'name': 'preview_picture',
        'previewUrl': f'{picture_url}',
        'label': 'Превью видео',
        'placeholder': 'Выберите изображение...',
        'rules': {
            'mimetypes': ['image/png'],
            'max_size': convert_to_byte_length(MB=10),
            'required': True,
        }
    }, {
        'type': 'choice',
        'name': 'playlist_key',
        'label': 'Плейлист видео',
        'value': playlist_key,
        'choices': [ { 'value': playlist.key, 'text': playlist.name } for playlist in playlists ],
        'rules': {
            'required': True,
        }
    }]

    return form


class SourceSerializer(serializers.ModelSerializer):
    def validate_preview_picture(self, value):
        preview = value
        if not preview:
            raise serializers.ValidationError('Empty avatar source.')

        if not check_image_mime_type(preview.content_type):
            raise serializers.ValidationError('Wrong preview picture mime type.')

        if not check_image_size(preview.size):
            raise serializers.ValidationError('Size of preview picture must be less than 10MB.')

        return preview

    class Meta():
        model = Source
        fields = ('name', 'description', 'preview_picture', 'content')


class PrettySourceSerializer(serializers.ModelSerializer):
    key = serializers.SerializerMethodField()
    preview_url = serializers.SerializerMethodField()
    content_url = serializers.SerializerMethodField()

    def get_key(self, obj):
        return obj.key.hex

    def get_preview_url(self, obj):
        return get_file_url(obj.preview_picture.name)

    def get_content_url(self, obj):
        return get_file_url(obj.content.name)

    class Meta():
        model = Source
        fields = ('key', 'name', 'content_url', 'preview_url')


class VideoPreviewSerialiser(serializers.ModelSerializer):
    channel = serializers.SerializerMethodField()
    preview_url = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    views = serializers.SerializerMethodField()

    def get_channel(self, obj):
        channel = obj.owner.channel
        return {
            'key': channel.key,
            'name': channel.name,
        }

    def get_preview_url(self, obj):
        return get_file_url(obj.preview_picture.name)

    def get_rating(self, obj):
        return obj.rating.counter

    def get_views(self, obj):
        return obj.views.counter

    class Meta():
        model = Video
        fields = ('name', 'description', 'key', 'created', 'channel', 'preview_url', 'rating', 'views')


class PrettyVideoSerializer(serializers.ModelSerializer):
    preview_url = serializers.SerializerMethodField()

    def get_preview_url(self, obj):
        return get_file_url(obj.preview_picture.name)

    class Meta():
        model = Source
        fields = ('key', 'name', 'created', 'preview_url')


class VideoSerializer(serializers.ModelSerializer):

    playlist_key = serializers.CharField(write_only=True)

    def create(self, validated_data, user):
        video = Video(
            name=validated_data['name'],
            description=validated_data['description'],
            owner=user,
            playlist=user.channel.playlists.get(key=validated_data['playlist_key'])
        )
        video.save()

        video.key = get_short_key(video.id)
        video.preview_picture.save(f'{user.id}/{video.key}', validated_data['preview_picture'])

        return video

    def validate_preview_picture(self, value):
        picture = value
        if not picture:
            raise serializers.ValidationError('Empty head picture.')

        if not check_image_mime_type(picture.content_type):
            raise serializers.ValidationError('Wrong head picture mime type.')

        if not check_image_size(picture.size):
            raise serializers.ValidationError('Size of head picture must be less than 10MB.')

        return picture

    def validate_playlist_key(self, value):
        playlists = Playlist.objects.filter(key=value)

        if not playlists:
            raise serializers.ValidationError('Incorrect playlist key.')

        return value

    class Meta():
        model = Video
        fields = ('name', 'description', 'preview_picture', 'playlist_key')


class VideoPartSerializer(serializers.ModelSerializer):
    class Meta():
        model = VideoPart
        fields = ('text', )

    def create(self):
        return VideoPart(**self.validated_data)

