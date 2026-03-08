import requests
import time
from backend.config import Config

class WeatherService:
    def __init__(self):
        self.api_key = Config.WEATHER_API_KEY
        self.base_url = "http://api.openweathermap.org/data/2.5/weather"
        self.cache = {}
        self.cache_duration = 3600 # 1 hour
        
        # Mapping TN districts to key cities
        self.district_map = {
            'Salem': 'Salem,IN',
            'Coimbatore': 'Coimbatore,IN',
            'Madurai': 'Madurai,IN',
            'Chennai': 'Chennai,IN',
            'Trichy': 'Tiruchirappalli,IN',
            'Tirunelveli': 'Tirunelveli,IN',
            'Vellore': 'Vellore,IN',
            'Erode': 'Erode,IN'
        }

    def get_weather(self, district):
        city = self.district_map.get(district, f"{district},IN")
        
        # Check cache
        if city in self.cache:
            data, timestamp = self.cache[city]
            if time.time() - timestamp < self.cache_duration:
                return data
        
        # Fetch from API
        try:
            params = {
                'q': city,
                'appid': self.api_key,
                'units': 'metric'
            }
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            data = response.json()
            
            result = {
                'temp': data['main']['temp'],
                'humidity': data['main']['humidity'],
                'rainfall': data.get('rain', {}).get('1h', 0) if 'rain' in data else 0,
                'description': data['weather'][0]['description']
            }
            
            # Update cache
            self.cache[city] = (result, time.time())
            return result
        except Exception as e:
            print(f"Weather API Error: {e}")
            # Return dummy data for demo if API fails
            return {
                'temp': 30.5,
                'humidity': 65,
                'rainfall': 0,
                'description': 'clear sky (API Placeholder)'
            }

weather_service = WeatherService()
