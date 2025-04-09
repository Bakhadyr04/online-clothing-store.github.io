import os
from pathlib import Path
# from dotenv import load_dotenv
from django.core.exceptions import ImproperlyConfigured

# load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'ylh&m!h+9j-3^*xsw0yv!@iqx98-^7f)6=9c#4_pgy+6i%^x3*%'

DEBUG = True

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_filters',
    'store.apps.StoreConfig',
    'cart.apps.CartConfig',
    'checkout.apps.CheckoutConfig',
    'users.apps.UsersConfig',
    'taggit',
    'rest_framework',
    'corsheaders',
    'django_extensions',
    'simple_history',
    'import_export',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware'
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Разрешаем доступ с фронтенда
    "http://127.0.0.1:3000",
]


ROOT_URLCONF = 'OnlineStore.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'OnlineStore.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'ru'
TIME_ZONE = 'Europe/Moscow'

USE_I18N = True
USE_L10N = True
USE_TZ = True

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / "static",
]

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

TAGGIT_CASE_INSENSITIVE = True

LOGIN_URL = 'users:login'
LOGIN_REDIRECT_URL = 'store:home'

EMAIL_BACKEND = 'django.core.mail.backends.filebased.EmailBackend'
EMAIL_FILE_PATH = os.path.join(BASE_DIR, 'sent_emails')

TELEGRAM_TOKEN = os.getenv('TELEGRAM_TOKEN')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')


# Проверки настроек
def check_settings():
    required_settings = [
        'SECRET_KEY',
        'DATABASES',
        'INSTALLED_APPS',
        'MIDDLEWARE',
        'ROOT_URLCONF',
        'TEMPLATES',
        'WSGI_APPLICATION',
        'LANGUAGE_CODE',
        'TIME_ZONE',
        'STATIC_URL',
        'MEDIA_URL',
        'DEFAULT_AUTO_FIELD',
    ]

    for setting in required_settings:
        if not globals().get(setting):
            raise ImproperlyConfigured(f"Настройка {setting} не задана.")

    if not DEBUG and 'django.middleware.security.SecurityMiddleware' not in MIDDLEWARE:
        raise ImproperlyConfigured("Для production среды требуется SecurityMiddleware.")


check_settings()
