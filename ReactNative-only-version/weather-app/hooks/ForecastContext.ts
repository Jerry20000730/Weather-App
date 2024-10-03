import { createContext, useState } from "react";

export interface forecast {
    hour: string;
    temp_f: number;
    temp_c: number;
    icon: string;
    humidity: number;
}

interface WeatherContext {
    date: string;
    hourlyForecasts: forecast[];
    loadForecast: (data: any, date: string) => void;
}

export const ForecastContext = createContext<WeatherContext>({
    date: "",
    hourlyForecasts: [],
    loadForecast: () => {},
});
