from rest_framework import serializers
from .models import Student


# class StudentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Student
#         fields = ["id", "first_name", "last_name", "number"]

class StudentSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='detail', lookup_field='id')

    class Meta:
        model = Student
        fields = ["url", "id", "first_name", "last_name", "number"]
