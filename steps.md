# PRECLASS SETUP

```bash
py -m venv env
.\env\Scripts\activate
pip install django
pip install python-decouple
django-admin --version
django-admin startproject drf_auth .
```

create a new file and name as .env at same level as env folder

copy your SECRET_KEY from drf_auth/settings.py into this .env file. Don't forget to remove quotation marks from SECRET_KEY

```
SECRET_KEY = django-insecure-)=b-%-w+0_^slb(exmy*mfiaj&wz6_fb4m&s=az-zs!#1^ui7j
```

go to drf_auth/settings.py, make amendments below

```python
from decouple import config

SECRET_KEY = config('SECRET_KEY')
```

go to terminal

```bash
py manage.py migrate
py manage.py runserver
```

click the link with CTRL key pressed in the terminal and see django rocket.

go to terminal, stop project, add app

```
py manage.py startapp student_api
```

go to settings.py and add 'student_api' app to installed apps

go to student_api.models.py

```python
from django.db import models

class Student(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    number = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.last_name} {self.first_name}"

```

go to terminal

```bash
py manage.py makemigrations
py manage.py migrate
pip install djangorestframework
```

go to settings.py and add 'rest_framework' app to installed apps

create serializers.py under student_api

```python
from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["id", "first_name", "last_name", "number"]
```

go to student_api.views.py

```python
from django.shortcuts import HttpResponse
from .models import Student
from .serializers import StudentSerializer
from rest_framework import generics

# from rest_framework.permissions import IsAuthenticated
# from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication

# Create your views here.


def home(request):
    return HttpResponse('<h1>API Page</h1>')


class StudentList(generics.ListCreateAPIView):
    serializer_class = StudentSerializer
    queryset = Student.objects.all()
    # permission_classes = [IsAuthenticated]
    # authentication_classes = [BasicAuthentication]

    # def create(self, request, *args, **kwargs):
    #     print(request.headers)
    #     serializer = self.get_serializer(data=request.data)
    #     if not serializer.is_valid(raise_exception=False):
    #         return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    #     self.perform_create(serializer)
    #     headers = self.get_success_headers(serializer.data)
    #     return Response({"message": "created successfully"}, status=status.HTTP_201_CREATED, headers=headers)


class StudentOpr(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StudentSerializer
    queryset = Student.objects.all()

    # permission_classes = [IsAuthenticated]
    # permission_classes = [IsAddedByUserOrReadOnly]

```

go to drf.urls.py

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('student_api.urls')),
]
```

go to student_api.urls.py

```python
rom django.urls import path
from .views import home, StudentList, StudentOpr

urlpatterns = [
    path('', home),
    path('student/', StudentList.as_view()),
    path('student/<int:pk>/', StudentOpr.as_view(), name="detail"),
]
```

```bash
py .\manage.py createsuperuser
py manage.py makemigrations
py manage.py migrate
pip freeze > requirements.txt
py .\manage.py runserver
```

CORS SETUP

```bash
pip install django-cors-headers
```

settings.py

```python
ALLOWED_HOSTS = ['*']
INSTALLED_APPS = [
    # ...
    'corsheaders',
]
MIDDLEWARE = [
    # ...
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ...
]
CORS_ORIGIN_ALLOW_ALL = True
```

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
      crossorigin="anonymous"
    />
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

    <title>Document</title>
  </head>
  <body>
    <div class="container">
      <div id="message"></div>
      <div style="width: 50%">
        <form id="form">
          <div class="mb-3">
            <label for="name" class="form-label">First Name</label>
            <input type="text" class="form-control" name="name" id="name" />
          </div>
          <div class="mb-3">
            <label for="lastname" class="form-label">Last Name</label>
            <input
              type="text"
              class="form-control"
              name="lastname"
              id="lastname"
            />
          </div>
          <div class="mb-3">
            <label for="number" class="form-label">Number</label>
            <input
              type="number"
              class="form-control"
              name="number"
              id="number"
            />
          </div>

          <button type="submit" class="btn btn-primary" id="addBtn">Add</button>
          <button type="button" class="btn btn-primary" id="updateBtn">
            Update
          </button>
          <button type="button" class="btn btn-danger" id="deleteBtn">
            Delete
          </button>
        </form>
      </div>
      <br />
      <br />
      <div id="studentContainer"></div>
      <br />
      <br />
      <div style="width: 50%">
        <form id="registerForm">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              name="username"
              id="username"
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              name="password"
              id="password"
            />
          </div>
          <button type="submit" class="btn btn-primary" id="loginBtn">
            Login
          </button>
          <button type="button" class="btn btn-primary" id="registerBtn">
            Register
          </button>
        </form>
      </div>
    </div>

    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
      crossorigin="anonymous"
    ></script>
    <script src="app.js"></script>
  </body>
</html>
```

app.js

```js
let studentsData;
let id;
let pos;
const baseUrl = 'http://127.0.0.1:8000/';
const accountUrl = baseUrl + 'account/';
const studentUrl = baseUrl + 'api/student/';

// const authentication = 'Basic YmFycnk6MQ==';
// let authentication = 'Token 29fbf0ee61703cb811fc1ceeab48c0f76e8b4b36';
let authentication;

const displayStudents = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: studentUrl,
      xsrfHeaderName: 'X-CSRFToken',
      xsrfCookieName: 'XSRF-TOKEN',
      withCredentials: true,
      headers: { Authorization: authentication },
    });

    console.log(response.status);
    console.log(response);

    studentsData = response.data;

    studentContainer = document.querySelector('#studentContainer');
    html = `<table id="table" style="width:50%" class="table table-success table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Firstname</th>
          <th scope="col">Lastname</th>
          <th scope="col">Number</th>  
          <th scope="col">Update</th> 
        </tr>
      </thead>
      <tbody>
      `;

    response.data.forEach((element) => {
      html += `      
        <tr>
          <th scope="row">${element.id}</th>
          <td>${element.first_name}</td>
          <td>${element.last_name}</td>
          <td>${element.number}</td>
          <td><input type="radio" name="radioGroup"></td>
        </tr>`;
    });

    html += ' </tbody></table>';
    studentContainer.innerHTML = html;

    const table = document.getElementById('table');
    table.addEventListener('click', (event) => {
      if (event.target.type === 'radio') {
        id = event.target.parentNode.parentNode.childNodes[1].textContent;

        for (let i = 0; i < studentsData.length; i++)
          if (studentsData[i].id == id) {
            pos = i;
            break;
          }
        document.getElementById('name').value = studentsData[pos].first_name;
        document.getElementById('lastname').value = studentsData[pos].last_name;
        document.getElementById('number').value = studentsData[pos].number;
      }
    });
  } catch (err) {
    console.log(err.message);
  }
};

const resetForm = function () {
  document.getElementById('name').value = '';
  document.getElementById('lastname').value = '';
  document.getElementById('number').value = '';
};

const displayMessages = function (message, type) {
  const messageElement = document.querySelector('#message');
  let msg = message;
  if (type === 'danger') {
    const errors = Object.entries(message).reduce(
      (acc, element) => acc + element[0] + ' ' + element[1][0] + ' <br />',
      ''
    );
    msg = errors;
  }
  messageElement.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
  setTimeout(function () {
    messageElement.style.display = 'none';
  }, 5000);
};

document.getElementById('form').addEventListener('submit', function (event) {
  event.preventDefault();
});

const addUpdateDelete = async function (event) {
  let method;
  let data = {};
  let url = studentUrl;
  switch (event.target.outerText) {
    case 'Add':
      method = 'post';
      break;
    case 'Update':
      method = 'put';
      url += id + '/';
      break;
    case 'Delete':
      method = 'delete';
      url += id + '/';
      break;
  }

  if (['Update', 'Add'].includes(event.target.outerText)) {
    data = new FormData();

    data.append('first_name', document.getElementById('name').value);
    data.append('last_name', document.getElementById('lastname').value);
    data.append('number', document.getElementById('number').value); // 3
  }

  console.log(method, id, url);
  try {
    const response = await axios({
      method: method,
      url: url,
      headers: { Authorization: authentication },
      data: data,
    });
    console.log(response.status);
    displayMessages(response.data.message, 'success');
    displayStudents();
  } catch (err) {
    console.log(err.message);
    displayMessages(err.response.data.message, 'danger');
  }
};

document.getElementById('updateBtn').addEventListener('click', addUpdateDelete);
document.getElementById('deleteBtn').addEventListener('click', addUpdateDelete);
document.getElementById('addBtn').addEventListener('click', addUpdateDelete);

document
  .getElementById('registerForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault();
  });

const loginRergister = async function (url) {
  let data = new FormData();

  data.append('username', document.getElementById('username').value);
  data.append('password', document.getElementById('password').value);

  try {
    const response = await axios({
      method: 'post',
      url: url,
      data: data,
    });
    console.log(response.status);
    console.log(response.data.token);
    authentication = 'Token ' + response.data.token;
    displayStudents();
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
  } catch (err) {
    console.log(err.message);
    displayMessages(err.response.data.message, 'danger');
  }
};

const loginRegisterClick = function (event) {
  let url = accountUrl;

  switch (event.target.outerText) {
    case 'Login':
      url += 'login/';
      break;
    case 'Register':
      url += 'register/';
      break;
  }
  loginRergister(url);
};

document
  .getElementById('loginBtn')
  .addEventListener('click', loginRegisterClick);
document
  .getElementById('registerBtn')
  .addEventListener('click', loginRegisterClick);

displayStudents();
```

# HANDS-ON PART

permissions determine whether a request should be granted or denied access.

authorization checks who sends this request

## [Setting the permission policy](https://www.django-rest-framework.org/api-guide/permissions/#setting-the-permission-policy)

The default permission policy may be set globally, using the `DEFAULT_PERMISSION_CLASSES` setting. For example.

```
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}
```

You can also set the authentication policy on a per-view, or per-viewset basis, using the `APIView` class-based views.

## [TokenAuthentication](https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication)

This authentication scheme uses a simple token-based HTTP Authentication scheme. Token authentication is appropriate for client-server setups, such as native desktop and mobile clients.

To use the `TokenAuthentication` scheme you'll need to [configure the authentication classes](https://www.django-rest-framework.org/api-guide/authentication/#setting-the-authentication-scheme) to include `TokenAuthentication`, and additionally include `rest_framework.authtoken` in your `INSTALLED_APPS` setting:

```python
INSTALLED_APPS = [
    ...
    'rest_framework.authtoken'
]
```

go to terminal

```bash
py manage.py migrate
```

navigate to admin dashboard and check Token table

add users, and token to these users

go to postman send  Token 

go to terminal

```bash
py manage.py startapp user_api
```

go to models.py

```python
from django.db import models

# Create your models here.
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
```

go to serializers.py

```python
from django.contrib.auth.models import User
from rest_framework import serializers


class RegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
```

go to urls.py

```python
from rest_framework.authtoken.views import obtain_auth_token
from django.urls import path
from .views import registration_view, logout_view

urlpatterns = [
    path('login/', obtain_auth_token, name='login'),
    path('register/', registration_view, name='register'),
    path('logout/', logout_view, name='logout'),
]
```

go to views.py

```python
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
```

## USING [ dj-rest-auth](https://dj-rest-auth.readthedocs.io/en/latest/index.html)

go to terminal

```bash
pip install dj-rest-auth
```

Add `dj_rest_auth` app to INSTALLED_APPS in your django settings.py:

```python
INSTALLED_APPS = (
    ...,
    'rest_framework',
    'rest_framework.authtoken',
    ...,
    'dj_rest_auth'
)
```

Add dj_rest_auth urls:

```python
urlpatterns = [
    ...,
    path('dj-rest-auth/', include('dj_rest_auth.urls'))
]
```

Migrate your database

```bash
python manage.py migrate
```

## Registration (optional)

If you want to enable standard registration process you will need to install `django-allauth` by using `pip install 'dj-rest-auth[with_social]'`.

Add `django.contrib.sites`, `allauth`, `allauth.account`, `allauth.socialaccount` and `dj_rest_auth.registration` apps to INSTALLED_APPS in your django settings.py:

Add `SITE_ID = 1` to your django settings.py

```bash
INSTALLED_APPS = (
    ...,
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'dj_rest_auth.registration',
)

SITE_ID = 1
```

Add dj_rest_auth.registration urls:

```bash
urlpatterns = [
    ...,
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls'))
]
```

