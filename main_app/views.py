from django.shortcuts import render
from rest_framework import viewsets
from .serializers import WorkGroupSerializer, PeriodSerializer, ShiftSerializer, NotificationSerializer, UserPreferenceSerializer
from .models import WorkGroup, Period, Shift, Notification, UserPreference


class WorkGroupView(viewsets.ModelViewSet):
	serializer_class = WorkGroupSerializer
	queryset = WorkGroup.objects.all()

class PeriodView(viewsets.ModelViewSet):
	serializer_class = PeriodSerializer
	queryset = Period.objects.all()

class ShiftView(viewsets.ModelViewSet):
	serializer_class = ShiftSerializer
	queryset = Shift.objects.all()

class UserPreferenceView(viewsets.ModelViewSet):
	serializer_class = UserPreferenceSerializer
	queryset = UserPreference.objects.all()

class NotificationView(viewsets.ModelViewSet):
	serializer_class = NotificationSerializer
	queryset = Notification.objects.all()