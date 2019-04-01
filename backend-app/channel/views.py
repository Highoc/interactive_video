from application import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import ChannelSerializer, PlaylistSerializer
from .models import Channel, Playlist

from video.helpers.video import get_short_key

from cent import Client

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
        serializer = ChannelSerializer(data=request.data)
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
                channel = serializer.create()
                channel.owner = request.user
                channel.save()
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
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
            'created': channel.created,
            'subscription': {
                'is_active': channel in request.user.subscriptions.all(),
            }
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


def get_playlist_form(playlist=None):
    name = ""
    description = ""

    if playlist:
        name = playlist.name
        description = playlist.description

    forms = [{
        'type': 'text',
        'name': 'name',
        'value': f'{name}',
        'description': 'Название плейлиста',
        'rules': {
            'max_length': 32,
            'required': True
        },
    }, {
        'type': 'textarea',
        'name': 'description',
        'value': f'{description}',
        'description': 'Описание плейлиста',
        'rules': {
            'max_length': 1024,
            'required': False
        },
    }]

    return forms


class PlaylistCreateView(APIView):
    def get(self, request, channel_key):
        if request.user.channel.key != channel_key:
            return Response("Wrong channel key.", status=status.HTTP_400_BAD_REQUEST)

        forms = get_playlist_form()
        return Response(forms, status=status.HTTP_200_OK)

    def post(self, request, channel_key):
        if request.user.channel.key != channel_key:
            return Response("Wrong channel key.", status=status.HTTP_400_BAD_REQUEST)
        serializer = PlaylistSerializer(data=request.data)
        if serializer.is_valid():
            playlist = serializer.create()
            playlist.channel=request.user.channel
            playlist.save()

            playlist.key=get_short_key(playlist.id)
            playlist.save()

            return Response({'key': playlist.key}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlaylistUpdateView(APIView):
    def get(self, request, channel_key, playlist_key):
        if request.user.channel.key != channel_key:
            return Response("Wrong channel key.", status=status.HTTP_400_BAD_REQUEST)

        playlists = request.user.channel.playlists.filter(key=playlist_key)
        if not playlists:
            return Response("Wrong playlist key.", status=status.HTTP_400_BAD_REQUEST)

        forms = get_playlist_form(playlists[0])
        return Response(forms, status=status.HTTP_200_OK)

    def post(self, request, channel_key, playlist_key):
        if request.user.channel.key != channel_key:
            return Response("Wrong channel key.", status=status.HTTP_400_BAD_REQUEST)

        playlists = request.user.channel.playlists.filter(key=playlist_key)
        if not playlists:
            return Response("Wrong playlist key.", status=status.HTTP_400_BAD_REQUEST)

        playlist = playlists[0]

        serializer = PlaylistSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data

            playlist.name = data['name']
            playlist.description = data['description']
            playlist.save()

            return Response({'key': playlist.key}, status=status.HTTP_200_OK)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


class ChannelSubscribersListView(APIView):
    def get(self, request, channel_key):
        channels = Channel.objects.filter(key=channel_key, status=Channel.AVAILABLE)
        if not channels:
            return Response('Channel doesn\'t exist.', status=status.HTTP_404_NOT_FOUND)

        channel = channels[0]

        subscribers = {
            'count': channel.subscribers.count(),
        }

        if channel.owner == request.user:
            subscribers['list'] = [{
                'username': subscriber.username,
            } for subscriber in channel.subscribers.all()]

        return Response(subscribers, status=status.HTTP_200_OK)


class ChannelSubscribeView(APIView):
    def post(self, request, channel_key):
        channels = Channel.objects.filter(key=channel_key, status=Channel.AVAILABLE)
        if not channels:
            return Response('Channel doesn\'t exist.', status=status.HTTP_404_NOT_FOUND)

        channel = channels[0]

        if not channel.subscribers.filter(id=request.user.id):
            channel.subscribers.add(request.user)

        response = {
            'channel_key': channel.key,
            'name': channel.name,
            'is_active': True,
        }

        client = Client(settings.CENTRIFUGO_URL, api_key=settings.CENTRIFUGO_API_KEY, timeout=1)
        channel = f"subscriptions#{request.user.id}"
        client.publish(channel, response)

        return Response(response, status=status.HTTP_200_OK)


class ChannelUnsubscribeView(APIView):
    def post(self, request, channel_key):
        channels = Channel.objects.filter(key=channel_key, status=Channel.AVAILABLE)
        if not channels:
            return Response('Channel doesn\'t exist.', status=status.HTTP_404_NOT_FOUND)

        channel = channels[0]

        if channel.subscribers.filter(id=request.user.id):
            channel.subscribers.remove(request.user)

        response = {
            'channel_key': channel.key,
            'name': channel.name,
            'is_active': False,
        }

        client = Client(settings.CENTRIFUGO_URL, api_key=settings.CENTRIFUGO_API_KEY, timeout=1)
        channel = f"subscriptions#{request.user.id}"
        client.publish(channel, response)

        return Response(response, status=status.HTTP_200_OK)
