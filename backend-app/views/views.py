from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from video.models import Video

from cent import Client

CENTRIFUGO_URL = "http://centrifugo:9000"
CENTRIFUGO_API_KEY = "1erj444h-9fhj-pasd-oas4-988f33d33d21"

class ViewsAddView(APIView):
    def post(self, request, video_key):
        video = Video.objects.filter(key=video_key, status=Video.PUBLIC)

        if not video:
            return Response('Video doesn\'t exist.', status=status.HTTP_404_NOT_FOUND)

        views = video[0].views
        views.counter += 1
        views.save()

        response = {
            'counter': views.counter,
        }

        client = Client(CENTRIFUGO_URL, api_key=CENTRIFUGO_API_KEY, timeout=1)
        channel = f"video/{video_key}/views"

        client.publish(channel, response)

        return Response(response, status=status.HTTP_200_OK)


class ViewsGetView(APIView):
    def get(self, request, video_key):
        video = Video.objects.filter(key=video_key, status=Video.PUBLIC)

        if not video:
            return Response('Video doesn\'t exist.', status=status.HTTP_404_NOT_FOUND)

        views = video[0].views

        response = {
            'counter': views.counter,
        }

        return Response(response, status=status.HTTP_200_OK)
