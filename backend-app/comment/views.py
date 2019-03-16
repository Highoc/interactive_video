from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Comment


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