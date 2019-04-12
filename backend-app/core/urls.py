from django.conf.urls import url
from .views import CentrifugoTokenView, ProfileUpdateView, ProfileCurrentView
from .views import UserSignUpView, UserCurrentView, UserSubscriptionsList
from .views import SearchView, VideoTopView

urlpatterns = [
    url(r'^user/current/$', UserCurrentView.as_view()),
    url(r'^user/sign_up/$', UserSignUpView.as_view()),
    url(r'^user/subscriptions/$', UserSubscriptionsList.as_view()),
    url(r'^profile/update/$', ProfileUpdateView.as_view()),
    url(r'^profile/current/$', ProfileCurrentView.as_view()),
    url(r'^centrifuge/token/$', CentrifugoTokenView.as_view()),
    url(r'^search', SearchView.as_view()),
    url(r'^top/$', VideoTopView.as_view()),
]
