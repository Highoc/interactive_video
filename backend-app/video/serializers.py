from rest_framework import serializers

from core.helpers import get_file_url

from .models import Source, Video, VideoPart


class SourceSerializer(serializers.ModelSerializer):
    class Meta():
        model = Source
        fields = ('name', 'description', 'preview_picture', 'content')


class VideoSerializer(serializers.ModelSerializer):
    class Meta():
        model = Video
        fields = ('name', 'description')

    def create(self):
        return Video(**self.validated_data)


class VideoPartSerializer(serializers.ModelSerializer):
    class Meta():
        model = VideoPart
        fields = ('text', )

    def create(self):
        return VideoPart(**self.validated_data)


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
        fields = ('name', 'description', 'preview_url', 'created', 'channel', 'preview_url', 'rating', 'views')
