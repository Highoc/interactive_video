from django.conf.urls import url
from .views import SourceUploadView, SourceListView, SourceView
from .views import VideoUploadView, VideoView, VideoPartView

urlpatterns = [
    url(r'^source/upload/$', SourceUploadView.as_view()),
    url(r'^source/list/$', SourceListView.as_view()),
    url(r'^source/get/(?P<key>[0-9a-f]{32})/$', SourceView.as_view()),

    url(r'^part/get/(?P<key>[0-9a-f]{32})/$', VideoPartView.as_view()),

    url(r'^upload/$', VideoUploadView.as_view()),

    url(r'^get/(?P<key>[0-9a-z]{12})/$', VideoView.as_view()),
]