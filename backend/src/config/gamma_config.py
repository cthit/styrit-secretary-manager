import os

SECRET_KEY = os.environ.get("SECRETARY_SECRET_KEY", "secret")

GAMMA_CLIENT_ID = os.environ.get("GAMMA_CLIENT_ID", "GhRWwhs15iAeLNTfZ2ryNzP5U47IeTSZm8DaGyeTzZi3VKemrjJn8rSGHv1Kb5zRYOhMai7a4jx")
GAMMA_SECRET = os.environ.get('GAMMA_SECRET', 'uOst5FLa28pMIdegw3cgVxJUjYDmX2rOMXedvu3APjrSbtpqdHW1dEAuHbOVW2svo1N26ErE5LQ')
GAMMA_ME_URI = os.environ.get('GAMMA_ME_URI', 'http://localhost:8081/api/users/me')
GAMMA_TOKEN_URI = os.environ.get('GAMMA_TOKEN_URI', 'http://localhost:8081/api/oauth/token')
GAMMA_AUTHORIZATION_URI = os.environ.get('GAMMA_AUTHORIZATION_URI', 'http://localhost:8081/api/oauth/authorize')
GAMMA_REDIRECT_URI = os.environ.get('GAMMA_REDIRECT_URI', 'http://localhost:3001/auth/account/callback')
