from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status, permissions

from application import settings

from .serializers import SourceSerializer
from .models import Source
from .helpers.video import generate_key, is_supported_mime_type, get_file_url


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
            key = generate_key()

            if not is_supported_mime_type(content.content_type):
                return Response('This MIME type isn\'t supported.', status=status.HTTP_400_BAD_REQUEST)

            if Source.objects.filter(owner=user, key=key):
                return Response('Source key exists. Retry later.', status=status.HTTP_400_BAD_REQUEST)

            source = Source(
                name=name,
                description=description,
                owner=user,
                mime=content.content_type,
                key=key,
            )

            source.content.save(f'{user.id}/{key}', content)
            source.save()

            return Response({'key': key }, status=status.HTTP_201_CREATED)
        else:

            return Response(source_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SourceInfoView(APIView):

    def get(self, request):
        sources = Source.objects.filter(owner=request.user)
        short_sources_list = []
        for source in sources:
            short_sources_list.append({ source.key: source.name})
        return Response({ 'sources': short_sources_list })


class SourceGetView(APIView):

    def get(self, request, key=None):
        sources = Source.objects.filter(owner=request.user, key=key)

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
