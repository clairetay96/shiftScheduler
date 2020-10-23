from django.shortcuts import render
from django.forms.models import model_to_dict
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User, AnonymousUser

from django.contrib.auth import SESSION_KEY
from django.contrib.sessions.models import Session

import datetime
import pytz

from rest_framework import viewsets, generics
from rest_framework.response import Response

from rest_framework.renderers import JSONRenderer
import json


from .serializers import WorkGroupSerializer, PeriodSerializer, ShiftSerializer, NotificationSerializer, UserPreferenceSerializer, UserSerializer
from .models import WorkGroup, Period, Shift, Notification, UserPreference

def make_timezone_aware(input_string):
	datetime_obj = datetime.datetime.strptime(input_string, "%Y-%m-%dT%H:%M") if len(input_string)==16 else datetime.datetime.strptime(input_string, "%Y-%m-%dT%H:%M:%S")


	return pytz.timezone('Asia/Singapore').localize(datetime_obj)

class WorkGroupView(generics.ListCreateAPIView):
	serializer_class = WorkGroupSerializer

	#only get groups of the logged in user
	def get_queryset(self):
		user_id = self.request.user.id
		return WorkGroup.objects.filter(members__id=user_id)


	def get(self, request, format=None):
		response = super().get(request)
		response = JSONRenderer().render(response.data)
		response = json.loads(response.decode("utf-8"))

		for i in response:
			#check if the user is admin, add is_admin to all results
			if request.user.id in [j['id'] for j in i['admins']]:
				i['is_admin'] = True
			else:
				i['is_admin'] = False

			#check if the user has submitted preferences, add preference_submitted to all periods
			for j in i['periods']:
				if UserPreference.objects.filter(user__id=request.user.id, period__id=j['id']).exists():
					j['preference_submitted']= True
				else:
					j['preference_submitted']= False

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
			return Response(serializer.errors)


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

		for j in response['periods']:
			if UserPreference.objects.filter(user__id=request.user.id, period__id=j['id']).exists():
				j['preference_submitted'] = True
			else:
				j['preference_submitted'] = False


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

	def get(self, request, group_id):
		return super().get(request)

	def post(self, request, group_id):
		if request.user:
			#TO ADD: only an admin can add period.
			serializer = PeriodSerializer(data=request.data)
			if serializer.is_valid():
				serializer.save()
				return Response(serializer.data)
			print(serializer.errors)
			return Response(serializer.errors)


class PeriodViewWrite(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = PeriodSerializer
	lookup_field='id'

	def get_queryset(self):
		return Period.objects.filter(id=self.kwargs['id'])

	def get(self, request, id):
		return super().get(request)


	def put(self, request, id):
		if request.user:

			period_to_update = Period.objects.get(pk=id)

			#update relevant fields
			period_to_update.period_start = make_timezone_aware(request.data['period_start'])
			period_to_update.period_end = make_timezone_aware(request.data['period_end'])
			period_to_update.published = request.data['published']

			period_to_update.save()
			print("period updated.")

			return self.get(request, id)



#get all of a user's shifts
class ShiftView(generics.ListCreateAPIView):
	serializer_class = ShiftSerializer

	def get_queryset(self):
		##only get shifts of published.
		return Shift.objects.filter(users__id=self.request.user.id, period__published=True)

	def get(self, request):
		#also attach group id and group name.
		response = super().get(request)
		response = JSONRenderer().render(response.data)
		response = json.loads(response.decode("utf-8")) #dict of response

		for i in response:
			associated_group = WorkGroup.objects.get(periods__id=i['period'])
			i['group_name'] =  associated_group.name
			i['group_id'] = associated_group.id

		return Response(response)


	#for creating shifts with associated users.
	def post(self, request):

		request_data = request.data
		user_ids = request_data.pop('users')
		request_data['shift_start'] = make_timezone_aware(request_data['shift_start'])
		request_data['shift_end'] = make_timezone_aware(request_data['shift_end'])
		request_data['user_ids'] = user_ids

		serializer = ShiftSerializer(data=request_data)

		if serializer.is_valid():
			serializer.save()
			print(serializer.data)
			return Response(serializer.data)
		print("-----------INVALID SERIALIZER DATA")
		print(serializer.errors)
		return Response(serializer.errors)



#single shift by ID
class ShiftViewWrite(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = ShiftSerializer
	lookup_field='id'

	def get_queryset(self):
		return Shift.objects.filter(id=self.kwargs['id'])

	def put(self, request, id):

		shift_to_update = Shift.objects.get(pk=id)
		user_ids = request.data['users']

		#update shift start, end and worker requirement
		shift_to_update.shift_start = make_timezone_aware(request.data['shift_start'])
		shift_to_update.shift_end = make_timezone_aware(request.data['shift_end'])
		shift_to_update.workers_required = request.data['workers_required']

		#update shift workers - clear set then rebuild.
		shift_to_update.users.clear()
		for i in user_ids:
			shift_to_update.users.add(i)

		shift_to_update.save()

		return JsonResponse(True, safe=False)

class UserPreferenceView(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = UserPreferenceSerializer
	lookup_field='id'

	def get_queryset(self):
		return UserPreference.objects.filter(id=self.kwargs['id'])

	def get(self, request, id):
		return super().get(request)

	def put(self, request, id):
		if request.user:

			newPreferredIDs = request.data['preferred_ids']
			newBlockedOutIDs = request.data['blocked_ids']

			preference_to_update = UserPreference.objects.get(id=id)
			preference_to_update.submitted_at = pytz.timezone('Asia/Singapore').localize(datetime.datetime.now())
			preference_to_update.preferred_shifts.clear()
			preference_to_update.blocked_out_shifts.clear()

			for i in newPreferredIDs:
				preference_to_update.preferred_shifts.add(i)
			for j in newBlockedOutIDs:
				preference_to_update.blocked_out_shifts.add(j)

			preference_to_update.save()
			return self.get(request, id)


#single user's preferences
class IndivUserPreferenceView(generics.ListCreateAPIView):
	serializer_class = UserPreferenceSerializer

	def get_queryset(self):
		return UserPreference.objects.filter(user__id = self.request.user.id)

	def post(self, request, group_id, period_id):
		if request.user:
			requestData = request.data
			requestData['user'] = request.user.id
			serializer = UserPreferenceSerializer(data=requestData)

			if serializer.is_valid():
				serializer.save()
				return Response(serializer.data)

			return Response(serializer.errors)


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
		userCred = {
		'username': request.user.username,
		'id': request.user.id,
		'loggedIn': True
		}
		return JsonResponse(userCred)
	return JsonResponse({'loggedIn': False})


def find_user(request, user_input):
	response =[model_to_dict(i) for i in User.objects.filter(username__contains=user_input)]
	return JsonResponse(response, safe=False)