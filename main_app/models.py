from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import User

# Create your models here.

class WorkGroup(models.Model):
	name = models.CharField(max_length=140)
	admins = models.ManyToManyField(User, related_name="admins")
	members = models.ManyToManyField(User, related_name="members")

	def __str__(self):
		return self.name

class Period(models.Model):
	work_group = models.ForeignKey(WorkGroup, on_delete=models.CASCADE, related_name="periods")
	period_start = models.DateTimeField()
	period_end = models.DateTimeField()
	published = models.BooleanField(default=False)

	def __str__(self):
		return f"Period by {self.work_group.name} starts at {self.period_start} ends at {self.period_end}."

class Shift(models.Model):
	period = models.ForeignKey(Period, on_delete=models.CASCADE, blank=True)
	shift_start = models.DateTimeField()
	shift_end = models.DateTimeField()
	workers_required = models.IntegerField()
	users = models.ManyToManyField(User, blank=True)

class UserPreference(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	period = models.ForeignKey(Period, on_delete=models.CASCADE)
	blocked_out_shifts = models.ManyToManyField(Shift, related_name="blocked_out_shifts", blank=True )
	preferred_shifts = models.ManyToManyField(Shift, related_name="preferred_shifts", blank=True)
	submitted_at = models.DateTimeField(default=now)


class Notification(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	message = models.TextField()
	received_at = models.DateTimeField(default=now)
	def __str__(self):
		return self.message