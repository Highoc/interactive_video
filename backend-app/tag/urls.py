from django.conf.urls import url
from .views import VideoTagAddView, VideoTagDeleteView, VideoTagListView

urlpatterns = [
    url(r'^video/(?P<video_key>[0-9a-z]{12})/list/$', VideoTagListView.as_view()),
    url(r'^video/(?P<video_key>[0-9a-z]{12})/add/$', VideoTagAddView.as_view()),
    url(r'^video/(?P<video_key>[0-9a-z]{12})/delete/$', VideoTagDeleteView.as_view()),
]