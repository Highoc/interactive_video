from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User

from .models import Profile
from .helpers import get_file_url, convert_to_byte_length, check_image_mime_type, check_image_size
import re


class UserSerializer(serializers.ModelSerializer):
    channel = serializers.SerializerMethodField()

    def get_channel(self, obj):
        channel = {}
        if hasattr(obj, 'channel'):
            channel['key'] = obj.channel.key
            channel['is_exist'] = True
        else:
            channel['key'] = ''
            channel['is_exist'] = False
        return channel


    class Meta:
        model = User
        fields = ('id', 'username', 'is_superuser', 'channel')
        read_only_fields = ('is_superuser',)


class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate_username(self, value):
        if not re.search(r'^\w+$', value):
            raise serializers.ValidationError('Username can only contain alphanumeric characters and the underscore.')
        if User.objects.filter(username=value):
            raise serializers.ValidationError('Username is already taken.')
        return value

    def validate(self, data):
        password1 = data.get('password1')
        password2 = data.get('password2')
        if password1 != password2:
            raise serializers.ValidationError('Passwords do not match.')
        return data

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password1 = validated_data.pop('password1', None)
        validated_data.pop('password2', None)
        instance = self.Meta.model(**validated_data)
        if password1 is not None:
            instance.set_password(password1)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('token', 'username', 'password1', 'password2')


HOT = 'hot'
NEW = 'new'
POPULAR = 'popular'
TYPE_CHOICES = (
    (HOT, 'hot'),
    (NEW, 'new'),
    (POPULAR, 'popular'),
)

class TopSerializer(serializers.Serializer):
    type = serializers.ChoiceField(choices=TYPE_CHOICES)


class SearchSerializer(serializers.Serializer):
    text = serializers.CharField(max_length=32, required=False)
    tag = serializers.CharField(max_length=16, required=False)


def get_profile_form(profile=None):
    avatar_url = ''
    first_name = ''
    last_name = ''
    email = ''

    if profile:
        user = profile.user
        avatar_url = get_file_url(profile.avatar.name)
        first_name = user.first_name
        last_name = user.last_name
        email = user.email

    form = [{
        'type': 'image',
        'name': 'avatar',
        'previewUrl': f'{avatar_url}',
        'label': 'Аватар пользователя',
        'placeholder': 'Выберите аватар пользователя...',
        'rules': {
            'mimetypes': ['image/png'],
            'max_size': convert_to_byte_length(MB=10),
            'required': False,
        }
    }, {
        'type': 'text',
        'name': 'first_name',
        'label': 'Имя пользователя',
        'placeholder': 'Напишите ваше имя...',
        'value': f'{first_name}',
        'rules': {
            'max_length': 16,
            'required': True,
        }
    }, {
        'type': 'text',
        'name': 'last_name',
        'value': f'{last_name}',
        'label': 'Фамилия пользователя',
        'placeholder': 'Напишите вашу фамилию...',
        'rules': {
            'max_length': 16,
            'required': True,
        }
    }, {
        'type': 'email',
        'name': 'email',
        'value': f'{email}',
        'label': 'Электронная почта',
        'placeholder': 'Напишите вашу электронную почту...',
        'rules': {
            'required': False,
        }
    }]

    return form


class ProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(max_length=16, required=True)
    last_name = serializers.CharField(max_length=16, required=True)
    email = serializers.EmailField(required=False)

    def validate_avatar(self, value):
        avatar = value
        if not avatar:
            raise serializers.ValidationError('Empty avatar source.')

        if not check_image_mime_type(avatar.content_type):
            raise serializers.ValidationError('Wrong avatar mime type.')

        if not check_image_size(avatar.size):
            raise serializers.ValidationError('Size of avatar must be less than 10MB.')

        return avatar

    class Meta():
        model = Profile
        fields = ('avatar', 'first_name', 'last_name', 'email')
