import React, { useState, useEffect } from "react";
import styles from "./CurrentLocationWeather.module.css";

function CurrentLocationWeather() {
  const serverHost = window.location.hostname;
  const apiUrl = `https://weatherpulse.azurewebsites.net/currentweather`;

  const [weatherNow, setWeatherNow] = useState<any>(null);
  useEffect(() => {
    let cachedWeather = localStorage.getItem("weatherData");
    console.log(cachedWeather)
    const options = {
      method: "GET",
      headers: { accept: "application/json" },
    };
    if (!cachedWeather || typeof cachedWeather == undefined) {
      fetch(apiUrl, options)
        .then((response) => {
          console.log("response: ", response);
          return response.json(); // Return the JSON data here
        })
        .then((data) => {
          console.log(data);
          setWeatherNow(data);
          localStorage.setItem("weatherData", JSON.stringify(data)); // Cache the data
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
