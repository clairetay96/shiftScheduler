from django.shortcuts import render
from django.forms.models import model_to_dict
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User, AnonymousUser

from django.contrib.auth import SESSION_KEY
from django.contrib.sessions.models import Session

from rest_framework import viewsets, generics
from rest_framework.response import Response

from rest_framework.renderers import JSONRenderer
import json


from .serializers import WorkGroupSerializer, PeriodSerializer, ShiftSerializer, NotificationSerializer, UserPreferenceSerializer, UserSerializer
from .models import WorkGroup, Period, Shift, Notification, UserPreference


class WorkGroupView(generics.ListCreateAPIView):
	serializer_class = WorkGroupSerializer

	#only get groups of the logged in user
	def get_queryset(self):
		user_id = self.request.user.id
		return WorkGroup.objects.filter(members__id=user_id)

	#add the is_admin attribute to all results
	def get(self, request, format=None):
		response = super().get(request)
		response = JSONRenderer().render(response.data)
		response = json.loads(response.decode("utf-8"))

		for i in response:
			if request.user.id in [j['id'] for j in i['admins']]:
				i['is_admin'] = True
			else:
				i['is_admin'] = False

		return Response(response)


	def post(self, request, format=None):
		if request.user:
			requestData = request.data
			requestData['admins_id'] = [request.user.id]

			serializer = WorkGroupSerializer(data=requestData)

			if serializer.is_valid():

				serializer.save()
				new_serializer = serializer.data
				new_serializer["is_admin"] = True

				return Response(new_serializer)

			print(serializer.errors)
			return Response("all bad")


class WorkGroupViewWrite(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = WorkGroupSerializer
	lookup_field='id'

	#only select from groups of the logged in user
	def get_queryset(self):
		user_id = self.request.user.id
		return WorkGroup.objects.filter(members__id=user_id)

	#add the is_admin attribute to all results
	def get(self, request, id, format=None):
		response = super().get(request)
		response = JSONRenderer().render(response.data)
		response = json.loads(response.decode("utf-8"))

		if request.user.id in [j['id'] for j in response['admins']]:
			response['is_admin'] = True
		else:
			response['is_admin'] = False

		return Response(response)


	def put(self, request, id, format=None):
		if request.user:

			#only an admin can update the group
			group_to_update = WorkGroup.objects.get(pk=id)

			if request.data['updateType']=="add_new_member":
				for i in request.data['newMembers']:
					group_to_update.members.add(i)

			elif request.data['updateType']=="remove_member_from_group":
				group_to_update.members.remove(request.data['userID'])
				group_to_update.admins.remove(request.data['userID'])

			##TO ADD: add admin


			group_to_update.save()
			return self.get(request,id)

	def delete(self, request, id, format=None):
		if request.user:

			group_to_delete = self.get(request, id)
			group_to_delete = JSONRenderer().render(group_to_delete.data)
			group_to_delete = json.loads(group_to_delete.decode("utf-8"))

			#only an admin can delete the group
			if group_to_delete['is_admin']:
				super().delete(request, id)
				return Response("Group successfully deleted.")
			else:
				return Response("Only a group admin can delete the group.")


#all periods within a certain group
class PeriodView(generics.ListCreateAPIView):
	serializer_class = PeriodSerializer

	def get_queryset(self):
		return Period.objects.filter(work_group__id=self.kwargs['group_id'])

	def post(self, request, group_id):
		if request.user:
			#TO ADD: only an admin can add period.
			print(request.data)
			serializer = PeriodSerializer(data=request.data)
			if serializer.is_valid():
				serializer.save()
				return Response(serializer.data)
			return Response(serializer.errors)


class PeriodViewWrite(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = PeriodSerializer
	lookup_field='id'

	def get_queryset(self):
		return Period.objects.filter(id=self.kwargs['id'])

	# TO ADD:
	def put(self, request, id):
		#add shifts. only an admin can.
		if request.user:

			period_to_update = Period.objects.get(pk=id)

			if request.data['updateType']=="add_shift":
				for i in request.data['newShifts']:
					Shift.objects.create(period=period_to_update, **i)


			return self.get(request, id)



#get all of a user's shifts
class ShiftView(generics.ListCreateAPIView):
	serializer_class = ShiftSerializer

	def get_queryset(self):
		return Shift.objects.filter(users__id=self.request.user.id)

#single shift by ID
class ShiftViewWrite(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = ShiftSerializer
	lookup_field='id'

	def get_queryset(self):
		return Shift.objects.filter(id=self.kwargs['id'])

	#TO ADD: only group admins should be able to edit and delete shifts.

class UserPreferenceView(generics.ListCreateAPIView):
	serializer_class = UserPreferenceSerializer
	queryset = UserPreference.objects.all()

class NotificationView(generics.ListCreateAPIView):
	serializer_class = NotificationSerializer
	queryset = Notification.objects.all()

def logout(request):
	#TO ADD: must blacklist jwt

	#clear session and csrf token
	response = HttpResponse()
	response.delete_cookie('sessionid')
	response.delete_cookie('csrftoken')
	return response

#runs everytime the app loads/is refreshed - checks if there's still a session going on
def on_app_open_validate(request):
	if request.session.session_key:
		return HttpResponse("true")
	return HttpResponse("false")


def find_user(request, user_input):
	response =[model_to_dict(i) for i in User.objects.filter(username__contains=user_input)]
	return JsonResponse(response, safe=False)