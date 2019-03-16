from django.conf.urls import url

from .views import ChannelUpdateView

urlpatterns = [
    url(r'^update/$', ChannelUpdateView.as_view()),
]