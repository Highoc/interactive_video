from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from video.models import Video
from .models import Rating, RatingRecord

from cent import Client

CENTRIFUGO_URL = "http://centrifugo:9000"
CENTRIFUGO_API_KEY = "1erj444h-9fhj-pasd-oas4-988f33d33d21"

class RatingRecordUpdateView(APIView):
    def post(self, request, video_key):
        if 'value' not in request.data or request.data['value'] not in [-1, 0, 1]:
            return Response('Invalid request (or rating value).', status=status.HTTP_400_BAD_REQUEST)

        new_value = request.data['value']

        ratings = Rating.objects.filter(video__key=video_key, video__status=Video.PUBLIC)
        if not ratings:
            return Response('Video doesn\'t exist.', status=status.HTTP_404_NOT_FOUND)

        rating = ratings[0]

        records = rating.records.filter(author=request.user)
        if not records:
            rating.counter += new_value
            record = RatingRecord(
                author=request.user,
                rating=rating,
                value=new_value
            )
        else:
            record = records[0]
            if record.value != new_value:
                if new_value == 0:
                    rating.counter -= record.value
                elif record.value == 0:
                    rating.counter += new_value
                else:
                    rating.counter += 2*new_value

                record.value = new_value

        record.save()
        rating.save()

        response = {
            'counter': rating.counter,
        }

        client = Client(CENTRIFUGO_URL, api_key=CENTRIFUGO_API_KEY, timeout=1)
        channel = f"video/{video_key}/rating"
        client.publish(channel, response)

        return Response(response, status=status.HTTP_200_OK)


class RatingGetView(APIView):
    def get(self, request, video_key):
        ratings = Rating.objects.filter(video__key=video_key, video__status=Video.PUBLIC)

        if not ratings:
            return Response('Video doesn\'t exist.', status=status.HTTP_404_NOT_FOUND)

        rating = ratings[0]

        records = rating.records.filter(author=request.user)
        if not records:
            value = 0
        else:
            value = records[0].value

        response = {
            'counter': rating.counter,
            'value': value,
        }

        return Response(response, status=status.HTTP_200_OK)
