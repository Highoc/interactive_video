from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from channel.serializers import ChannelSerializer

class TestView(APIView):
    def post(self, request):
        return Response('Работает', status=status.HTTP_200_OK)
        serializer = ChannelSerializer(data=request.data)
        if serializer.is_valid():
            pass
        else:
            return Response('Работает', status=status.HTTP_200_OK)