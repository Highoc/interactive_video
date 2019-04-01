from django.contrib import admin

from .models import Rating, RatingRecord

admin.site.register(Rating)
admin.site.register(RatingRecord)
