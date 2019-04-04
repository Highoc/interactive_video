from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from channel.serializers import ChannelSerializer

class TestView(APIView):
    def post(self, request):
        serializer = ChannelSerializer(data=request.data)
        if serializer.is_valid():
            pass
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)