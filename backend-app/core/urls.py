from django.conf.urls import url
from .views import CentrifugoTokenView, ProfileUpdateView, ProfileCurrentView
from .views import UserSignUpView, UserCurrentView, UserSubscriptionsList

urlpatterns = [
    url(r'^user/current/$', UserCurrentView.as_view()),
    url(r'^user/sign_up/$', UserSignUpView.as_view()),
    url(r'^user/subscriptions/$', UserSubscriptionsList.as_view()),
    url(r'^profile/update/$', ProfileUpdateView.as_view()),
    url(r'^profile/current/$', ProfileCurrentView.as_view()),
    url(r'^centrifugo/token/$', CentrifugoTokenView.as_view())
]