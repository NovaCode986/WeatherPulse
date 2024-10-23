import React, { useState, useEffect } from "react";
import styles from "./CurrentLocationWeather.module.css";
import partlyCloudyImage from "./partly_cloudy.webp"
import patchyRainImage from "./patchy_rain.webp"
// https://www.iconfinder.com/icons/2990924/drizzle_mixed_patchy_rain_shower_weather_icon

function CurrentLocationWeather() {
  const apiUrl = `https://weatherpulse.azurewebsites.net/currentweather`;

  const [weatherNow, setWeatherNow] = useState<any>(null);

  function formatDate(dateString: string){
    const date = new Date(dateString)
    const day = date.getDate();
    const year = date.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month  = monthNames[date.getMonth()]

    let suffix = "th";
  if (day % 10 === 1 && day !== 11) {
    suffix = "st";
  } else if (day % 10 === 2 && day !== 12) {
    suffix = "nd";
  } else if (day % 10 === 3 && day !== 13) {
    suffix = "rd";
  }

  return `${day}${suffix} ${month} ${year}`
  }

  function setwWaetherIcon(condition : string){
    let icon = ""
      switch(condition){
        case "Partly cloudy":
          icon = partlyCloudyImage
          break;
        case "Patchy rain nearby":
          icon = patchyRainImage
          break;

      }
      return icon
  }

  useEffect(() => {
    const options = {
      method: "GET",
      headers: { accept: "application/json" },
    };
    fetch(apiUrl, options)
      .then((response) => {
        console.log("response: ", response);
        return response.json(); // Return the JSON data here
      })
      .then((data) => {
        console.log(data);
        data.location.localtime = formatDate(data.location.localtime)
        let weatherIcon = setwWaetherIcon(data.current.condition.text)
        setWeatherNow(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className={styles.currentWeatherContainer}>
      {weatherNow ? (
        <>
          <h2>{weatherNow.location.name} {weatherNow.location.localtime}</h2>
          <div className={styles.weatherDivOuter}>
            <div className={styles.weatherDiv}>
              <ul>
                <li> Temperature C</li>
                <li> Temperature F</li>
                <li> Condition</li>
                <li> Humidity</li>
                <li> Wind</li>
              </ul>
              <ul>
                <li className={styles.weatherDivData}>
                  {weatherNow.current.temp_c}c
                </li>
                <li className={styles.weatherDivData}>
                  {weatherNow.current.temp_f}f
                </li>
                <li className={styles.weatherDivData}>
                  <div>
                  <p>{weatherNow.current.condition.text}</p>
                  <img src={partlyCloudyImage}></img>
                  </div>
                </li>
                <li className={styles.weatherDivData}>
                  {weatherNow.current.humidity}%
                </li>
                <li className={styles.weatherDivData}>
                  {weatherNow.current.wind_dir} - {weatherNow.current.wind_kph}kph
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
