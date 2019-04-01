from rest_framework import serializers

from .models import Channel, Playlist

class ChannelSerializer(serializers.ModelSerializer):
    class Meta():
        model = Channel
        fields = ('name', 'description')

    def create(self):
        return Channel(**self.validated_data)


class PlaylistSerializer(serializers.ModelSerializer):
    class Meta():
        model = Playlist
        fields = ('name', 'description')

    def create(self):
        return Playlist(**self.validated_data)
