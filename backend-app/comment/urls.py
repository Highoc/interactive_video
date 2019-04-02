from django.conf.urls import url

from .views import CommentView, CommentTree

urlpatterns = [
    url(r'^get/(?P<comment_id>[0-9]+)/$', CommentView.as_view()),
    url(r'^list/(?P<comment_id>[0-9]+)/level/(?P<level>[0-9]+)/$', CommentTree.as_view()),
]