from django.urls import path, include
from rest_framework_jwt.views import obtain_jwt_token
from . import views

# from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
# from rest_auth.registration.views import SocialLoginView

# class GoogleLogin(SocialLoginView):
# 	adapter_class = GoogleOAuth2Adapter

urlpatterns = [
	path('groups/', views.WorkGroupView.as_view()),
	path('groups/<int:pk>/', views.WorkGroupView.indiv_group),
	path('on-app-open-validate/', views.on_app_open_validate),
	# path('groups/<>/periods/', views.),
	# path('groups/<>/periods/<>/'),
	# path('groups/<>/periods/<>/all-preferences/'),
	# path('groups/<>/periods/<>/indiv-preferences/'),
	# path('groups/<>/periods/<>/shifts/<>/'),
	# path('shifts/'), # get one user's shifts
	# path('user-notifications/'),
	path('test/logout/', views.logout),
  path('rest-auth/', include('rest_auth.urls')),
  # path('rest-auth/google/', GoogleLogin.as_view(), name="google_login"),
  path('rest-auth/registration/', include('rest_auth.registration.urls')),
]