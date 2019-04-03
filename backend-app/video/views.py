from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import status

from application import settings

from .serializers import SourceSerializer, VideoPartSerializer, VideoSerializer
from .models import Source, VideoPart, Video
from .helpers.video import is_supported_mime_type, get_file_url, get_mime_type, get_codec, get_duration, get_short_key, get_image_url

from rating.models import Rating
from views.models import Views
from core.helpers import check_image_size, check_image_mime_type, convert_to_byte_length, get_file_url

import io, tempfile

def get_source_form(source=None):
    name = ''
    description = ''
    preview_picture_url = ''
    if source:
        name = source.name
        description = source.description
        preview_picture_url = get_image_url(source.preview_picture)

    forms = [{
        'type': 'text',
        'name': 'name',
        'value': f'{name}',
        'description': 'Название источника',
        'rules': {
            'max_length': 64,
            'required': True
        },
    }, {
        'type': 'textarea',
        'name': 'description',
        'value': f'{description}',
        'description': 'Описание источника',
        'rules': {
            'max_length': 1024,
            'required': False
        },
    }, {
        'type': 'image',
        'name': 'preview_picture',
        'url': f'{preview_picture_url}',
        'description': 'Превью источника',
        'rules': {
            'mime_type': ['image/png'],
            'max_size': convert_to_byte_length(MB=10),
            'required': False,
        }
    }, {
        'type': 'video',
        'name': 'content',
        'description': 'Контент источника',
        'rules': {
            'mime_type': ['video/mp4'],
            'max_size': convert_to_byte_length(MB=100),
            'required': True,
        }
    }]

    return forms

class SourceUploadView(APIView):

    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        return Response(get_source_form(), status=status.HTTP_200_OK)

    def post(self, request):
        source_serializer = SourceSerializer(data=request.data)

        if source_serializer.is_valid():
            name = request.data['name']
            description = request.data['description']
            content = request.data['content']

            user = request.user

            with tempfile.NamedTemporaryFile() as temp:
                temp.write(content.read())
                temp.flush()

                content.seek(0)
                temp.seek(0)

                mime_type = get_mime_type(temp.name)
                codec = get_codec(temp.name)
                time = get_duration(temp.name)

                '''
                elif should_call_external_command():
                    temp.flush()
                    subprocess.call(["wc", temp.name])
                '''

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

            preview_picture = source_serializer.validated_data.get('preview_picture', None)
            if preview_picture != '' or not preview_picture:
                if not check_image_mime_type(preview_picture.content_type):
                    return Response('Wrong preview picture mime type.', status=status.HTTP_400_BAD_REQUEST)

                if not check_image_size(preview_picture.size):
                    return Response('Size of preview picture must be less than 10MB.',
                                    status=status.HTTP_400_BAD_REQUEST)

                source.preview_picture.save(f'{user.id}/{source.key.hex}', preview_picture)

            source.content.save(f'{user.id}/{source.key.hex}', content)
            source.save()

            response = {
                'key': source.key.hex,
                'name': source.name,
                'content_url': get_file_url(source.content.name),
                'preview_url': get_file_url(source.preview_picture.name)
            }

            return Response(response, status=status.HTTP_201_CREATED)
        else:

            return Response(source_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SourceListView(APIView):

    def get(self, request):
        # 4 части с Ready
        sources = Source.objects.filter(owner=request.user, status=Source.READY)
        responce = [{
            'key': source.key.hex,
            'name': source.name,
            'content_url': get_file_url(source.content.name),
            'preview_url': get_file_url(source.preview_picture.name)
        } for source in sources ]
        return Response(responce, status=status.HTTP_200_OK)


class SourceView(APIView):

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

# Проверять кодеки, что совместимы
class VideoUploadView(APIView):
    parser_classes = (JSONParser, )

    def get(self, request):
        return Response({'username': request.user.username})

    def post(self, request):
        video_serializer = VideoSerializer(data=request.data)
        if video_serializer.is_valid() and 'main' in request.data:
            video = video_serializer.create()
            video.owner = request.user

            try:
                main = request.data['main']
                video_parts = self.get_video_parts(main, user=request.user)

            except Exception as e:
                return Response("Video parts are incorrect", status=status.HTTP_400_BAD_REQUEST)

            #print(video_parts)
            #print(request.data)

            video.save()

            for part in video_parts: 
                if part.parent_ref is None:
                    part.parent = None
                else:
                    part.parent = part.parent_ref

                part.main_video = video
                part.save()
            
            head = video_parts[0]
            video.key = get_short_key(video.id)
            video.head_video_part = head
            video.codec = head.source.codec
            video.save()

            Views(video=video).save()
            Rating(video=video).save()

            '''
            for all sources
            status = used
            '''

            return Response({ 'key': video.key }, status=status.HTTP_201_CREATED)
        else:
            return Response(video_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_video_parts(self, data, user):
        return self.get_video_part(data, parent=None, user=user)

    def get_video_part(self, data, parent, user):
        video_part_serializer = VideoPartSerializer(data=data)
        if video_part_serializer.is_valid():
            if 'children' not in data:
                video_part = video_part_serializer.create()
                video_part.parent_ref = parent
                video_part.parent = parent
                video_part.source = Source.objects.get(key=data['source_key'], owner=user)

                return [ video_part, ]

            elif isinstance(data['children'], list):

                video_part = video_part_serializer.create()
                video_part.parent_ref = parent
                video_part.parent = parent
                video_part.source = Source.objects.get(key=data['source_key'], owner=user)

                child_list = [ video_part, ]

                for child in data['children']:
                    child_list += self.get_video_part(child, video_part, user)
                return child_list
            else:
                raise Exception

class VideoView(APIView):
    def get(self, request, key=None):
        video_list = Video.objects.filter(key=key, status=Video.PUBLIC)

        if not video_list:
            return Response('This video_part doesn\'t exist', status=status.HTTP_204_NO_CONTENT)

        video = video_list[0]

        response = {
            'name': video.name,
            'description': video.description,
            'head_video_part': video.head_video_part.key.hex,
            'head_comments': [ comment.id for comment in video.comments.filter(parent=None) ],
            'codec': video.codec,
            'created': video.created,
        }

        return Response(response, status.HTTP_200_OK)


class VideoPartView(APIView):
    def get(self, request, key=None):
        video_parts = VideoPart.objects.filter(key=key)

        if not video_parts:
            return Response('This video_part doesn\'t exist', status=status.HTTP_204_NO_CONTENT)

        video_part = video_parts[0]
        if video_part.main_video.status != Video.PUBLIC:
            return Response('This video_part doesn\'t exist', status=status.HTTP_204_NO_CONTENT)

        source = video_part.source

        url = get_file_url(
            settings.AWS_STORAGE_BUCKET_NAME,
            video_part.main_video.owner,
            source.key.hex
        )

        response = {
            'key': key,
            'content_url': url,
            'time': source.time,
            'text': video_part.text,
            'children': [ child.key.hex for child in video_part.children.all() ],
        }

        return Response(response, status.HTTP_200_OK)
