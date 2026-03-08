import axios from 'axios';

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export interface WeatherData {
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    weatherType: string;
    description: string;
    feelsLike: number;
    pressure: number;
}

export const getWeatherData = async (district: string): Promise<WeatherData | null> => {
    if (!WEATHER_API_KEY) {
        console.error('Weather API Key missing. Please set VITE_OPENWEATHER_API_KEY in .env');
        return null;
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather`,
            {
                params: {
                    q: `${district}, India`,
                    appid: WEATHER_API_KEY,
                    units: 'metric'
                }
            }
        );

        return {
            temperature: response.data.main.temp,
            humidity: response.data.main.humidity,
            rainfall: response.data.rain?.['1h'] || 0,
            windSpeed: response.data.wind.speed,
            weatherType: response.data.weather[0].main,
            description: response.data.weather[0].description,
            feelsLike: response.data.main.feels_like,
            pressure: response.data.main.pressure,
        };
    } catch (error) {
        console.error('Weather API Error:', error);
        return null;
    }
};
