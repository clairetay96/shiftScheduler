"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from main_app import views
from django.views.generic import TemplateView

# from .googleviews import GoogleOAuth2AdapterIdToken # import custom adapter
# from rest_auth.registration.views import SocialLoginView
# from allauth.socialaccount.providers.oauth2.client import OAuth2Client
# class GoogleLogin(SocialLoginView):
#     adapter_class = GoogleOAuth2AdapterIdToken
#     client_class = OAuth2Client

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('main_app.urls')),
    # path('rest-auth/google/', GoogleLogin.as_view()),
    re_path(r'^.*', TemplateView.as_view(template_name='index.html', content_type='text/html')),
]