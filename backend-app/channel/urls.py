from django.conf.urls import url

from .views import ChannelUpdateView, ChannelView, ChannelListView
from .views import PlaylistAllView, PlaylistGetView, PlaylistUpdateView, PlaylistCreateView
from .views import ChannelSubscribeView, ChannelUnsubscribeView, ChannelSubscribersListView

from comment.views import CommentCreateView

urlpatterns = [
    url(r'^list/$', ChannelListView.as_view()),
    url(r'^update/$', ChannelUpdateView.as_view()),
    url(r'^get/(?P<channel_key>[0-9a-z]{12})/$', ChannelView.as_view()),

    url(r'^(?P<channel_key>[0-9a-z]{12})/playlist/all/$', PlaylistAllView.as_view()),
    url(r'^(?P<channel_key>[0-9a-z]{12})/playlist/create/$', PlaylistCreateView.as_view()),
    url(r'^(?P<channel_key>[0-9a-z]{12})/playlist/(?P<playlist_key>[0-9a-z]{12})/$', PlaylistGetView.as_view()),
    url(r'^(?P<channel_key>[0-9a-z]{12})/playlist/(?P<playlist_key>[0-9a-z]{12})/update/$', PlaylistUpdateView.as_view()),
    url(r'^(?P<channel_key>[0-9a-z]{12})/video/(?P<video_key>[0-9a-z]{12})/comment/add/$', CommentCreateView.as_view()),

    url(r'^(?P<channel_key>[0-9a-z]{12})/subscribe/$', ChannelSubscribeView.as_view()),
    url(r'^(?P<channel_key>[0-9a-z]{12})/unsubscribe/$', ChannelUnsubscribeView.as_view()),
    url(r'^(?P<channel_key>[0-9a-z]{12})/subscribers/$', ChannelSubscribersListView.as_view()),
]