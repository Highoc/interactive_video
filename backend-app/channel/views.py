from application import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status

from .serializers import ChannelSerializer, PrettyChannelSerializer, PlaylistSerializer, PlaylistFullSerializer, PrettyPlaylistSerializer
from .serializers import get_playlist_form, get_channel_form

from .models import Channel, Playlist

from core.helpers import get_short_key

from cent import Client


class ChannelView(APIView):
    def get(self, request, channel_key):
        channels = Channel.objects.filter(key=channel_key, status=Channel.AVAILABLE)
        if not channels:
            return Response('Channel doesn\'t exist.', status=status.HTTP_404_NOT_FOUND)

        channel = channels[0]

        response = PrettyChannelSerializer(channel).data
        response['subscription'] = { 'is_active': channel in request.user.subscriptions.all() }

        return Response(response, status=status.HTTP_200_OK)


class ChannelUpdateView(APIView):
    def get(self, request):
        channel = None
        channels = Channel.objects.filter(owner=request.user, status=Channel.AVAILABLE)
        if channels:
            channel = channels[0]

        return Response(get_channel_form(channel), status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ChannelSerializer(data=request.data)
        if serializer.is_valid():
            channels = Channel.objects.filter(owner=request.user)
            if channels:
                channel = channels[0]
                channel = serializer.update(
                    instance=channel,
                    validated_data=serializer.validated_data,
                    user=request.user
                )
                return Response({ 'key': channel.key }, status=status.HTTP_200_OK)
            else:
                channel = serializer.create(validated_data=serializer.validated_data, user=request.user)

                uploaded = Playlist(
                    name='Все видео',
                    description='Все ваши загруженные видео',
                    status=Playlist.UPLOADED,
                    channel=channel
                )
                uploaded.save()

                uploaded.key = get_short_key(uploaded.id)
                uploaded.save()

                hidden = Playlist(
                    name='Скрытые видео',
                    description='Все ваши скрытые видео',
                    status=Playlist.HIDDEN,
                    channel=channel
                )
                hidden.save()

                hidden.key = get_short_key(hidden.id)
                hidden.save()

                deleted = Playlist(
                    name='Удаленные видео',
                    description='Все ваши удаленные видео',
                    status=Playlist.DELETED,
                    channel=channel
                )
                deleted.save()

                deleted.key = get_short_key(deleted.id)
                deleted.save()

                return Response({'key': channel.key}, status=status.HTTP_201_CREATED)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChannelListView(APIView):
    def get(self, request):
        channels = Channel.objects.filter(status=Channel.AVAILABLE)
        response = [ { 'name': channel.name, 'key': channel.key } for channel in channels]
        return Response(response, status.HTTP_200_OK)


class PlaylistCreateView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, channel_key):
        if request.user.channel.key != channel_key:
            return Response("Wrong channel key.", status=status.HTTP_400_BAD_REQUEST)

        return Response(get_playlist_form(), status=status.HTTP_200_OK)

    def post(self, request, channel_key):
        if request.user.channel.key != channel_key:
            return Response("Wrong channel key.", status=status.HTTP_400_BAD_REQUEST)

        serializer = PlaylistSerializer(data=request.data)
        if serializer.is_valid():
            playlist = serializer.create(validated_data=serializer.validated_data, user=request.user)
            return Response({'key': playlist.key}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlaylistUpdateView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, channel_key, playlist_key):
        if request.user.channel.key != channel_key:
            return Response("Wrong channel key.", status=status.HTTP_400_BAD_REQUEST)

        playlists = request.user.channel.playlists.filter(key=playlist_key)
        if not playlists:
            return Response("Wrong playlist key.", status=status.HTTP_400_BAD_REQUEST)

        return Response(get_playlist_form(playlists[0]), status=status.HTTP_200_OK)

    def post(self, request, channel_key, playlist_key):
        if request.user.channel.key != channel_key:
            return Response("Wrong channel key.", status=status.HTTP_400_BAD_REQUEST)

        playlists = request.user.channel.playlists.filter(key=playlist_key)
        if not playlists:
            return Response("Wrong playlist key.", status=status.HTTP_400_BAD_REQUEST)

        playlist = playlists[0]

        serializer = PlaylistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.update(instance=playlist, validated_data=serializer.validated_data, user=request.user)
            return Response({'key': playlist.key}, status=status.HTTP_200_OK)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlaylistDeleteView(APIView):
    def post(self, request, channel_key, playlist_key):
        channels = Channel.objects.filter(key=channel_key, status=Channel.AVAILABLE)
        if not channels or request.user.channel.key != channel_key:
            return Response('Channel doesn\'t exist.', status=status.HTTP_404_NOT_FOUND)
        channel = channels[0]

        playlists = request.user.channel.playlists.filter(key=playlist_key, status=Playlist.PUBLIC)
        if not playlists:
            return Response("Wrong playlist key.", status=status.HTTP_400_BAD_REQUEST)

        playlist = playlists[0]
        hidden_playlist = channel.playlists.get(status=Playlist.HIDDEN)

        for video in playlist.video.all():
            video.playlist = hidden_playlist
            video.save()

        playlist.delete()

        return Response({ 'status': 'ok' }, status=status.HTTP_200_OK)


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

        return Response(PlaylistFullSerializer(playlists[0]).data, status=status.HTTP_200_OK)


class PlaylistAllView(APIView):
    def get(self, request, channel_key):

        channels = Channel.objects.filter(key=channel_key, status=Channel.AVAILABLE)
        if not channels:
            return Response('Channel doesn\'t exist.', status=status.HTTP_404_NOT_FOUND)

        channel = channels[0]

        playlist_statuses = [Playlist.UPLOADED, Playlist.PUBLIC]
        if request.user == channel.owner:
            playlist_statuses += [Playlist.HIDDEN, Playlist.DELETED]

        response = [ PrettyPlaylistSerializer(playlist).data for playlist in channel.playlists.filter(status__in=playlist_statuses)]

        return Response(response, status=status.HTTP_200_OK)


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
