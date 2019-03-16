from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import ChannelSerializer
from .models import Channel, Playlist

from video.helpers.video import get_short_key

class ChannelUpdateView(APIView):

    def get(self, request):
        channel = Channel.objects.filter(owner=request.user)

        name = ""
        description = ""

        if channel:
            channel = channel[0]
            name = channel.name
            description = channel.description

        forms = [{
            'type': 'text',
            'name': 'name',
            'value': f'{name}',
            'description': 'Название канала',
            'rules': [
                { 'max_length': 64 },
                { 'required': True },
            ]
        }, {
            'type': 'textarea',
            'name': 'description',
            'value': f'{description}',
            'description': 'Описание канала',
            'rules': [
                { 'max_length': 4096 },
                { 'required': False },
            ]
        }]

        return Response(forms, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ChannelSerializer(request.data)
        if serializer.is_valid():
            channel = Channel.objects.filter(owner=request.user)
            data = serializer.validated_data
            if channel:
                channel = channel[0]
                channel.name = data['name']
                channel.description = data['description']
                channel.save()
                return Response({ 'key': channel.key }, status=status.HTTP_200_OK)
            else:
                channel = serializer.save(owner=request.user)
                channel.key = get_short_key(channel.id)
                channel.save()

                Playlist(
                    name='Все видео',
                    description='Все ваши загруженные видео',
                    status=Playlist.UPLOADED,
                    channel=channel
                ).save()

                Playlist(
                    name='Скрытые видео',
                    description='Все ваши скрытые видео',
                    status=Playlist.HIDDEN,
                    channel=channel
                ).save()

                Playlist(
                    name='Удаленные видео',
                    description='Все ваши удаленные видео',
                    status=Playlist.DELETED,
                    channel=channel
                ).save()

                return Response({'key': channel.key}, status=status.HTTP_201_CREATED)

        else:
            return Response("nope", status=status.HTTP_400_BAD_REQUEST)