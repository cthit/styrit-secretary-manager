import os

SECRET_KEY = os.environ.get("SECRETARY_SECRET_KEY", "secret")

GAMMA_CLIENT_ID = os.environ.get("GAMMA_CLIENT_ID", "id")
GAMMA_SECRET = os.environ.get('GAMMA_SECRET', 'secret')
GAMMA_USERINFO_URI = os.environ.get('GAMMA_USERINFO_URI', 'http://localhost:8081/oauth2/userinfo')
GAMMA_TOKEN_URI = os.environ.get('GAMMA_TOKEN_URI', 'http://localhost:8081/oauth2/token')
GAMMA_AUTHORIZATION_URI = os.environ.get('GAMMA_AUTHORIZATION_URI', 'http://localhost:8081/oauth2/authorize')
GAMMA_REDIRECT_URI = os.environ.get('GAMMA_REDIRECT_URI', 'http://localhost:3001/auth/account/callback')
