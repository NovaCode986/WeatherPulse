import React, { useState, useEffect } from "react";
import styles from "./CurrentLocationWeather.module.css";

function CurrentLocationWeather() {
  const [weatherNow, setWeatherNow] = useState<any>(null);
  const [weatherCached, setWeatherCached] = useState<boolean>(false);

  useEffect(() => {
    let cachedWeather = localStorage.getItem("weatherData");
    const options = { method: "GET", headers: { accept: "application/json" } };

    if (!cachedWeather) {
      fetch( "http://api.weatherapi.com/v1/current.json?key=2332dfb52a52492ab80143318240709&q=Isle of Man&aqi=no", options )
        .then((response) => response.json())
        .then((response) => {
          console.log("Fetched weather data: ", response);
          setWeatherNow(response);
          localStorage.setItem("weatherData", JSON.stringify(response)); // Cache the data
          if(cachedWeather){
            setWeatherCached(true);
          }
        })
        .catch((err) => console.error(err));
    } else {
        let parsedWeather = JSON.parse(cachedWeather);
        setWeatherNow(parsedWeather);
        setWeatherCached(true);
    }
  }, []);

  function clearWeatherCache() {
    localStorage.removeItem("weatherData");
    setWeatherCached(false); // Reset cache flag
  }

  return (
    <div className={styles.currentWeatherContainer}>
      {weatherCached ? (
        <p className={styles.weatherCached}> Weather is cached <button onClick={clearWeatherCache}>Clear from cache</button> </p>
      ) : (
        <p>Weather not cached</p>
      )}
  
      {weatherNow ? (
        <p> Current temperature in {weatherNow.location.name}: {weatherNow.current.temp_c}°C </p>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
  
}

export default CurrentLocationWeather;