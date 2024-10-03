import "../styles/Zipcode.css";
import { useEffect, useState } from 'react'

export interface CurTempData {
    tempFahrenheit: number;
    feelTempFahrenheit: number;
    tempCelcius: number;
    feelTempCelcius: number;
    location: string;
}

export function ZipCodeComponent({
    zipcode,
    onZipCodeChange,
    curTempData,
    isDataAvailable,
    isMetric,
} : {
    zipcode: string | undefined; 
    onZipCodeChange: (zipcode: string | undefined) => void;
    curTempData: CurTempData;
    isDataAvailable: boolean;
    isMetric: boolean;
}) {
    const tempUnit = isMetric ? "°F" : "°C";
    const feelTempValue = isMetric ? curTempData.feelTempFahrenheit : curTempData.feelTempCelcius;
    const tempValue = isMetric ? curTempData.tempFahrenheit : curTempData.tempCelcius;

    const [inputValue, setInputValue] = useState<string>(zipcode || "");

    useEffect(() => {
        setInputValue(zipcode || "");
    }, [zipcode]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleGetForecastBtnClick = () => {
        onZipCodeChange?.(inputValue);
    }

    return (
        <>
            <div className="zipcode-container">
                <div className="zipcode-title">Enter a Zip Code</div>
                <input id="zipcode" value={inputValue} onChange={handleInputChange} className="zipcode-input" type="text" />
                <button className="zipcode-button" onClick={handleGetForecastBtnClick} disabled={inputValue.trim() === ""}>Get Forecast</button>
                <div className="temperature">{isDataAvailable ? tempValue : "-"}{isDataAvailable ? tempUnit : ""}</div>
                <div className="feel-temperature">Feels like {isDataAvailable ? feelTempValue : "-"}{isDataAvailable ? tempUnit : ""}</div>
                <div className="location">{curTempData.location}</div>
            </div>
        </>
    );
}