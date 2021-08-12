from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdminOrReadOnly, IsAddedByUserOrReadOnly
from django.shortcuts import render, HttpResponse
from .models import Student
from .serializers import StudentSerializer
from rest_framework import generics

from rest_framework.response import Response
from rest_framework import status
# from rest_framework.views import APIView
from rest_framework import mixins, views
# Create your views here.


def home(request):
    return HttpResponse('<h1>API Page</h1>')


# class StudentListGen(generics.ListAPIView):


class StudentListGen(generics.ListCreateAPIView):
    serializer_class = StudentSerializer
    queryset = Student.objects.all()
    permission_classes = [IsAuthenticated]

    # permission_classes = [IsAdminOrReadOnly]

    # def create(self, request, *args, **kwargs):
    #     print(request.headers)
    #     serializer = self.get_serializer(data=request.data)
    #     if not serializer.is_valid(raise_exception=False):
    #         return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    #     self.perform_create(serializer)
    #     headers = self.get_success_headers(serializer.data)
    #     return Response({"message": "created successfully"}, status=status.HTTP_201_CREATED, headers=headers)


class StudentOprGen(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StudentSerializer
    queryset = Student.objects.all()
    lookup_field = "id"
    # permission_classes = [IsAuthenticated]
    permission_classes = [IsAddedByUserOrReadOnly]

# class StudentList(APIView):
#     def get(self, request):
#         students = Student.objects.all()
#         serializer = StudentSerializer(students, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = StudentSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class StudentOpr(APIView):
#     def get_object(self, id):
#         try:
#             return Student.objects.get(id=id)
#         except Student.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

#     def get(self, request, id):
#         student = self.get_object(id)
#         serializer = StudentSerializer(student)
#         return Response(serializer.data)

#     def put(self, request, id):
#         student = self.get_object(id)
#         serializer = StudentSerializer(student, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, id):
#         student = self.get_object(id)
#         student.delete()
#         data = {
#             "message": f"Student {student.last_name} deleted successfully"
#         }
#         return Response(data, status=status.HTTP_200_OK)
