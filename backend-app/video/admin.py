from django.contrib import admin

from .models import Source, Video, VideoPart

admin.site.register(Source)
admin.site.register(Video)
admin.site.register(VideoPart)
