from django.urls import path
from .views import current_user, UserList, CentrifugoTokenView

urlpatterns = [
    path('current_user/', current_user),
    path('users/', UserList.as_view()),
    path('centrifugo/token/', CentrifugoTokenView.as_view())
]