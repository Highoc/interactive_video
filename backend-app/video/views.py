from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, status

'''
from django.core.files.base import ContentFile
import base64, hashlib, json

from jsonrpc import jsonrpc_method
from users.models import User
from core.models import File
from django.http.response import HttpResponseForbidden, HttpResponseNotFound, HttpResponseRedirect, HttpResponse


from rest_framework.decorators import api_view
from .serializers import UserSerializer, UserSerializerWithToken


@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """

    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
'''

class UploadSourceView(APIView):

    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return Response(request.user)

    def post(self, requset):
        pass

'''
@jsonrpc_method( 'api.upload_file' )
def upload_file( request, user_pk, file_json ):
    file = json.loads(file_json)

    content = base64.b64decode( file['content'] ).decode('utf-8')
    key = generate_key( file['filename'] )
    owner = User.objects.filter( id=user_pk ).first()

    new_file = File.objects.filter(key=key, owners=owner).first()
    if not new_file is None:
        new_file.content.save('{}/{}'.format(user_pk, key), ContentFile(content.encode('utf-8')))
        new_file.save()
    else:
        new_file = File()
        new_file.key = key
        new_file.name = file['filename']
        new_file.mime = file['mime_type']
        new_file.content.save('{}/{}'.format(user_pk, key), ContentFile(content.encode('utf-8')))
        new_file.save()
        new_file.owners.add(owner)

return key

'''