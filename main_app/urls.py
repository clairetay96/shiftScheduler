from django.urls import path, include
from rest_framework_jwt.views import obtain_jwt_token
from . import views

# from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
# from rest_auth.registration.views import SocialLoginView

# class GoogleLogin(SocialLoginView):
# 	adapter_class = GoogleOAuth2Adapter

urlpatterns = [
	path('groups/<int:id>/', views.WorkGroupViewWrite.as_view()),
	path('groups/', views.WorkGroupView.as_view()),
	path('on-app-open-validate/', views.on_app_open_validate),
	path('find-user/<str:user_input>/', views.find_user),
	path('groups/<int:group_id>/periods/', views.PeriodView.as_view()),
	path('periods/<int:id>/', views.PeriodViewWrite.as_view()),
	path('shifts/<int:id>/', views.ShiftViewWrite.as_view()),
	path('shifts/', views.ShiftView.as_view()),
	# path('groups/<>/periods/<>/all-preferences/'),
	path('groups/<int:group_id>/periods/<int:period_id>/indiv-preferences/', views.IndivUserPreferenceView.as_view()),
	path('userpreferences/<int:id>/', views.UserPreferenceView.as_view()),
	# path('groups/<>/periods/<>/shifts/<>/'),
	# path('shifts/'), # get one user's shifts
	# path('user-notifications/'),
	path('test/logout/', views.logout),
  path('rest-auth/', include('rest_auth.urls')),
  # path('rest-auth/google/', GoogleLogin.as_view(), name="google_login"),
  path('rest-auth/registration/', include('rest_auth.registration.urls')),
]