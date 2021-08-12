from django.urls import path
from .views import home, StudentListGen, StudentOprGen

urlpatterns = [
    path('', home),
    path('student/', StudentListGen.as_view()),
    path('student/<int:id>/', StudentOprGen.as_view(), name="detail"),
]
