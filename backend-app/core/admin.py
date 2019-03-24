from django.contrib import admin
from django.utils.safestring import mark_safe

from .models import Profile
from .helpers import get_avatar_url


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):

    readonly_fields = [..., "preview_avatar"]

    def preview_avatar(self, obj):
        return mark_safe('<img src="{url}" width="{width}" height={height} />'.format(
            url = get_avatar_url(obj.key),
            width=obj.avatar.width,
            height=obj.avatar.height,
            )
    )
