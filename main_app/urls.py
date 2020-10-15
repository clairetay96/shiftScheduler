from django.urls import path, include
from . import views

# from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
# from rest_auth.registration.views import SocialLoginView

# class GoogleLogin(SocialLoginView):
# 	adapter_class = GoogleOAuth2Adapter

urlpatterns = [
	path('groups/', views.WorkGroupView.as_view({'get':'list'})),
  path('rest-auth/', include('rest_auth.urls')),
  # path('rest-auth/google/', GoogleLogin.as_view(), name="google_login"),
  path('rest-auth/registration/', include('rest_auth.registration.urls')),
]