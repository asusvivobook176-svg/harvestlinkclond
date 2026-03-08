import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getWeatherData } from '../services/weatherService';
import type { WeatherData } from '../services/weatherService';

interface WeatherWidgetProps {
    district: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ district }) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            const data = await getWeatherData(district);
            setWeather(data);
            setLoading(false);
        };

        fetchWeather();
        // Refresh every 30 minutes
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, [district]);

    if (loading) return <div className="animate-pulse bg-blue-100 rounded-xl p-6 h-48 flex items-center justify-center text-blue-600 font-medium">Loading weather...</div>;

    if (!weather) return <div className="bg-gray-100 rounded-xl p-6 text-gray-500 text-center italic">Weather data unavailable for {district}</div>;

    const getWeatherIcon = (type: string) => {
        const icons: Record<string, string> = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Drizzle': '🌦️',
            'Thunderstorm': '⛈️',
            'Snow': '❄️',
        };
        return icons[type] || '🌤️';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-linear-to-br from-blue-400 to-blue-600 text-white rounded-xl p-6 shadow-lg"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm opacity-80 font-medium uppercase tracking-wider mb-1">{district}</p>
                    <div className="flex items-end gap-2">
                        <p className="text-5xl font-black">{Math.round(weather.temperature)}°C</p>
                        <p className="text-sm opacity-90 mb-1">Feels like {Math.round(weather.feelsLike)}°C</p>
                    </div>
                    <p className="text-lg opacity-90 capitalize mt-1 font-semibold">{weather.description}</p>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                        <div className="bg-white/10 rounded-lg p-2">
                            <p className="opacity-70">Humidity</p>
                            <p className="font-bold text-sm">{weather.humidity}%</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2">
                            <p className="opacity-70">Wind Speed</p>
                            <p className="font-bold text-sm">{weather.windSpeed} m/s</p>
                        </div>
                    </div>
                </div>
                <div className="text-7xl drop-shadow-md">
                    {getWeatherIcon(weather.weatherType)}
                </div>
            </div>
        </motion.div>
    );
};
