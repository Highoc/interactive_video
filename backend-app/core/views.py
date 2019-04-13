from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from application import settings

from .models import Profile
from .serializers import UserSerializer, ProfileSerializer, UserSerializerWithToken, TopSerializer
from .helpers import get_avatar_url, convert_to_byte_length, check_image_mime_type, check_image_size

from video.models import Video
from video.serializers import VideoPreviewSerialiser
from channel.models import Channel

import jwt, time
from datetime import datetime, timedelta

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

        form = [{
            'type': 'image',
            'name': 'avatar',
            'url': f'{get_avatar_url(profile.key)}',
            'description': 'Аватар профиля',
            'rules': {
                'mime_type': ['image/png'],
                'max_size': convert_to_byte_length(MB=10),
                'required': False,
            }
        }, {
            'type': 'text',
            'name': 'first_name',
            'value': f'{user.first_name}',
            'description': 'Имя',
            'rules': {
                'max_length': 16,
                'required': True,
            }
        }, {
            'type': 'text',
            'name': 'last_name',
            'value': f'{user.last_name}',
            'description': 'Фамилия',
            'rules': {
                'max_length': 16,
                'required': True,
            }
        }, {
            'type': 'email',
            'name': 'email',
            'value': f'{user.email}',
            'description': 'Электронная почта',
            'rules': {
                'required': False,
            }
        }]

        return Response(form, status.HTTP_200_OK)

    def post(self, request):
        profile_serializer = ProfileSerializer(data=request.data)

        if profile_serializer.is_valid():
            user = request.user
            profile = Profile.objects.get(user=user)
            data = profile_serializer.validated_data

            avatar = data.get('avatar', None)
            if avatar != '' or not avatar:
                if not check_image_mime_type(avatar.content_type):
                    return Response('Wrong avatar mime type.', status=status.HTTP_400_BAD_REQUEST)

                if not check_image_size(avatar.size):
                    return Response('Size of avatar must be less than 10MB.', status=status.HTTP_400_BAD_REQUEST)

                profile.avatar.save(f'{profile.key.hex}', avatar)
            profile.save()

            first_name = data.get('first_name')
            last_name = data.get('last_name')
            email = data.get('email', '')

            user.first_name = first_name
            user.last_name = last_name
            user.email = email
            user.save()

            return Response({ 'key': profile.key.hex }, status=status.HTTP_201_CREATED)
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
            'avatar_url': get_avatar_url(profile.key)
        }
        return Response(response, status=status.HTTP_200_OK)


from .serializers import NEW, HOT, POPULAR

_START_DELTA = 60
_NEW_START_DELTA = 60
_LIMIT = 20


class VideoTopView(APIView):
    def get(self, request):
        serializer = TopSerializer(request.GET)
        if serializer.is_valid():
            type = serializer.validated_data['type']
            start = datetime.now() - timedelta(days=_START_DELTA)
            video = []
            if type == NEW:
                start = datetime.now() - timedelta(days=_NEW_START_DELTA)
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
