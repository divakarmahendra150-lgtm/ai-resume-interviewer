"""
ASGI config for backend_for_ai_interview_questions_genrater project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_for_ai_interview_questions_genrater.settings')

application = get_asgi_application()
