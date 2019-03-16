from django.conf.urls import url
from django.contrib import admin
from django.urls import include

from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^token-auth/', obtain_jwt_token),
    url(r'^core/', include('core.urls')),
    url(r'^video/', include('video.urls')),
    url(r'^channel/', include('channel.urls')),
    url(r'^comment/', include('comment.urls'))
]
