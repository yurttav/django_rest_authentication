from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import RegistrationSerializer
from rest_framework.authtoken.models import Token
from . import models

# Create your views here.


@api_view(['POST'])
def registration_view(request):
    if request.method == 'POST':
        serializer = RegistrationSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            account = serializer.save()
            # token, _ = Token.objects.get_or_create(user=account)
            token = Token.objects.get(user=account)
            print(token)
            data = serializer.data
            # data['token'] = str(token[0])
            data['token'] = token.key
        else:
            data = serializer.errors
        return Response(data)


@api_view(['POST'])
def logout_view(request):
    if request.method == 'POST':
        request.user.auth_token.delete()
        data = {
            'message': 'logout'
        }
        return Response(data)
