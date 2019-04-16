from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from application import settings

from .models import Profile
from .serializers import UserSerializer, ProfileSerializer, UserSerializerWithToken, TopSerializer, SearchSerializer
from .serializers import get_profile_form


from .helpers import get_file_url

from video.models import Video
from video.serializers import VideoPreviewSerialiser
from channel.serializers import ChannelSerializer
from channel.models import Channel

from django.utils import timezone

import jwt, time
from datetime import timedelta


class SearchView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        serializer = SearchSerializer(data=request.GET)

        if serializer.is_valid():
            data = serializer.validated_data
            text = data.get('text', '')
            tag = data.get('tag', '')
            limit = 10

            video_list = Video.objects.filter(name__icontains=text).order_by('-rating__counter')
            channel_list = Channel.objects.filter(name__icontains=text)[:limit]

            if tag == '':
                video_list = video_list[:limit]
            else:
                video_list = video_list.filter(tags__text__exact=tag)[:limit]

            response = {
                'video_list': [ VideoPreviewSerialiser(video).data for video in video_list ],
                'channel_list': [ ChannelSerializer(channel).data for channel in channel_list],
             }

            return Response(response, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)


class MyTopView(APIView):
    def get(self, request):
        channel_list = request.user.subscriptions.all()

        response = []
        for channel in channel_list:
            video_list = channel.owner.video.order_by('-created')[:10]

            response.append({
                'list': VideoPreviewSerialiser(video).data for video in video_list
            })

        return Response(response, status=status.HTTP_200_OK)


class UserCurrentView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status.HTTP_200_OK)


class UserSignUpView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            Profile(user=user).save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserSubscriptionsList(APIView):
    def get(self, request):
        subscriptions = [{
            'channel_key': channel.key,
            'name': channel.name,
        } for channel in request.user.subscriptions.all()]
        return Response(subscriptions, status=status.HTTP_200_OK)


class CentrifugoTokenView(APIView):
    def get(self, request):
        claims = {
            "sub": str(request.user.id),
            "exp": int(time.time()) + 24 * 60 * 60
        }
        token = jwt.encode(claims, settings.CENTRIFUGO_SECRET, algorithm="HS256").decode()
        return Response(token, status.HTTP_200_OK)


class ProfileUpdateView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        user = request.user
        profile = Profile.objects.get(user=user)
        return Response(get_profile_form(profile), status.HTTP_200_OK)

    def post(self, request):
        profile_serializer = ProfileSerializer(data=request.data)
        if profile_serializer.is_valid():
            user = request.user
            data = profile_serializer.validated_data
            profile = Profile.objects.get(user=user)

            avatar = data.get('avatar', None)
            if avatar is not None:
                profile.avatar.save(f'{profile.key.hex}', avatar)
                profile.save()

            user.first_name = data.get('first_name')
            user.last_name = data.get('last_name')
            user.email = data.get('email', '')
            user.save()

            return Response({ 'key': profile.key.hex }, status=status.HTTP_200_OK)
        else:
            return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileCurrentView(APIView):
    def get(self, request):
        user = request.user
        profile = Profile.objects.get(user=user)
        response = {
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'date_joined': user.date_joined,
            'avatar_url': get_file_url(profile.avatar.name)
        }
        return Response(response, status=status.HTTP_200_OK)


from .serializers import NEW, HOT, POPULAR

_START_DELTA = 60
_NEW_START_DELTA = 60
_LIMIT = 20


class VideoTopView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        serializer = TopSerializer(data=request.GET)

        if serializer.is_valid():
            type = serializer.validated_data['type']
            start = timezone.now() - timedelta(days=_START_DELTA)
            video_list = Video.objects.all()
            video = []

            tag_list = ['russia', 'mailru', 'interactive', 'видео', 'cool']
            compilation = []

            if type == NEW:
                start = timezone.now() - timedelta(days=_NEW_START_DELTA)
                video = Video.objects.filter(created__gte=start)[:_LIMIT]
                for tag in tag_list:
                    compilation.append({
                        'tag': tag,
                        'list': video_list.filter(tags__text__exact=tag, created__gte=start)[:_LIMIT]
                    })

            elif type == HOT:
                video = Video.objects.filter(created__gte=start).order_by('-views__counter')[:_LIMIT]
                for tag in tag_list:
                    compilation.append({
                        'tag': tag,
                        'list': video_list.filter(
                            tags__text__exact=tag,
                            created__gte=start
                        ).order_by('-views__counter')[:_LIMIT]
                    })

            elif type == POPULAR:
                video = Video.objects.filter(created__gte=start).order_by('-rating__counter')[:_LIMIT]
                for tag in tag_list:
                    compilation.append({
                        'tag': tag,
                        'list': video_list.filter(
                            tags__text__exact=tag,
                            created__gte=start
                        ).order_by('-rating__counter')[:_LIMIT]
                    })

            response = {
                'top': [VideoPreviewSerialiser(current).data for current in video],
                'compilation': [ {
                    'tag': part['tag'],
                    'list': [VideoPreviewSerialiser(current).data for current in part['list']]
                } for part in compilation],
            }

            return Response(response, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
