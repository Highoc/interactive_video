from rest_framework import serializers

from .models import Channel, Playlist

from core.helpers import get_file_url, convert_to_byte_length, check_image_mime_type, check_image_size, get_short_key
from video.serializers import PrettyVideoSerializer


def get_playlist_form(playlist=None):
    name = ''
    description = ''
    picture_url = ''
    if playlist:
        name = playlist.name
        description = playlist.description
        picture_url = get_file_url(playlist.preview_picture.name)

    form = [{
        'type': 'text',
        'name': 'name',
        'value': f'{name}',
        'label': 'Название плейлиста',
        'placeholder': 'Введите название плейлиста...',
        'rules': {
            'max_length': 32,
            'required': True
        },
    }, {
        'type': 'textarea',
        'name': 'description',
        'value': f'{description}',
        'label': 'Описание плейлиста',
        'placeholder': 'Введите описание плейлиста...',
        'rules': {
            'max_length': 1024,
            'required': False
        },
    }, {
            'type': 'image',
            'name': 'preview_picture',
            'url': f'{picture_url}',
            'label': 'Превью плейлиста',
            'placeholder': 'Выберите изображение...',
            'rules': {
                'mimetypes': ['image/png'],
                'max_size': convert_to_byte_length(MB=10),
                'required': True,
            }
    }]

    return form


def get_channel_form(channel=None):
    name = ''
    description = ''
    picture_url = ''

    if channel:
        name = channel.name
        description = channel.description
        picture_url = get_file_url(channel.head_picture.name)

    form = [{
        'type': 'text',
        'name': 'name',
        'value': f'{name}',
        'label': 'Название канала',
        'placeholder': 'Введите название канала...',
        'rules': {
            'max_length': 64,
            'required': True
        },
    }, {
        'type': 'textarea',
        'name': 'description',
        'value': f'{description}',
        'label': 'Описание канала',
        'placeholder': 'Введите описание канала...',
        'rules': {
            'max_length': 4096,
            'required': False
        },
    }, {
        'type': 'image',
        'name': 'head_picture',
        'url': f'{picture_url}',
        'label': 'Шапка канала',
        'placeholder': 'Выберите изображение разрешением 150 на 1300 px...',
        'rules': {
            'mimetypes': ['image/png'],
            'max_size': convert_to_byte_length(MB=10),
            'required': True,
        }
    }]

    return form


class PlaylistSerializer(serializers.ModelSerializer):
    def validate_preview_picture(self, value):
        preview = value
        if not preview:
            raise serializers.ValidationError('Empty avatar source.')

        if not check_image_mime_type(preview.content_type):
            raise serializers.ValidationError('Wrong preview picture mime type.')

        if not check_image_size(preview.size):
            raise serializers.ValidationError('Size of preview picture must be less than 10MB.')

        return preview

    def create(self, validated_data, user):
        data = validated_data

        playlist = Playlist()
        playlist.name = data['name']
        playlist.description = data['description'],
        playlist.channel = user.channel
        playlist.save()

        playlist.key = get_short_key(playlist.id)
        playlist.preview_picture.save(f'{user.id}/{playlist.key}', data['preview_picture'])

        playlist.save()
        return playlist

    def update(self, instance, validated_data, user):
        data = validated_data

        playlist = instance
        playlist.name = data['name']
        playlist.description = data['description']
        playlist.preview_picture.save(f'{user.id}/{playlist.key}', data['preview_picture'])

        playlist.save()
        return playlist

    class Meta():
        model = Playlist
        fields = ('name', 'description', 'preview_picture')


class PrettyPlaylistSerializer(serializers.ModelSerializer):
    preview_url = serializers.SerializerMethodField()

    def get_preview_url(self, obj):
        return get_file_url(obj.preview_picture.name)

    class Meta():
        model = Playlist
        fields = ('key', 'name', 'description', 'status', 'preview_url')


class PlaylistFullSerializer(serializers.ModelSerializer):
    video = PrettyVideoSerializer(many=True, read_only=True)

    class Meta():
        model = Playlist
        fields = ('name', 'description', 'status', 'video')


class ChannelSerializer(serializers.ModelSerializer):
    key = serializers.SerializerMethodField()

    def get_key(self, obj):
        return obj.key

    def validate_head_picture(self, value):
        picture = value
        if not picture:
            raise serializers.ValidationError('Empty head picture.')

        if not check_image_mime_type(picture.content_type):
            raise serializers.ValidationError('Wrong head picture mime type.')

        if not check_image_size(picture.size):
            raise serializers.ValidationError('Size of head picture must be less than 10MB.')

        return picture

    def create(self, validated_data, user):
        data = validated_data

        channel = Channel()
        channel.owner = user
        channel.name = data['name']
        channel.description = data['description']
        channel.save()

        channel.key = get_short_key(channel.id)
        picture = data.get('head_picture', None)
        if picture:
            channel.head_picture.save(f'{user.id}/{channel.key}', data['head_picture'])
        channel.save()

        return channel

    def update(self, instance, validated_data, user):
        channel = instance
        data = validated_data

        channel.name = data['name']
        channel.description = data['description']

        picture = data.get('head_picture', None)
        if picture:
            channel.head_picture.save(f'{user.id}/{channel.key}', picture)
        channel.save()

        return channel

    class Meta():
        model = Channel
        fields = ('name', 'key', 'description', 'head_picture')


class PrettyChannelSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()
    uploaded_playlist = serializers.SerializerMethodField()
    head_picture = serializers.SerializerMethodField()

    def get_owner(self, obj):
        channel = obj
        return { 'id': channel.owner.id, 'username': channel.owner.username }

    def get_head_picture(self, obj):
        channel = obj
        return get_file_url(channel.head_picture.name)

    def get_uploaded_playlist(self, obj):
        channel = obj
        uploaded_playlist = channel.playlists.get(status=Playlist.UPLOADED)
        return PlaylistFullSerializer(uploaded_playlist).data

    class Meta():
        model = Channel
        fields = ('name', 'description', 'owner', 'uploaded_playlist', 'created', 'head_picture')


