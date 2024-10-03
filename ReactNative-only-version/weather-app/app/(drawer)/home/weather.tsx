import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ActivityIndicator,
  FlatList,
  Image,
  Alert,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState, useContext, useEffect } from "react";
import { FavoritesContext } from "@/hooks/FavoritesContext";
import { useRouter } from "expo-router";
import { WeatherContext } from "@/hooks/WeatherContext";
import { ForecastContext } from "@/hooks/ForecastContext";
import { useColorScheme } from "@/components/useColorScheme";

function formatDate(date: string) {
  const dateString = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  return dateString.toLocaleDateString("en-US", options);
}

export default function WeatherScreen() {
  // get the current color scheme mode
  const colorScheme = useColorScheme();

  const [isFavorite, setIsFavorite] = useState(false);
  const [isMetric, setIsMetric] = useState(true);

  const unit = isMetric ? "°F" : "°C";
  const windUnit = isMetric ? "MPH" : "KPH";

  const { favorites, addToFavorites } = useContext(FavoritesContext);
  const { zip, weatherData } = useContext(WeatherContext);
  const { loadForecast } = useContext(ForecastContext);

  useEffect(() => {
    if (favorites.some((favorite) => favorite.zip === zip)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  },[favorites, zip]);

  const router = useRouter();

  const handleAddFavorite = async (data: any) => {
    await addToFavorites({zip: zip, city: data.location.name, state: data.location.region});
    setIsFavorite(true);
  }

  const handleDayForecastPressed = (date: string) => {
    loadForecast(weatherData, date);
    router.push("/home/hourly-forecast");
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
      alignItems: "center",
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      marginLeft: 30,
      width: "100%",
    },
    searchContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    searchBar: {
      padding: 10,
      width: "60%",
      backgroundColor: colorScheme === "dark" ? "#fff" : "#eee",
      borderRadius: 4,
    },
    searchText: {
      color: colorScheme === "dark" ? "#999" : "rgba(85, 85, 85, 0.33)",
      fontSize: 14,
      fontStyle: "normal",
      fontWeight: "400",
      marginLeft: 15,
    },
    promptText: {
      marginTop: 15,
      color: colorScheme === "dark" ? "#FFF" : "#000",
      fontSize: 14,
      fontStyle: "normal",
      fontWeight: "400",
    },
    mainWindow: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    weatherContainer: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      marginTop: 10,
      gap: 5,
    },
    weatherTemp: {
      color: colorScheme === "dark" ? "#F3F3F3" : "#0C0C0C",
      fontSize: 48,
      fontStyle: "normal",
      fontWeight: "400",
    },
    weatherFeelTemp: {
      color: colorScheme === "dark" ? "#F3F3F3" : "#0C0C0C",
      fontSize: 20,
      fontStyle: "normal",
      fontWeight: "400",
    },
    weatherCityTitle: {
      color: colorScheme === "dark" ? "#F3F3F3" : "#0C0C0C",
      fontSize: 32,
      fontStyle: "normal",
      fontWeight: "400",
      marginTop: 10,
    },
    weatherStateTitle: {
      color: colorScheme === "dark" ? "#F3F3F3" : "#0C0C0C",
      fontSize: 24,
      fontStyle: "normal",
      fontWeight: "400",
    },
    weatherDetailsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      gap: 10,
      marginTop: 30,
    },
    addFavoriteBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      gap: 10,
    },
    addFavorite: {
      color: colorScheme === "dark" ? "#77ffff" : "#0a84ff",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "400",
    },
    sunAndWind: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      gap: 10,
      marginTop: 20,
    },
    sunRiseAndSunSet: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "80%",
      backgroundColor: colorScheme === "dark" ? "#58cc00" : "#a7d3ff",
      borderRadius: 10,
      padding: 10,
      gap: 10,
    },
    sunRise: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    sunSet: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    sunRiseTitle: {
      color: colorScheme === "dark" ? "#000" : "#555",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "400",
    },
    sunRiseValue: {
      color: colorScheme === "dark" ? "#0C0C0C" : "#0C0C0C",
      fontSize: 20,
      fontStyle: "normal",
      fontWeight: "400",
    },
    sunSetTitle: {
      color: colorScheme === "dark" ? "#000" : "#555",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "400",
    },
    sunSetValue: {
      color: colorScheme === "dark" ? "#0C0C0C" : "#0C0C0C",
      fontSize: 20,
      fontStyle: "normal",
      fontWeight: "400",
    },
    windSpeedAndDirection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "80%",
      backgroundColor: colorScheme === "dark" ? "#58cc00" : "#a7d3ff",
      borderRadius: 10,
      padding: 10,
      gap: 10,
    },
    windTitle: {
      color: colorScheme === "dark" ? "#000" : "#555",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "400",
    },
    windSpeed: {
      color: colorScheme === "dark" ? "#0C0C0C" : "#0C0C0C",
      fontSize: 20,
      fontStyle: "normal",
      fontWeight: "400",
    },
    windSpeedUnit: {
      color:colorScheme === "dark" ? "#0C0C0C" : "#0C0C0C",
      fontSize: 20,
      fontStyle: "normal",
      fontWeight: "400",
    },
    windDirection: {
      color: colorScheme === "dark" ? "#0C0C0C" : "#0C0C0C",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "400",
    },
    threeDayForecast: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      gap: 10,
      marginTop: 20,
    },
    threeDayForecastTitle: {
      color: colorScheme === "dark" ? "#FFFFFF" : "#0C0C0C",
      fontSize: 15,
      fontStyle: "normal",
      fontWeight: "400",
    },
    threeDayForecaseCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "80%",
      backgroundColor: colorScheme === "dark" ? "#3cff00" : "#c3e1ff",
      padding: 10,
      gap: 30,
    },
    threeDayForecastDate: {
      color: colorScheme === "dark" ? "#0C0C0C" : "#0C0C0C",
      fontSize: 20,
      fontStyle: "normal",
      fontWeight: "400",
    },
    threeDayForecastTempHigh: {
      color: colorScheme === "dark" ? "#0C0C0C" : "#0C0C0C",
      fontSize: 20,
      fontStyle: "normal",
      fontWeight: "400",
    },
    threeDayForecastWeatherIcon: {
      width: 32,
      height: 32,
    },
    threeDayForecastTempLow: {
      color: colorScheme === "dark" ? "#888" : "#777",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "400",
    },
    switchMetricsText: {
      color: colorScheme === "dark" ? "#66ffff" : "#0a84ff",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "400",
      marginTop: 40,
    },
  });

  return (
    <View style={styles.container}>
      <Pressable style={styles.searchBar} onPress={() => router.push("/home/search")}>
        <View style={styles.searchContent}>
          <FontAwesome name="search" size={16} color="rgba(85, 85, 85, 0.33)" />
          <Text style={styles.searchText}>Enter a Zip Code</Text>
        </View>
      </Pressable>
      {weatherData ? (
        <View style={styles.mainWindow}>
          <View style={styles.weatherContainer}>
            <Text style={styles.weatherTemp}>
              {isMetric
                ? weatherData.current.temp_f
                : weatherData.current.temp_c}
              {unit}
            </Text>
            <Text style={styles.weatherFeelTemp}>
              Feels like{" "}
              {isMetric
                ? weatherData.current.feelslike_f
                : weatherData.current.feelslike_c}
              {unit}
            </Text>
            <Text style={styles.weatherCityTitle}>
              {weatherData.location.name}
            </Text>
            <Text style={styles.weatherStateTitle}>
              {weatherData.location.region}
            </Text>
          </View>
          <View style={styles.weatherDetailsContainer}>
            {isFavorite ? (
              <Pressable>
                <FontAwesome name="heart" color="red" size={16} />
              </Pressable>
            ) : (
              <Pressable
                style={styles.addFavoriteBtn}
                onPress={() => handleAddFavorite(weatherData)}
              >
                <FontAwesome name="heart-o" color="red" size={16} />
                <Text style={styles.addFavorite}>Add Favorite</Text>
              </Pressable>
            )}
          </View>
          <View style={styles.sunAndWind}>
            <View style={styles.sunRiseAndSunSet}>
              <View style={styles.sunRise}>
                <Text style={styles.sunRiseTitle}>Sunrise: </Text>
                <Text style={styles.sunRiseValue}>
                  {weatherData.forecast.forecastday[0].astro.sunrise}
                </Text>
              </View>
              <View style={styles.sunSet}>
                <Text style={styles.sunSetTitle}>Sunset: </Text>
                <Text style={styles.sunSetValue}>
                  {weatherData.forecast.forecastday[0].astro.sunset}
                </Text>
              </View>
            </View>
            <View style={styles.windSpeedAndDirection}>
              <Text style={styles.windTitle}>Wind: </Text>
              <Text style={styles.windSpeed}>
                {isMetric
                  ? weatherData.current.wind_mph
                  : weatherData.current.wind_kph}
              </Text>
              <Text style={styles.windSpeedUnit}>{windUnit}</Text>
              <Text style={styles.windDirection}>
                {weatherData.current.wind_dir}
              </Text>
            </View>
          </View>
          <View style={styles.threeDayForecast}>
            <Text style={styles.threeDayForecastTitle}>3 Day Forecast</Text>
            <Pressable style={styles.threeDayForecaseCard} onPress={() => handleDayForecastPressed(weatherData.forecast.forecastday[0].date)}>
              <Text style={styles.threeDayForecastDate}>
                {formatDate(weatherData.forecast.forecastday[0].date)}
              </Text>
              <Image
                style={styles.threeDayForecastWeatherIcon}
                source={{
                  uri:
                    "https:" +
                    weatherData.forecast.forecastday[0].day.condition.icon,
                }}
              />
              <Text style={styles.threeDayForecastTempHigh}>
                {isMetric
                  ? weatherData.forecast.forecastday[0].day.maxtemp_f
                  : weatherData.forecast.forecastday[0].day.maxtemp_c}
                {unit}
              </Text>
              <Text style={styles.threeDayForecastTempLow}>
                {isMetric
                  ? weatherData.forecast.forecastday[0].day.mintemp_f
                  : weatherData.forecast.forecastday[0].day.mintemp_c}
                {unit}
              </Text>
            </Pressable>
            <Pressable style={styles.threeDayForecaseCard} onPress={() => handleDayForecastPressed(weatherData.forecast.forecastday[1].date)}>
              <Text style={styles.threeDayForecastDate}>
                {formatDate(weatherData.forecast.forecastday[1].date)}
              </Text>
              <Image
                style={styles.threeDayForecastWeatherIcon}
                source={{
                  uri:
                    "https:" +
                    weatherData.forecast.forecastday[1].day.condition.icon,
                }}
              />
              <Text style={styles.threeDayForecastTempHigh}>
                {isMetric
                  ? weatherData.forecast.forecastday[1].day.maxtemp_f
                  : weatherData.forecast.forecastday[1].day.maxtemp_c}
                {unit}
              </Text>
              <Text style={styles.threeDayForecastTempLow}>
                {isMetric
                  ? weatherData.forecast.forecastday[1].day.mintemp_f
                  : weatherData.forecast.forecastday[1].day.mintemp_c}
                {unit}
              </Text>
            </Pressable>
            <Pressable style={styles.threeDayForecaseCard} onPress={() => handleDayForecastPressed(weatherData.forecast.forecastday[2].date)}>
              <Text style={styles.threeDayForecastDate}>
                {formatDate(weatherData.forecast.forecastday[2].date)}
              </Text>
              <Image
                style={styles.threeDayForecastWeatherIcon}
                source={{
                  uri:
                    "https:" +
                    weatherData.forecast.forecastday[2].day.condition.icon,
                }}
              />
              <Text style={styles.threeDayForecastTempHigh}>
                {isMetric
                  ? weatherData.forecast.forecastday[2].day.maxtemp_f
                  : weatherData.forecast.forecastday[2].day.maxtemp_c}
                {unit}
              </Text>
              <Text style={styles.threeDayForecastTempLow}>
                {isMetric
                  ? weatherData.forecast.forecastday[2].day.mintemp_f
                  : weatherData.forecast.forecastday[2].day.mintemp_c}
                {unit}
              </Text>
            </Pressable>
          </View>
          <Pressable onPress={() => setIsMetric(!isMetric)}>
            <Text style={styles.switchMetricsText}>
              Switch to {isMetric ? "Imperial" : "Metric"}
            </Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.promptText}>
          Click on the search bar to enter a zip code
        </Text>
      )}
    </View>
  );
}
