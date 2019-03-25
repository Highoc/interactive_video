from rest_framework import serializers

from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta():
        model = Comment
        fields = ('text', 'parent_id')

    def create(self):
        return Comment(**self.validated_data)
