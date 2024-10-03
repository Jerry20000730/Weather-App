# HTML Version

## Aim

Create an HTML page with JavaScript to dynamically display the current weather conditions
- Allow input of a zip code to select location
- Call the weather API to get the current weather conditions
- Display the weather conditions/forecast for the zip code entered
- Show current temperature
- Upcoming 3 day forecast (limit of the free plan)
- Switch between Fahrenheit and Celsius

## Goals

- Proper function of input field and button to submit zip code
- Correct call to the weather API for a zip code
    - Use the `fetch()` API to retrieve the weather data for the given zip code
- Display of current temperature and 3 day forecast from the API data
- Switching between Fahrenheit and Celsius
- Error checking and handling errors - user input, API calls

## Weather API and register

1. The weather API you will use: [WeatherAPI.com](http://weatherapi.com/)

2. Register to get a free trial API key

3. Try the API: [https://www.weatherapi.com/api-explorer.aspx](https://www.weatherapi.com/api-explorer.aspx)

## Initial Screen format

- When the page is first loaded, there is no Weather data, so the data areas are blank or have dashes (-)
- When no weather data is available, the "Switch to Celsius" button should be disabled. It should be enabled (clickable) when the weather data is loaded.

<img src="https://files.catbox.moe/lhc5fh.png" alt="initial setup" width="200"/>

## After loading a zip code

- When a user inputs a valid zip code and presses the "Get Forecast" button, the current temp and forecast details for this zip code are retrieved via the weather API.

<img src="https://files.catbox.moe/1m7qhe.png" alt="after loading a zip code" width="200"/>

## Invalid status check
If an invalid zip code is entered, or the API call fails for any reason, an alert pop up should be displayed informing the user.

<img src="https://files.catbox.moe/huoi1d.png" alt="error handling" width="200"/>

## Fahrenheit <-> Celcius

- When the "Switch to Celsius" button is clicked, the weather data should update to Celsius temperatures.  The button will now say "Switch to Fahrenheit".  
- If it's clicked again, the Fahrenheit temperatures will be displayed and button will revert back to "Switch to Celsius".
- You should use the degree symbol and the units F (Fahrenheit) or C (Celsius) when displaying temperature.

<img src="https://files.catbox.moe/t6bzdt.png" alt="change to celcius" width="200"/>
