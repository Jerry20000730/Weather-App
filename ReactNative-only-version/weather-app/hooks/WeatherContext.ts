import { favorite } from "@/hooks/FavoritesContext";
import { createContext } from "react";

export interface search {
    zip: string;
    city: string;
    state: string;
}

export type searchOrFavorite = search | favorite;

interface WeatherContext {
    zip: string;
    weatherData: any;
    loadWeatherData: (input: searchOrFavorite) => void;
    loadWeatherDataByZip: (zip: string) => void;
    syncWeatherData: (input: searchOrFavorite) => void;
}

export const WeatherContext = createContext<WeatherContext>({
    zip: '',
    weatherData: null,
    loadWeatherData: () => {},
    loadWeatherDataByZip: () => {},
    syncWeatherData: () => {},
});