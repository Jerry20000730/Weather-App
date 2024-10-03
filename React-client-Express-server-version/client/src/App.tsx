import { useState, useEffect } from 'react'
import { ForecastComponent, ForecastData } from './components/Forecast'
import { WeatherData } from './components/Weather'
import './App.css'
import { ZipCodeComponent, CurTempData } from './components/Zipcode'
import { FavoriteComponent, Favorite } from './components/Favorite';
import { WeatherComponent } from './components/Weather';

function validateZipCode(zipCode: string | undefined) : boolean {
  const zipCodePattern = /^\d{5}(-\d{4})?$/;
  return zipCode ? zipCodePattern.test(zipCode) : true;
}

function extractForecastData(data: any) : ForecastData[] {
  const forecastDatas = data.forecast.forecastday.map((day: any) => {
      return {
          date: day.date,
          highTempFahrenheit: day.day.maxtemp_f,
          highTempCelcius: day.day.maxtemp_c,
          lowTempFahrenheit: day.day.mintemp_f,
          lowTempCelcius: day.day.mintemp_c,
          weatherIconURL: day.day.condition.icon
      }
  })
  return forecastDatas
}

function extractLocation(data: any) : string {
  return data.location.name + ", " + data.location.region;
}

function extractWeatherData(data: any) : WeatherData {
  const weatherData = {
      sunRise: data.forecast.forecastday[0].astro.sunrise,
      sunSet: data.forecast.forecastday[0].astro.sunset,
      windSpeedMPH: data.current.wind_mph,
      windSpeedKPH: data.current.wind_kph,
      windDirection: data.current.wind_dir
  };
  return weatherData;
}

function extractCurTempData(data: any) : CurTempData {
  const curTempData = {
      tempFahrenheit: data.current.temp_f,
      feelTempFahrenheit: data.current.feelslike_f,
      tempCelcius: data.current.temp_c,
      feelTempCelcius: data.current.feelslike_c,
      location: extractLocation(data)
  };
  return curTempData;
}

async function fetchWeatherData(zipCode: string) : Promise<any> {
  const rsp = await fetch("http://api.weatherapi.com/v1/forecast.json?key=65ef1295a13048b5ae4144239243008&q="+zipCode+"&days=3&aqi=no&alerts=no")
  if (!rsp.ok) {
      const data = await rsp.json();
      throw new Error('Weather API response was not 200, API error message: ' + data.error.message);
  }
  const data = await rsp.json();
  return data
}

async function loadFavorites() : Promise<Favorite[]> {
  const rsp = await fetch('http://localhost:4000/favorites');
  if (!rsp.ok) {
    const data = await rsp.json();
    throw new Error('Failed to load favorites: ' + data.error);
  }
  const data = await rsp.json();
  return data;
}

function App() {
  const [zipCode, setZipCode] = useState<string | undefined>("");
  const [location, setLocation] = useState<string | undefined>("");
  const [curTempData, setCurTempData] = useState<CurTempData>();
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [selectedFavorite, setSelectedFavorite] = useState<string>("");
  const [isDataAvailable, setIsDataAvailable] = useState<boolean>(false);
  const [isMetric, setIsMetric] = useState<boolean>(true);
  const [isAddDisabled, setIsAddDisabled] = useState<boolean>(true);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState<boolean>(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await loadFavorites();
        setFavorites(data);
      } catch (error) {
        alert("Failed to load favorites: " + error);
      }
    };
    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchWeatherDataForSelectedFavorite = async () => {
      if (selectedFavorite) {
        await handleZipCodeChanged(selectedFavorite);
      }
    }
    fetchWeatherDataForSelectedFavorite();
  }, [selectedFavorite]);

  const handleZipCodeChanged = async (zipCode: string | undefined) => {
      if (!validateZipCode(zipCode)) {
        alert("Invalid zip code");
        return;
      }
      try {
        const data = await fetchWeatherData(zipCode || "");
        setZipCode(zipCode);
        setLocation(extractLocation(data));
        setCurTempData(extractCurTempData(data));
        setWeatherData(extractWeatherData(data));
        setForecastData(extractForecastData(data));
        setIsDataAvailable(true);
        setIsMetric(true);
        setSelectedFavorite(zipCode || "");
        setIsAddDisabled(favorites.some(fav => fav.zip === zipCode));
        setIsDeleteDisabled(!favorites.some(fav => fav.zip === zipCode));
      } catch (error) {
        alert("Failed to fetch weather data: " + error);
      }
  };

  const handleAddFavorite = async () => {
    if (zipCode && location) {
      try {
        const rsp = await fetch('http://localhost:4000/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ zip: zipCode, location: location })
        });
        if (!rsp.ok) {
          const data = await rsp.json();
          alert("Failed to add favorite: " + data.error);
        } else {
            const data = await loadFavorites();
            setFavorites(data);
            setSelectedFavorite(zipCode);
            setIsAddDisabled(true);
            setIsDeleteDisabled(false);
        }
      } catch (error) {
        alert("Failed to add favorite: " + error);
      }
    }
  };

  const handleDeleteFavorite = async (zip: string) => {
    const fav = favorites.find(fav => fav.zip === zip);
    if (!fav) {
      alert("Favorite not found");
      return;
    }
    try {
      const rsp = await fetch(`http://localhost:4000/favorites/${fav.id}`, {
        method: 'DELETE',
      });

      if (!rsp.ok) {
        const data = await rsp.json();
        alert("Failed to delete favorite: " + data.error.message);
      } else {
        const updatedFavorites = await loadFavorites();
        setFavorites(updatedFavorites);
        handleSelectFavorite("");
      }
    } catch (error) {
      alert("Failed to delete favorite: " + error);
    }
  };

  const handleSwitchMetric = () => {
    setIsMetric(!isMetric);
  };

  const handleSelectFavorite = (zip: string) => {
    if (zip === "") {
      setZipCode("");
      setSelectedFavorite("");
      setCurTempData(undefined);
      setWeatherData(undefined);
      setIsAddDisabled(true);
      setIsDeleteDisabled(true);
      setIsDataAvailable(false);
    } else {
      setZipCode(zip);
      setSelectedFavorite(zip);
    }
  };

  return (
    <>
      <ZipCodeComponent zipcode={zipCode} curTempData={curTempData || { tempFahrenheit: 0, feelTempFahrenheit: 0, tempCelcius: 0, feelTempCelcius: 0, location: '' }} onZipCodeChange={handleZipCodeChanged} isDataAvailable={isDataAvailable} isMetric={isMetric}></ZipCodeComponent>
      <FavoriteComponent isAddDisabled={isAddDisabled} isDeleteDisabled={isDeleteDisabled} favorites={favorites} selectedFavorite={selectedFavorite} onAddFavorite={handleAddFavorite} onDeleteFavorite={handleDeleteFavorite} onSelectFavorite={handleSelectFavorite}></FavoriteComponent>
      <button className="switch-metric" onClick={handleSwitchMetric} disabled={!isDataAvailable}>Switch to Metric</button>
      <WeatherComponent weatherData={weatherData || { sunRise: '', sunSet: '', windSpeedMPH: 0, windSpeedKPH: 0, windDirection: '' }} isDataAvailable={isDataAvailable} isMetric={isMetric}></WeatherComponent>
      <ForecastComponent forecastData={forecastData} isDataAvailable={isDataAvailable} isMetric={isMetric}></ForecastComponent>
    </>
  )
}

export default App
