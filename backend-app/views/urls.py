from django.conf.urls import url

from .views import ViewsAddView, ViewsGetView

urlpatterns = [
    url(r'^add/(?P<video_key>[0-9a-z]{12})/$', ViewsAddView.as_view()),
    url(r'^get/(?P<video_key>[0-9a-z]{12})/$', ViewsGetView.as_view()),
]