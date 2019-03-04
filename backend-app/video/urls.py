from django.conf.urls import url
from .views import SourceUploadView, SourceInfoView, SourceGetView
from .views import VideoUploadView, VideoGetView, VideoPartGetView

urlpatterns = [
    url(r'^source/upload/$', SourceUploadView.as_view()),
    url(r'^source/info/$', SourceInfoView.as_view()),
    url(r'^source/get/(?P<key>[0-9a-f]{32})/$', SourceGetView.as_view()),

    url(r'^part/get/(?P<key>[0-9a-f]{32})/$', VideoPartGetView.as_view()),

    url(r'^upload/$', VideoUploadView.as_view()),

    # url для channel/urls.py
    url(r'^get/(?P<short_key>[0-9a-z]{12})/$', VideoGetView.as_view()),
]