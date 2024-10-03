import { ForecastContext } from "@/hooks/ForecastContext";
import { useForecast } from "@/hooks/useForecase";
import { Stack } from "expo-router";

export default function WeatherLayout() {
  const [ date, hourlyForecasts, loadForecast ] = useForecast();

  return (
    <ForecastContext.Provider value={{ date, hourlyForecasts, loadForecast }}>
      <Stack>
        <Stack.Screen
          name="weather"
          options={{
            title: "Weather",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="search"
          options={{
            title: "Search by Zip Code",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="hourly-forecast"
          options={{
            title: "Hourly Forecast",
          }}
        />
      </Stack>
    </ForecastContext.Provider>
  );
}
