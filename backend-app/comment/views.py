from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from channel.models import Channel
from video.models import Video
from .models import Comment

from .serializers import CommentSerializer

class CommentView(APIView):
    def get(self, request, comment_id):

        comments = Comment.objects.filter(id=comment_id)
        if not comments:
            return Response('Comment doesn\'t exist.', status=status.HTTP_404_NOT_FOUND)

        comment = comments[0]

        response = {
            'author': comment.author.username,
            'text': comment.text,
            'created': comment.created,
            'children': [child.id for child in comment.children.all()]
        }

        return Response(response, status=status.HTTP_200_OK)


def get_comment_form(comment=None):
    text = ""

    if comment:
        text = comment.text

    form = [{
        'type': 'textarea',
        'name': 'text',
        'value': f'{text}',
        'description': 'Текст комментария',
        'rules': {
            'max_length': 512,
            'required': True,
        },
    }]

    return form


class CommentCreateView(APIView):
    def get(self, request, channel_key, video_key):
        form = get_comment_form()
        return Response(form, status=status.HTTP_200_OK)

    def post(self, request, channel_key, video_key):
        channels = Channel.objects.filter(key=channel_key, status=Channel.AVAILABLE)
        if not channels:
            return Response("Wrong channel key.", status=status.HTTP_400_BAD_REQUEST)
        channel = channels[0]

        video = Video.objects.filter(key=video_key, status=Video.PUBLIC, owner=channel.owner)
        if not video:
            return Response("Wrong video key.", status=status.HTTP_400_BAD_REQUEST)

        video = video[0]
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            if 'parent_id' not in request.data:
                parent = None
            else:
                parents = video.comments.filter(id=request.data['parent_id'])
                if not parents:
                    return Response("Wrong comments id.", status=status.HTTP_400_BAD_REQUEST)

                parent = parents[0]

            comment = serializer.create()
            comment.video = video
            comment.author = request.user
            comment.parent = parent
            comment.save()

            return Response({ 'key': comment.id }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)