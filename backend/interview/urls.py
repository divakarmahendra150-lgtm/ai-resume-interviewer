from django.urls import path
from .views import upload_resume

urlpatterns = [
    path("resume/", upload_resume),
]