from rest_framework import serializers

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