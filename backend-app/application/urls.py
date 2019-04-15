from django.conf.urls import url
from django.contrib import admin
from django.urls import include

from rest_framework_jwt.views import obtain_jwt_token
from .test import TestView

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^core/', include('core.urls')),
    url(r'^video/', include('video.urls')),
    url(r'^channel/', include('channel.urls')),
    url(r'^comment/', include('comment.urls')),
    url(r'^views/', include('views.urls')),
    url(r'^rating/', include('rating.urls')),

    url(r'^auth/login/$', obtain_jwt_token),
    url(r'^test/$', TestView.as_view()),
    url(r'^tag/', include('tag.urls')),
]
