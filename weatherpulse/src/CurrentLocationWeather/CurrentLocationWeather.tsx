import React, { useState, useEffect } from "react";
import styles from "./CurrentLocationWeather.module.css";

function CurrentLocationWeather() {
  const [weatherNow, setWeatherNow] = useState<any>(null);
  useEffect(() => {
    let cachedWeather = localStorage.getItem("weatherData");
    const options = { method: "GET", headers: { accept: "application/json" } };

    if (!cachedWeather) {
      fetch(
        "http://api.weatherapi.com/v1/current.json?key=2332dfb52a52492ab80143318240709&q=Isle of Man&aqi=no",
        options
      )
        .then((response) => response.json())
        .then((response) => {
          setWeatherNow(response);
          localStorage.setItem("weatherData", JSON.stringify(response)); // Cache the data
        })
        .catch((err) => console.error(err));
    } else {
      let parsedWeather = JSON.parse(cachedWeather);
      setWeatherNow(parsedWeather);
    }
  }, []);

  return (
    <div className={styles.currentWeatherContainer}>
      {weatherNow ? (
        <>
          <h2>{weatherNow.location.name}</h2>
          <h3>Today {weatherNow.location.localtime}</h3>
          <div className={styles.weatherDivOuter}>
            <div className={styles.weatherDiv}>
              <ul>
                <li> Temperature C</li>
                <li> Temperature F</li>
                <li> Sky</li>
                <li> Humidity</li>
              </ul>
              <ul>
                <li className={styles.weatherDivData}>
                  {weatherNow.current.temp_c}c
                </li>
                <li className={styles.weatherDivData}>
                  {weatherNow.current.temp_f}f
                </li>
                <li className={styles.weatherDivData}>
                  {weatherNow.current.condition.text}{" "}
                </li>
                <li className={styles.weatherDivData}>
                  {weatherNow.current.humidity}%
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
}

export default CurrentLocationWeather;
