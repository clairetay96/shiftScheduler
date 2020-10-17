from django.shortcuts import render
from django.forms.models import model_to_dict
from django.http import HttpResponse
from django.contrib.auth.models import User, AnonymousUser

from django.contrib.auth import SESSION_KEY
from django.contrib.sessions.models import Session

from rest_framework import viewsets, generics
from rest_framework.response import Response


from .serializers import WorkGroupSerializer, PeriodSerializer, ShiftSerializer, NotificationSerializer, UserPreferenceSerializer, UserSerializer
from .models import WorkGroup, Period, Shift, Notification, UserPreference


class WorkGroupView(generics.ListCreateAPIView):
	serializer_class = WorkGroupSerializer

	#get logged in user's groups
	def get(self, request, format=None):
		if request.user:
			allUserGroups = [model_to_dict(i) for i in WorkGroup.objects.filter(members__id=request.user.pk)]
			print(allUserGroups)
			for i in allUserGroups:
				i["members"] = [model_to_dict(j) for j in i["members"]]
				i["admins"] = [model_to_dict(j) for j in i["admins"]]
			return Response(allUserGroups)

	def post(self, request, format=None):

		if request.user:
			requestData = request.data

			#store members to be saved directly to. And add group creator to members
			requestMembers = [int(i) for i in requestData['members'] if i]
			requestMembers.append(request.user.pk)
			del requestData['members']

			serializer = WorkGroupSerializer(data=requestData)

			if serializer.is_valid():
				serialized_group = serializer.save()
				saved_group_from_db = WorkGroup.objects.get(id=serialized_group.id)

				#add group creator as admin
				saved_group_from_db.admins.add(request.user.pk)

				#add members to group
				for i in requestMembers:
					saved_group_from_db.members.add(i)

				return Response("All good")

			return Response("all bad")

	def indiv_group(self, request, group_id):
		group_info = WorkGroup.objects.get(id=group_id)
		return Response(group_info)


class PeriodView(generics.ListCreateAPIView):
	serializer_class = PeriodSerializer
	queryset = Period.objects.all()

class ShiftView(generics.ListCreateAPIView):
	serializer_class = ShiftSerializer
	queryset = Shift.objects.all()

class UserPreferenceView(generics.ListCreateAPIView):
	serializer_class = UserPreferenceSerializer
	queryset = UserPreference.objects.all()

class NotificationView(generics.ListCreateAPIView):
	serializer_class = NotificationSerializer
	queryset = Notification.objects.all()

def logout(request):
	#must blacklist jwt

	#clear session and csrf token
	response = HttpResponse()
	response.delete_cookie('sessionid')
	response.delete_cookie('csrftoken')
	return response


def on_app_open_validate(request):
	if request.session.session_key:
		return HttpResponse("true")
	return HttpResponse("false")