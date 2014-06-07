from django.conf.urls import patterns, include, url

from django.contrib import admin

import color

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'colorandy.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', 'color.views.home', name="home"),
    url(r'^admin/', include(admin.site.urls)),
)
