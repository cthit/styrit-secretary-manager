import os

POSTGRES_USER = os.environ.get("SECRETARY_POSTGRES_USER", "secretary")
POSTGRES_PASSWORD = os.environ.get("SECRETARY_POSTGRES_PASSWORD", "password")
POSTGRES_HOST = os.environ.get("SECRETARY_POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.environ.get("SECRETARY_POSTGRES_PORT", "5432")
POSTGRES_DB = os.environ.get("SECRETARY_POSTGRES_DB", "secretary")