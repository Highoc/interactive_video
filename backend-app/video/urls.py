from django.urls import path
from .views import UploadSourceView

urlpatterns = [
    path('upload_source/', UploadSourceView.as_view()),
]