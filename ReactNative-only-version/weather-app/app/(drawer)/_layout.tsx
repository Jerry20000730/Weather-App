import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Drawer from 'expo-router/drawer';
import { WeatherContext } from '@/hooks/WeatherContext';
import { useWeather } from '@/hooks/useWeather';

export default function DrawerLayout() {
    const [zip, weatherData, loadWeatherData, loadWeatherDataByZip, syncWeatherData] = useWeather();

    return (
        <WeatherContext.Provider value={{ zip, weatherData, loadWeatherData, loadWeatherDataByZip, syncWeatherData }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Drawer>
                    <Drawer.Screen 
                        name="home" 
                        options={{
                            drawerLabel: "Weather",
                            title: 'Weather',
                        }}
                    />
                    <Drawer.Screen
                        name="manage-favorites"
                        options={{
                            drawerLabel: "Manage Favorites",
                            title: 'Manage Favorites',
                        }}
                    />
                </Drawer>
            </GestureHandlerRootView>
        </WeatherContext.Provider>
    );
}