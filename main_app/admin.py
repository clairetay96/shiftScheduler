from django.contrib import admin
from .models import WorkGroup, Period, Shift, Notification, UserPreference

# Register your models here.

admin.site.register(WorkGroup)
admin.site.register(Period)
admin.site.register(Shift)
admin.site.register(Notification)
admin.site.register(UserPreference)