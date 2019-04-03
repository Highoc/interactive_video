from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from application import settings

from .models import Profile
from .serializers import UserSerializer, ProfileSerializer, UserSerializerWithToken
from .helpers import get_avatar_url, convert_to_byte_length, check_image_mime_type, check_image_size

import jwt, time


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

