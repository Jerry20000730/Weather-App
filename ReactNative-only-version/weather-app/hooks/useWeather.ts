import { useState } from "react";
import { searchOrFavorite } from "@/hooks/WeatherContext";

export function useWeather() : [string, any, (input: searchOrFavorite) => void, (zip: string) => void, (input: searchOrFavorite) => void] {
    const [zip, setZip] = useState<string>("");
    const [weatherData, setWeatherData] = useState<any>(null);
      
    const loadWeatherData = async (input: searchOrFavorite) => {
        try {
            const response = await fetch("http://api.weatherapi.com/v1/forecast.json?key=65ef1295a13048b5ae4144239243008&q="+input.zip+"&days=3&aqi=no&alerts=no");
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error.message || "Failed to fetch weather data");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const loadWeatherDataByZip = async (zip: string) => {
        try {
            const data = await loadWeatherData({ zip, city: "", state: "" });
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const syncWeatherData = async (input: searchOrFavorite) => {
        try {
            const response = await fetch("http://api.weatherapi.com/v1/forecast.json?key=65ef1295a13048b5ae4144239243008&q="+input.zip+"&days=3&aqi=no&alerts=no");
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error.message || "Failed to fetch weather data");
            }
            const data = await response.json();
            setWeatherData(data);
            setZip(input.zip);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    return [zip, weatherData, loadWeatherData, loadWeatherDataByZip, syncWeatherData];
}