from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import status, permissions

from application import settings

from .serializers import SourceSerializer
from .models import Source, VideoPart, Video
from .helpers.video import is_supported_mime_type, get_file_url, get_mime_type, get_codec, get_duration

import io, tempfile

class SourceUploadView(APIView):

    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        return Response({ 'username': request.user.username })

    def post(self, request):
        source_serializer = SourceSerializer(data=request.data)

        if source_serializer.is_valid():
            name = request.data['name']
            description = request.data['description']
            content = request.data['content']

            user = request.user
            if isinstance(content.file, io.BytesIO):
                with tempfile.NamedTemporaryFile() as temp:
                    temp.write(content.file.read())
                    temp.seek(0)

                    mime_type = get_mime_type(temp.name)
                    codec = get_codec(temp.name)
                    time = get_duration(temp.name)
                    '''
                    elif should_call_external_command():
                        temp.flush()
                        subprocess.call(["wc", temp.name])
                    '''
            elif isinstance(content.file, tempfile._TemporaryFileWrapper):
                temp = content.file
                mime_type = get_mime_type(temp.name)
                codec = get_codec(temp.name)
                time = get_duration(temp.name)
            else:
                return Response('This source isn\'t supported.', status=status.HTTP_400_BAD_REQUEST)

            if not is_supported_mime_type(mime_type):
                return Response('This MIME type isn\'t supported.', status=status.HTTP_400_BAD_REQUEST)

            source = Source(
                name=name,
                description=description,
                owner=user,
                mime=mime_type,
                time=time,
                codec=codec,
                status=Source.READY
            )

            source.content.save(f'{user.id}/{source.key.hex}', content)
            source.save()

            return Response({'key': source.key.hex }, status=status.HTTP_201_CREATED)
        else:

            return Response(source_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SourceInfoView(APIView):

    def get(self, request):
        sources = Source.objects.filter(owner=request.user)
        short_sources_list = []
        for source in sources:
            short_sources_list.append({ source.key: source.name })
        return Response({ 'sources': short_sources_list })


class SourceGetView(APIView):

    def get(self, request, key=None):
        sources = Source.objects.filter(owner=request.user, key=key, status=Source.READY)

        if not sources:
            return Response('This source doesn\'t exist', status=status.HTTP_404_NOT_FOUND)

        source = sources[0]
        url = get_file_url(settings.AWS_STORAGE_BUCKET_NAME, request.user, key)

        return Response({
            'name': source.name,
            'description': source.description,
            'content_url': url,
            'created': source.created,
        })


class VideoUploadView(APIView):
    parser_classes = (JSONParser, )

    def get(self, request):
        return Response({'username': request.user.username})

    def post(self, request):
        pass


# Протестить
class VideoGetView(APIView):
    def get(self, request, key=None):
        video_list = Video.objects.filter(key=key, status=Video.PUBLISHED)

        if not video_list:
            return Response('This video_part doesn\'t exist', status=status.HTTP_204_NO_CONTENT)

        # Проверка на доступность видео (video еще может быть не опубликовано)

        video = video_list[0]

        responce = {
            'name': video.name,
            'description': video.description,
            'head_video_part': video.head_video_part.key.hex,
            'codec': video.codec,
            'created': video.created,
        }

        return Response(responce, status.HTTP_200_OK)


# Протестить
class VideoPartGetView(APIView):
    def get(self, request, key=None):
        video_parts = VideoPart.objects.filter(key=key)

        if not video_parts:
            return Response('This video_part doesn\'t exist', status=status.HTTP_204_NO_CONTENT)

        video_part = video_parts[0]
        if video_part.main_video.statuses != Video.PUBLISHED:
            return Response('This video_part doesn\'t exist', status=status.HTTP_204_NO_CONTENT)

        source = video_part.source

        url = get_file_url(
            settings.AWS_STORAGE_BUCKET_NAME,
            video_part.main_video.owner,
            source.key
        )

        responce = {
            'key': key,
            'content_url': url,
            'time': source.time,
            'text': video_part.text,
            'children': [ child.key.hex for child in video_part.children.all() ],
        }

        return Response(responce, status.HTTP_200_OK)
