from rest_framework import serializers

from .models import Channel

class ChannelSerializer(serializers.ModelSerializer):
    class Meta():
        model = Channel
        fields = ('name', 'description')

    def create(self):
        return Channel(**self.validated_data)
