import '../styles/Forecast.css';

export interface ForecastData {
    date: string;
    highTempFahrenheit: number;
    lowTempFahrenheit: number;
    highTempCelcius: number;
    lowTempCelcius: number;
    weatherIconURL: string; 
}

interface ForecastProps {
    forecastData: ForecastData[];
    isDataAvailable: boolean;
    isMetric?: boolean;
}

function formatDate(date : string) {
    const dateString = new Date(date);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return dateString.toLocaleDateString('en-US', options);
}

export function ForecastComponent({ forecastData, isDataAvailable = false, isMetric = true }: ForecastProps) {
    const tempUnit = isMetric ? "°F" : "°C";

    return (
        <>
            {isDataAvailable && (<div className="forecast-container">
                <div className="forecast-title">3 Day Forecast</div>
                <div className="forecast-cards">
                    {forecastData.map((forecast, index) => (
                        <div key={index} className="forecast-card">
                            <div className="forecast-date">{formatDate(forecast.date)}</div>
                            <div className="temp-container">
                                <div className="temp"><div className="temp-class">H:</div><div className="temp-value">{isMetric ? forecast.highTempCelcius : forecast.highTempFahrenheit}{tempUnit}</div></div>
                                <div className="temp"><div className="temp-class">L:</div><div className="temp-value">{isMetric ? forecast.lowTempCelcius : forecast.lowTempFahrenheit}{tempUnit}</div></div>
                            </div>
                            <img className="weather-icon" src={forecast.weatherIconURL} />
                        </div>
                    ))}
                </div>
            </div>)}
        </>
    );
}

