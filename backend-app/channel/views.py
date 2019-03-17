from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import ChannelSerializer
from .models import Channel, Playlist

from video.helpers.video import get_short_key

class ChannelUpdateView(APIView):

    def get(self, request):
        channel = Channel.objects.filter(owner=request.user, status=Channel.AVAILABLE)

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
            'rules': {
                'max_length': 64,
                'required': True
            },
        }, {
            'type': 'textarea',
            'name': 'description',
            'value': f'{description}',
            'description': 'Описание канала',
            'rules': {
                'max_length': 4096,
                'required': False
            },
        }]

        return Response(forms, status=status.HTTP_200_OK)

    def post(self, request):
        return Response("nope", status=status.HTTP_400_BAD_REQUEST)
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


class ChannelView(APIView):
    def get(self, request, channel_key):

        channels = Channel.objects.filter(key=channel_key, status=Channel.AVAILABLE)
        if not channels:
            return Response('Channel doesn\'t exist.', status=status.HTTP_404_NOT_FOUND)

        channel = channels[0]
        uploaded_playlist = channel.playlists.get(status=Playlist.UPLOADED)

        response = {
            'name': channel.name,
            'description': channel.description,
            'owner': {
                'id': channel.owner.id,
                'username': channel.owner.username,
            },
            'uploaded_playlist': {
                'name': uploaded_playlist.name,
                'description': uploaded_playlist.description,
                'status': uploaded_playlist.status,
                'video': [{
                    'key': video.key,
                    'name': video.name,
                    'created': video.created,
                    'preview_url': f'https://hb.bizmrg.com/interactive_video/public_pic/{video.id % 3 + 1}.jpg'
                } for video in uploaded_playlist.video.all()]
            },
            'created': channel.created
        }

        return Response(response, status=status.HTTP_200_OK)


class PlaylistAllView(APIView):
    def get(self, request, channel_key):

        channels = Channel.objects.filter(key=channel_key, status=Channel.AVAILABLE)
        if not channels:
            return Response('Channel doesn\'t exist.', status=status.HTTP_404_NOT_FOUND)

        channel = channels[0]

        playlist_statuses = [Playlist.UPLOADED, Playlist.PUBLIC]
        if request.user == channel.owner:
            playlist_statuses += [Playlist.HIDDEN, Playlist.DELETED]

        response = [{
            'name': playlist.name,
            'description': playlist.description,
            'key': playlist.key,
            'status': playlist.status,
            'preview_url': f'https://hb.bizmrg.com/interactive_video/public_pic/list{playlist.id % 3 + 1}.jpg'
        } for playlist in channel.playlists.filter(status__in=playlist_statuses)]

        return Response(response, status=status.HTTP_200_OK)


class PlaylistGetView(APIView):
    def get(self, request, channel_key, playlist_key):

        channels = Channel.objects.filter(key=channel_key, status=Channel.AVAILABLE)
        if not channels:
            return Response('Channel doesn\'t exist.', status=status.HTTP_404_NOT_FOUND)

        channel = channels[0]

        playlist_statuses = [Playlist.UPLOADED, Playlist.PUBLIC]
        if request.user == channel.owner:
            playlist_statuses += [Playlist.HIDDEN, Playlist.DELETED]

        playlists = channel.playlists.filter(key=playlist_key, status__in=playlist_statuses)
        if not playlists:
            return Response('Playlist doesn\'t exist.', status=status.HTTP_404_NOT_FOUND)

        playlist = playlists[0]

        response = {
            'name': playlist.name,
            'description': playlist.description,
            'status': playlist.status,
            'video': [{
                'key': video.key,
                'name': video.name,
                'created': video.created,
                'preview_url': f'https://hb.bizmrg.com/interactive_video/public_pic/{video.id % 3 + 1}.jpg'
            } for video in playlist.video.all()]
        }

        return Response(response, status=status.HTTP_200_OK)

class ChannelListView(APIView):
    def get(self, request):
        channels = Channel.objects.filter(status=Channel.AVAILABLE)

        response = [{
            'name': channel.name,
            'key': channel.key,
        } for channel in channels]

        return Response(response, status.HTTP_200_OK)