from django.conf.urls import url
from .views import SourceUploadView, SourceInfoView, SourceGetView

urlpatterns = [
    url(r'^source_upload/$', SourceUploadView.as_view()),
    url(r'^source_info/$', SourceInfoView.as_view()),
    url(r'^source_get/(?P<key>[0-9a-f]{32})/$', SourceGetView.as_view()),
]