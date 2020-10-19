from rest_framework import serializers

from .models import WorkGroup, Period, Shift, Notification, UserPreference
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
	password = serializers.CharField(write_only=True)
	class Meta:
		model = User
		fields = ('username', 'id', 'email', 'password')
		write_only_fields = ("password",)


class ShiftSerializer(serializers.ModelSerializer):
	users = UserSerializer(read_only=True, many=True, required=False)

	class Meta:
		model = Shift
		fields = ('period','shift_start', 'shift_end', 'workers_required', 'users', 'id')
		lookup_field='id'

class PeriodSerializer(serializers.ModelSerializer):
	shift_set = ShiftSerializer(many=True, required=False)

	class Meta:
		model = Period
		fields = ('id', 'work_group','period_start', 'period_end', 'published', 'shift_set')
		lookup_field='id'

	def create(self, validated_data):
		shift_data = validated_data.pop('shift_set')
		newPeriod = Period.objects.create(**validated_data)

		for i in shift_data:
			Shift.objects.create(period=newPeriod, **i)
		return newPeriod



class WorkGroupSerializer(serializers.ModelSerializer):
	members = UserSerializer(read_only=True, many=True)
	admins = UserSerializer(read_only=True, many=True)
	periods = PeriodSerializer(read_only=True, many=True)

	members_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True,many=True)
	admins_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True,many=True)

	class Meta:
		model = WorkGroup
		fields = ('id', 'name', 'admins', 'members', 'periods', 'members_id', 'admins_id')
		lookup_field = 'id'

	def create(self, validated_data):
		members = validated_data.pop('members_id')
		admins = validated_data.pop('admins_id')
		members.append(admins[0])

		newWorkGroup = WorkGroup.objects.create(**validated_data)

		for i in admins:
			newWorkGroup.admins.add(i)


		for i in members:
			newWorkGroup.members.add(i)

		return newWorkGroup




class NotificationSerializer(serializers.ModelSerializer):
	user = UserSerializer(read_only=True)
	class Meta:
		model = Notification
		fields = ('id', 'message','user', 'received_at')

class UserPreferenceSerializer(serializers.ModelSerializer):
	user = UserSerializer(read_only=True)
	period = PeriodSerializer(read_only=True)
	class Meta:
		model = UserPreference
		fields = ('id', 'period','user', 'blocked_out_shifts', 'preferred_shifts', 'submitted_at')