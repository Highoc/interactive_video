from django.conf.urls import url
from .views import CentrifugoTokenView, CurrentUserView

urlpatterns = [
    url(r'^user/current/$', CurrentUserView.as_view()),
    url(r'^centrifugo/token/$', CentrifugoTokenView.as_view())
]