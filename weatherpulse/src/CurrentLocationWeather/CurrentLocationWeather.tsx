import React, { useState, useEffect } from "react";
import styles from "./CurrentLocationWeather.module.css";
<<<<<<< HEAD
=======
import partlyCloudyImage from "./partly_cloudy.webp";
import patchyRainImage from "./patchy_rain.webp";
import light_drizzle from "./light_drizzle.png";
>>>>>>> 8cbd697f2133b9c8bd6fbc78fe0bc86a3495f0d5
// https://www.iconfinder.com/icons/2990924/drizzle_mixed_patchy_rain_shower_weather_icon

function CurrentLocationWeather() {
  const apiUrl = `https://weatherpulse.azurewebsites.net/currentweather`;

  const [weatherNow, setWeatherNow] = useState<any>(null);
<<<<<<< HEAD
=======
  const [weatherIcon, setWeatherIcon] = useState("");
>>>>>>> 8cbd697f2133b9c8bd6fbc78fe0bc86a3495f0d5

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate();
    const year = date.getFullYear();
<<<<<<< HEAD
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

=======
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
>>>>>>> 8cbd697f2133b9c8bd6fbc78fe0bc86a3495f0d5
    const month = monthNames[date.getMonth()];

    let suffix = "th";
    if (day % 10 === 1 && day !== 11) {
      suffix = "st";
    } else if (day % 10 === 2 && day !== 12) {
      suffix = "nd";
    } else if (day % 10 === 3 && day !== 13) {
      suffix = "rd";
    }

    return `${day}${suffix} ${month} ${year}`;
  }
  
<<<<<<< HEAD
=======
  function setwWeatherIconFunction(condition: string) {
    console.log(condition);
    let icon = "";
    switch (condition) {
      case "Partly cloudy":
        icon = partlyCloudyImage;
        break;
      case "Patchy rain nearby":
        icon = patchyRainImage;
        break;
      case "Light drizzle":
        icon = light_drizzle;
        console.log("light_drizzle: ",light_drizzle)
        break;
      default:
        icon = "";
    }
    
    return icon;
  }
>>>>>>> 8cbd697f2133b9c8bd6fbc78fe0bc86a3495f0d5

  useEffect(() => {
    const options = {
      method: "GET",
      headers: { accept: "application/json" },
    };
    fetch(apiUrl, options)
      .then((response) => {
<<<<<<< HEAD
        return response.json(); // Return the JSON data here
      })
      .then((data) => {
        data.location.localtime = formatDate(data.location.localtime);
=======
        console.log("response: ", response);
        return response.json(); // Return the JSON data here
      })
      .then((data) => {
        console.log(data);
        data.location.localtime = formatDate(data.location.localtime);
        let weatherIcon = setwWeatherIconFunction(data.current.condition.text);
        setWeatherIcon(weatherIcon);
>>>>>>> 8cbd697f2133b9c8bd6fbc78fe0bc86a3495f0d5
        setWeatherNow(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className={styles.currentWeatherContainer}>
      {weatherNow ? (
        <>
          <h2>
            {weatherNow.location.name} {weatherNow.location.localtime}
          </h2>
<<<<<<< HEAD
            <div className={styles.weatherDiv}>
              <ul>
                <li className={styles.weatherDivData}>
                <p>Temperature C</p> <p>{weatherNow.current.temp_c}</p>
                </li>
                <li className={styles.weatherDivData}>
                <p>Temperature F</p> <p>{weatherNow.current.temp_f}</p>
                </li>
                <li className={styles.weatherDivData}>
                  <p>Condition </p> <p>{weatherNow.current.condition.text}</p>
=======
          <div className={styles.weatherDivOuter}>
            <div className={styles.weatherDiv}>
              <ul>
                <li className={styles.weatherDivData}>
                <p>Temperature C</p> <p>{weatherNow.current.temp_c}c</p>
                </li>
                <li className={styles.weatherDivData}>
                <p>Temperature F</p> <p>{weatherNow.current.temp_f}f</p>
                </li>
                <li className={styles.weatherDivData}>
                  <div>
                  <p>Condition </p> <p>{weatherNow.current.condition.text}<img src={weatherIcon}></img></p>
                  </div>
>>>>>>> 8cbd697f2133b9c8bd6fbc78fe0bc86a3495f0d5
                </li>
                <li className={styles.weatherDivData}>
                <p>Humidity</p> <p>{weatherNow.current.humidity}%</p>
                </li>
                <li className={styles.weatherDivData}>
                <p>Wind</p> <p>{weatherNow.current.wind_dir} - {weatherNow.current.wind_kph}kph</p>
                </li>
              </ul>
            </div>
<<<<<<< HEAD
=======
          </div>
>>>>>>> 8cbd697f2133b9c8bd6fbc78fe0bc86a3495f0d5
        </>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
}

export default CurrentLocationWeather;
