from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from application import settings

from .models import Profile
from .serializers import UserSerializer, ProfileSerializer, UserSerializerWithToken, TopSerializer
from .serializers import get_profile_form

from .helpers import get_file_url

from video.models import Video
from video.serializers import VideoPreviewSerialiser
from channel.models import Channel

from django.utils import timezone

import jwt, time
from datetime import timedelta

class SearchView(APIView):
    def get(self, request):

        if not request.data:
            return Response('Wrong GET data', status=status.HTTP_400_BAD_REQUEST)

        search_word = request.data['search']
        limit = 20

        video = Video.objects.filter(name__icontains=search_word)[:limit]
        channels = Channel.objects.filter(name__icontains=search_word)[:limit]

        response = {
            'video': [ {
                'key': curr.key,
                'name': curr.name,
            } for curr in video],
            'channels': [ {
                'key': channel.key,
                'name': channel.name
            } for channel in channels]
        }


        return Response(response, status=status.HTTP_200_OK_NOT_IMPLEMENTED)


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
            video = []
            if type == NEW:
                start = timezone.now() - timedelta(days=_NEW_START_DELTA)
                video = Video.objects.filter(created__gte=start)[:_LIMIT]
            elif type == HOT:
                video = Video.objects.filter(created__gte=start).order_by('-views__counter')[:_LIMIT]
            elif type == POPULAR:
                video = Video.objects.filter(created__gte=start).order_by('-rating__counter')[:_LIMIT]

            response = {
                'top': [VideoPreviewSerialiser(current).data for current in video],
            }

            return Response(response, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
