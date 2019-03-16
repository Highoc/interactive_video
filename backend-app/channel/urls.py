from django.conf.urls import url

from .views import ChannelUpdateView, ChannelView, PlaylistAllView, PlaylistGetView, ChannelListView

urlpatterns = [
    url(r'^list/$', ChannelListView.as_view()),
    url(r'^update/$', ChannelUpdateView.as_view()),
    url(r'^get/(?P<channel_key>[0-9a-z]{12})/$', ChannelView.as_view()),

    url(r'^(?P<channel_key>[0-9a-z]{12})/playlist/all/$', PlaylistAllView.as_view()),
    url(r'^(?P<channel_key>[0-9a-z]{12})/playlist/(?P<playlist_key>[0-9a-z]{12})/$', PlaylistGetView.as_view()),
]