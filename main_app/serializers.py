from rest_framework import serializers
from .models import WorkGroup, Period, Shift, Notification, UserPreference


class WorkGroupSerializer(serializers.ModelSerializer):
	class Meta:
		model = WorkGroup
		fields = ('id','name','admins', 'members')

class PeriodSerializer(serializers.ModelSerializer):
	class Meta:
		model = Period
		fields = ('id','group','period_start', 'period_end', 'published')

class ShiftSerializer(serializers.ModelSerializer):
	class Meta:
		model = Shift
		fields = ('period','shift_start', 'shift_end', 'workers_required', 'users')


class NotificationSerializer(serializers.ModelSerializer):
	class Meta:
		model = Notification
		fields = ('message','user', 'received_at')

class UserPreferenceSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserPreference
		fields = ('period','user', 'blocked_out_shifts', 'preferred_shifts', 'submitted_at')