import { useState } from 'react';
import { forecast } from '@/hooks/ForecastContext';

function formatTimeTo12Hour(time: string): string {
    const date = new Date(time);
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return hours + " " + ampm;
}

function extractHourlyForecasts(filteredForecasts: any) {
    return filteredForecasts.map((forecast: any) => {
        return {
            hour: formatTimeTo12Hour(forecast.time),
            temp_f: forecast.temp_f,
            temp_c: forecast.temp_c,
            icon: "https:" + forecast.condition.icon,
            humidity: forecast.humidity,
        };
    });
}

export function useForecast() : [string, forecast[], (data: any, date: string) => void] {
    const [date, setDate] = useState<string>("");
    const [hourlyForecasts, setHourlyForecasts] = useState<forecast[]>([]);

    const loadForecast = (data: any, date: string) => {
        setDate(date);
        const currentHour = new Date().getHours();
        const forecastDay = data.forecast.forecastday.find((day: any) => day.date === date);
        const filteredForecasts = forecastDay.hour.filter((forecast: any) => {
            const forecastHour = new Date(forecast.time).getHours();
            return forecastHour >= currentHour && forecastHour <= 23;
        });
        // console.log(forecastDay.hour);
        // const filteredForecasts = forecastDay.hour;
        console.log(extractHourlyForecasts(filteredForecasts));
        setHourlyForecasts(extractHourlyForecasts(filteredForecasts));
    };

    return [date, hourlyForecasts, loadForecast];
}