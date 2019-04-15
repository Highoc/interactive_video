from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser

from django.shortcuts import get_object_or_404

import re
from .models import Tag
from video.models import Video
from rest_framework import serializers


class VideoTagSerializer(serializers.ModelSerializer):
    def validate_text(self, text):
        if not re.search(r'^\w+$', text):
            raise serializers.ValidationError(
                'Тег может состоять только из буквенных/цифровых символов или знаков нижнего подчеркивания'
            )
        return text.lower()

    def create(self, validated_data):
        tag, created = Tag.objects.get_or_create(**validated_data)
        return tag

    class Meta:
        model = Tag
        fields = ('text', )


class VideoTagAddView(APIView):
    def post(self, request, video_key):
        tag_serializer = VideoTagSerializer(data=request.data)

        video = get_object_or_404(Video, key=video_key, owner=request.user)

        if tag_serializer.is_valid():
            tag = tag_serializer.create(tag_serializer.validated_data)
            tags = video.tags.filter(text=tag.text)
            if not tags:
                video.tags.add(tag)

            return Response(VideoTagSerializer(tag).data, status=status.HTTP_200_OK)

        else:
            return Response(tag_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VideoTagDeleteView(APIView):
    def post(self, request, video_key):
        tag_serializer = VideoTagSerializer(data=request.data)
        video = get_object_or_404(Video, key=video_key, owner=request.user)

        if tag_serializer.is_valid():
            tag = tag_serializer.create(tag_serializer.validated_data)
            if tag in video.tags.all():
                video.tags.remove(tag)

            return Response({ 'status': 'deleted' }, status=status.HTTP_200_OK)

        else:
            return Response(tag_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VideoTagListView(APIView):
    def get(self, request, video_key):
        video = get_object_or_404(Video, key=video_key)
        response = [VideoTagSerializer(tag).data for tag in video.tags.all()]
        return Response(response, status=status.HTTP_200_OK)
