from rest_framework import serializers
from .models import WorkGroup, Period, Shift, Notification, UserPreference

from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('username', 'pk')


class WorkGroupSerializer(serializers.ModelSerializer):
	members = UserSerializer(read_only=True, many=True)
	admins = UserSerializer(read_only=True, many=True)
	class Meta:
		model = WorkGroup
		fields = ('name', 'admins', 'members')

class PeriodSerializer(serializers.ModelSerializer):
	class Meta:
		model = Period
		fields = ('id','group','period_start', 'period_end', 'published')

class ShiftSerializer(serializers.ModelSerializer):
	users = UserSerializer(many=True)
	class Meta:
		model = Shift
		fields = ('period','shift_start', 'shift_end', 'workers_required', 'users')


class NotificationSerializer(serializers.ModelSerializer):
	class Meta:
		model = Notification
		fields = ('message','user', 'received_at')

class UserPreferenceSerializer(serializers.ModelSerializer):
	user = UserSerializer()
	period = PeriodSerializer()
	class Meta:
		model = UserPreference
		fields = ('period','user', 'blocked_out_shifts', 'preferred_shifts', 'submitted_at')