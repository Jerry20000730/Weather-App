import "../styles/Weather.css";

export interface WeatherData {
    sunRise: string;
    sunSet: string;
    windSpeedMPH: number;
    windSpeedKPH: number;
    windDirection: string;
}

interface WeatherProps {
    weatherData: WeatherData;
    isMetric?: boolean;
    isDataAvailable: boolean;
}

export function WeatherComponent({ weatherData, isMetric = true, isDataAvailable }: WeatherProps) {
    const windUnit = isMetric ? "MPH" : "KPH";
    const windSpeed = isMetric ? weatherData.windSpeedMPH : weatherData.windSpeedKPH;

    return (
        <>
            <div className="weather-container">
                <div className="weather-card-sun">
                    <div className="weather-sun-line">
                        <div className="weather-sunrise-title">Sunrise:</div>
                        <div className="weather-sunrise-value">{isDataAvailable ? weatherData.sunRise : '-'}</div>
                    </div>
                    <div className="weather-sun-line">
                        <div className="weather-sunset-title">Sunset:</div>
                        <div className="weather-sunset-value">{isDataAvailable ? weatherData.sunSet : '-'}</div>
                    </div>
                </div>
                <div className="weather-card-wind">
                    <div className="weather-wind-title">Wind</div>
                    <div className="weather-wind-value">{isDataAvailable ? windSpeed : "-"}</div>
                    <div className="weather-wind-unit">{windUnit}</div>
                    <div className="weather-wind-direction">{isDataAvailable ? weatherData.windDirection : '-'}</div>
                </div>
            </div>
        </>
    );
}