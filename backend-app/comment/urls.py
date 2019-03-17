from django.conf.urls import url

from .views import CommentView

urlpatterns = [
    url(r'^get/(?P<comment_id>[0-9]+)/$', CommentView.as_view()),
]