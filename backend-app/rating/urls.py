from django.conf.urls import url

from .views import RatingGetView, RatingRecordUpdateView

urlpatterns = [
    url(r'^get/(?P<video_key>[0-9a-z]{12})/$', RatingGetView.as_view()),
    url(r'^update/(?P<video_key>[0-9a-z]{12})/$', RatingRecordUpdateView.as_view()),
]