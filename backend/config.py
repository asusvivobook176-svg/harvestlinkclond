import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'harvestlink_secret_key')
    DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database', 'harvestlink.db')
    WEATHER_API_KEY = os.environ.get('WEATHER_API_KEY', 'YOUR_API_KEY')
    JWT_EXPIRATION_HOURS = 24
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
