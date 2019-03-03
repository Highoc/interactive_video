from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status, permissions

from .serializers import SourceSerializer
from .models import Source
from .helpers.video import generate_key, is_supported_mime_type


class UploadSourceView(APIView):

    parser_classes = (MultiPartParser, FormParser)

    permission_classes = (permissions.AllowAny,)

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
            print (request.data)
            source.content.save(f'{user.id}/{key}', content)
            source.save()

            return Response({'key': key }, status=status.HTTP_201_CREATED)
        else:

            return Response(source_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
