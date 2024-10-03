import { StyleSheet, Text, View, Pressable, Modal, TextInput, ActivityIndicator, FlatList, Image, Alert } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";

import React, { useState } from 'react';

interface search {
  id: number;
  zip: string;
  city: string;
  state: string;
}

interface favorite {
  id: number;
  zip: string;
  city: string;
  state: string;
}

function validateZipCode(zipCode: string) : boolean {
  const zipCodePattern = /^\d{5}(-\d{4})?$/;
  return zipCode ? zipCodePattern.test(zipCode) : false;
}

function extractSearchResult(zipCode: string, data: any) : search[] {
  return [{
    id: 1,
    zip: zipCode,
    city: data.location.name,
    state: data.location.region,
  }];
}

function formatDate(date : string) {
  const dateString = new Date(date);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return dateString.toLocaleDateString('en-US', options);
}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [searchResultsloading, setSearchResultsLoading] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [searchErrorMessage, setSearchErrorMessage] = useState('');
  const [favoriteErrorMessage, setFavoriteErrorMessage] = useState('');
  const [searchResults, setSearchResults] = useState<search[]>([]);
  const [favorites, setFavorites] = useState<favorite[]>([]);
  const [isMetric, setIsMetric] = useState(true);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const unit = isMetric ? '°F' : '°C';
  const windUnit = isMetric ? 'MPH' : 'KPH';

  const handleZipCodeChange = (text: string) => {
    setZipCode(text);
    if (validateZipCode(text)) {
      setSearchResultsLoading(true);
      setSearchErrorMessage('');
      setSearchResults([]);
      fetchWeather(text);
    } else if (!text) {
      setSearchResults([]);
      setSearchErrorMessage('');
    }
  };

  // Function to fetch weather data from API
  const fetchWeather = async (zip: string) => {
    setSearchResultsLoading(true);
    setSearchErrorMessage('');
    try {
      const response = await fetch("http://api.weatherapi.com/v1/forecast.json?key=65ef1295a13048b5ae4144239243008&q="+zip+"&days=3&aqi=no&alerts=no");
      if (!response.ok) {
        const data = await response.json();
        await delay(2000);
        setSearchErrorMessage('An error occurred: ' + data.error.message);
        return;
      }
      const data = await response.json();
      setWeatherData(data);
      await delay(2000);
      setSearchResults(extractSearchResult(zip, data));
    } catch (error: any) {
      await delay(2000);
      setSearchErrorMessage('An error occurred: ' + error.message);
    } finally {
      setSearchResultsLoading(false);
    }
  };

  const loadFavorites = async () => {
    setFavoritesLoading(true);
    setFavoriteErrorMessage('');
    try {
      const rsp = await fetch('http://10.0.2.2:4000/favorites');
      if (!rsp.ok) {
        const data = await rsp.json();
        await delay(2000);
        setFavoriteErrorMessage('Failed to load favorites: ' + data.error);
        return;
      }
      const data = await rsp.json();
      await delay(2000);
      setFavorites(data);
    } catch (error: any) {
      await delay(2000);
      setFavoriteErrorMessage('An error occurred: ' + error.message);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const openModal = async () => {
    setModalVisible(true);
    setZipCode('');
    setSearchResults([]);
    setSearchErrorMessage('');
    setFavoriteErrorMessage('');
    await loadFavorites();
  };

  const closeModal = () => {
    setModalVisible(false);
    setZipCode('');
    setSearchResults([]);
    setSearchErrorMessage('');
    setFavoriteErrorMessage('');
  };

  const loadWeatherData = (data: search | favorite) => {
    fetchWeather(data.zip);
    setModalVisible(false);
    setIsFavorite(favorites.some(fav => fav.zip === data.zip));
  };

  const addToFavorites = async (weatherData : any) => {
    if (zipCode && weatherData) {
      try {
        const rsp = await fetch('http://10.0.2.2:4000/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ zip: zipCode, city: weatherData.location.name, state: weatherData.location.region })
        });
        if (!rsp.ok) {
          const data = await rsp.json();
          Alert.alert("Failed to add favorite: " + data.error);
        }
        setIsFavorite(true);
      } catch (error) {
        Alert.alert("Failed to add favorite: " + error);
      }
    }
  }

  const removeFromFavorites = async (item: any) => {
    const fav = favorites.find(fav => fav.zip === item.zip);
    if (!fav) {
      alert("Favorite not found");
      return;
    }
    try {
      const rsp = await fetch(`http://10.0.2.2:4000/favorites/${fav.id}`, {
        method: 'DELETE',
      });

      if (!rsp.ok) {
        const data = await rsp.json();
        Alert.alert("Failed to delete favorite: " + data.error.message);
      } else {
        await loadFavorites();
      }
    } catch (error) {
      Alert.alert("Failed to delete favorite: " + error);
    }
  };

  const renderResult = ({ item }: { item: search }) => (
    <Pressable style={styles.searchResultTouchableContainer} onPress={() => loadWeatherData(item)}>
      <View style={styles.searchResultText}>
        <Text style={styles.searchResultCity}>{item.city}</Text>
        <Text style={styles.searchResultState}>{item.state} ({item.zip})</Text>
      </View>
    </Pressable>
  );

  const renderFavorite = ({ item }: { item: favorite }) => (
    <View style={styles.favoriteItem}>
      <View style={styles.favoriteItemTouchableContainer}>
        <Pressable onPress={() => loadWeatherData(item)}>
          <View style={styles.favoriteResultText}>
            <Text style={styles.favoriteResultCity}>{item.city}</Text>
            <Text style={styles.favoriteResultState}>{item.state} ({item.zip})</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.removeButtonContainer}>
        <Pressable onPress={() => removeFromFavorites(item)}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Button */}
      <Pressable style={styles.searchBar} onPress={openModal}>
        <View style={styles.searchContent}>
          <FontAwesome name="search" size={16} color="rgba(85, 85, 85, 0.33)"/>
          <Text style={styles.searchText}>Enter a Zip Code</Text>
        </View>
      </Pressable>
      {weatherData ? (
        <View style={styles.mainWindow}>
          <View style={styles.weatherContainer}>
            <Text style={styles.weatherTemp}>
              { isMetric ? weatherData.current.temp_f : weatherData.current.temp_c }{unit}
            </Text>
            <Text style={styles.weatherFeelTemp}>
              Feels like { isMetric ? weatherData.current.feelslike_f : weatherData.current.feelslike_c }{unit}
            </Text>
            <Text style={styles.weatherCityTitle}>
              {weatherData.location.name}
            </Text>
            <Text style={styles.weatherStateTitle}>
              {weatherData.location.region}
            </Text>
          </View>
          <View style={styles.weatherDetailsContainer}>
            { isFavorite ? (
              <Pressable>
                <FontAwesome name="heart" color="red" size={16} />
              </Pressable>
            ) : (
              <Pressable style={styles.addFavoriteBtn} onPress={() => addToFavorites(weatherData)}>
                <FontAwesome name="heart-o" color="red" size={16} />
                <Text style={styles.addFavorite}>Add Favorite</Text>
              </Pressable>
            ) }
          </View>
          <View style={styles.sunAndWind}>
            <View style={styles.sunRiseAndSunSet}>
              <View style={styles.sunRise}>
                <Text style={styles.sunRiseTitle}>Sunrise: </Text>
                <Text style={styles.sunRiseValue}>{weatherData.forecast.forecastday[0].astro.sunrise}</Text>
              </View>
              <View style={styles.sunSet}>
                <Text style={styles.sunSetTitle}>Sunset: </Text>
                <Text style={styles.sunSetValue}>{weatherData.forecast.forecastday[0].astro.sunset}</Text>
              </View>
            </View>
            <View style={styles.windSpeedAndDirection}>
              <Text style={styles.windTitle}>Wind: </Text>
              <Text style={styles.windSpeed}>
                { isMetric ? weatherData.current.wind_mph : weatherData.current.wind_kph }
              </Text>
              <Text style={styles.windSpeedUnit}>
                {windUnit}
              </Text>
              <Text style={styles.windDirection}>
                {weatherData.current.wind_dir}
              </Text>
            </View>
          </View>
          <View style={styles.threeDayForecast}>
            <Text style={styles.threeDayForecastTitle}>3 Day Forecast</Text>
            <View style={styles.threeDayForecaseCard}>
              <Text style={styles.threeDayForecastDate}>{formatDate(weatherData.forecast.forecastday[0].date)}</Text>
              <Image style={styles.threeDayForecastWeatherIcon} source={{ uri: "https:" + weatherData.forecast.forecastday[0].day.condition.icon }} />
              <Text style={styles.threeDayForecastTempHigh}>{ isMetric ? weatherData.forecast.forecastday[0].day.maxtemp_f : weatherData.forecast.forecastday[0].day.maxtemp_c}{unit}</Text>
              <Text style={styles.threeDayForecastTempLow}>{ isMetric ? weatherData.forecast.forecastday[0].day.mintemp_f : weatherData.forecast.forecastday[0].day.mintemp_c}{unit}</Text>
            </View>
            <View style={styles.threeDayForecaseCard}>
              <Text style={styles.threeDayForecastDate}>{formatDate(weatherData.forecast.forecastday[1].date)}</Text>
              <Image style={styles.threeDayForecastWeatherIcon} source={{ uri: "https:" + weatherData.forecast.forecastday[1].day.condition.icon }} />
              <Text style={styles.threeDayForecastTempHigh}>{ isMetric ? weatherData.forecast.forecastday[1].day.maxtemp_f : weatherData.forecast.forecastday[1].day.maxtemp_c}{unit}</Text>
              <Text style={styles.threeDayForecastTempLow}>{ isMetric ? weatherData.forecast.forecastday[1].day.mintemp_f : weatherData.forecast.forecastday[1].day.mintemp_c}{unit}</Text>
            </View>
            <View style={styles.threeDayForecaseCard}>
              <Text style={styles.threeDayForecastDate}>{formatDate(weatherData.forecast.forecastday[2].date)}</Text>
              <Image style={styles.threeDayForecastWeatherIcon} source={{ uri: "https:" + weatherData.forecast.forecastday[2].day.condition.icon }} />
              <Text style={styles.threeDayForecastTempHigh}>{ isMetric ? weatherData.forecast.forecastday[2].day.maxtemp_f : weatherData.forecast.forecastday[2].day.maxtemp_c}{unit}</Text>
              <Text style={styles.threeDayForecastTempLow}>{ isMetric ? weatherData.forecast.forecastday[2].day.mintemp_f : weatherData.forecast.forecastday[2].day.mintemp_c}{unit}</Text>
            </View>
          </View>
          <Pressable onPress={() => setIsMetric(!isMetric)}>
            <Text style={styles.switchMetricsText}>Switch to {isMetric ? 'Imperial' : 'Metric'}</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.promptText}>Click on the search bar to enter a zip code</Text>
      )}
      
      {/* Modal Dialog */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {/* Search Input */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBarContainer}>
              <FontAwesome name="search" size={16} color="rgba(85, 85, 85, 0.33)"/>
              <TextInput
                style={styles.zipCodeInput}
                placeholder="Enter a Zip Code"
                value={zipCode}
                onChangeText={handleZipCodeChange}
                keyboardType='default'
              />
              <Pressable onPress={closeModal}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
          {/* Search Results */}  
          <View style={styles.searchResultContainer}>
            <Text style={styles.searchResultTitle}>Search Results: </Text>
            {searchResultsloading ? (
              <ActivityIndicator size="large" color="#eee" />
            ) : searchErrorMessage ? (
              <Text style={styles.errorMessage}>{searchErrorMessage}</Text>
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderResult}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListHeaderComponent={() => <View style={styles.separator} />}
                ListFooterComponent={() => <View style={styles.separator} />}
              />
            ) : (
              <>
                <View style={styles.initialSeparator}>
                  <View style={styles.separator} />
                  <View style={styles.separator} />
                </View>
              </>
            ) }
          </View>
          {/* Favorites List */}
          <View style={styles.favoriteContainer}>
            <Text style={styles.favoriteTitle}>Favorites: </Text>
            {favoritesLoading ? (
              <ActivityIndicator size="large" color="#eee" />
            ) : favoriteErrorMessage ? (
              <Text style={styles.errorMessage}>{favoriteErrorMessage}</Text>
            ) : favorites ? (
              <FlatList
                data={favorites}
                renderItem={renderFavorite}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListFooterComponent={() => <View style={styles.separator} />}
              />
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 51,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: 30,
    width: '100%',
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    padding: 10,
    width: '60%',
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  searchText: {
    color: 'rgba(85, 85, 85, 0.33)',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    marginLeft: 15,
  },
  mainWindow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  weatherContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
    gap: 5,
  },
  weatherTemp: {
    color: '#0C0C0C',
    fontSize: 48,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  weatherFeelTemp: {
    color: '#0C0C0C',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  weatherCityTitle: {
    color: '#0C0C0C',
    fontSize: 32,
    fontStyle: 'normal',
    fontWeight: '400',
    marginTop: 10,
  },
  weatherStateTitle: {
    color: '#0C0C0C',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  weatherDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 10,
    marginTop: 30,
  },
  addFavoriteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 10,
  },
  addFavorite: {
    color: '#0a84ff',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  sunAndWind: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 10,
    marginTop: 20,
  },
  sunRiseAndSunSet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    backgroundColor: '#a7d3ff',
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  sunRise: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunSet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunRiseTitle: {
    color: '#555',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  sunRiseValue: {
    color: '#0C0C0C',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  sunSetTitle: {
    color: '#555',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  sunSetValue: {
    color: '#0C0C0C',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  windSpeedAndDirection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    backgroundColor: '#a7d3ff',
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  windTitle: {
    color: '#555',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  windSpeed: {
    color: '#0C0C0C',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  windSpeedUnit: {
    color: '#0C0C0C',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  windDirection: {
    color: '#0C0C0C',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  threeDayForecast: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 10,
    marginTop: 20,
  },
  threeDayForecastTitle: {
    color: '#0C0C0C',
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  threeDayForecaseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    backgroundColor: '#c3e1ff',
    padding: 10,
    gap: 30,
  },
  threeDayForecastDate: {
    color: '#0C0C0C',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  threeDayForecastTempHigh: {
    color: '#0C0C0C',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  threeDayForecastWeatherIcon: {
    width: 32,
    height: 32,
  },
  threeDayForecastTempLow: {
    color: '#777',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  switchMetricsText: {
    color: '#0a84ff',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    marginTop: 40,
  },
  promptText: {
    marginTop: 15,
    color: '#000',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  zipCodeInput: {
    width: '60%',
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  cancelText: {
    color: '#0a84ff',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    marginLeft: 125,
  },
  errorMessage: {
    color: 'gray',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    padding: 5,
    width: '70%',
    marginTop: 20,
    gap: 10,
  },
  searchResultTouchableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 5,
    paddingLeft: 10,
  },
  favoriteItemTouchableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  searchResultContainer: {
    marginTop: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
    gap: 10,
  },
  searchResultText: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  searchResultTitle: {
    color: '#0C0C0C',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  searchResultCity: {
    color: '#0C0C0C',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '700',
    width: '100%',
  },
  searchResultState: {
    color: '#AAA',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    width: '100%',
  },
  flatListContainer: {
    width: '100%',
  },
  initialSeparator: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 53,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    width: "100%",
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
  },
  favoriteTitle: {
    color: '#0C0C0C',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  favoriteResultText: {
    flex: 1,
  },
  favoriteResultCity: {
    color: '#0C0C0C',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '700',
  },
  favoriteResultState: {
    color: '#AAA',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  removeButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  removeButtonText: {
    color: '#0a84ff',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  favoriteContainer: { 
    marginTop: 60,
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    gap: 10,
  },
});
