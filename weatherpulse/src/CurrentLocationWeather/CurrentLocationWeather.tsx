import React, { useState, useEffect } from "react";
import styles from "./CurrentLocationWeather.module.css";
// https://www.iconfinder.com/icons/2990924/drizzle_mixed_patchy_rain_shower_weather_icon

function CurrentLocationWeather() {
  const apiUrl = `https://weatherpulse-bcgubdb6gudtg9bt.ukwest-01.azurewebsites.net/currentweather`;

  const [weatherNow, setWeatherNow] = useState<any>(null);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate();
    const year = date.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
  

  useEffect(() => {
    const options = {
      method: "GET",
      headers: { accept: "application/json" },
    };
    fetch(apiUrl, options)
      .then((response) => {
        return response.json(); // Return the JSON data here
      })
      .then((data) => {
        data.location.localtime = formatDate(data.location.localtime);
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
                </li>
                <li className={styles.weatherDivData}>
                <p>Humidity</p> <p>{weatherNow.current.humidity}%</p>
                </li>
                <li className={styles.weatherDivData}>
                <p>Wind</p> <p>{weatherNow.current.wind_dir} - {weatherNow.current.wind_kph}kph</p>
                </li>
              </ul>
            </div>
        </>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
}

export default CurrentLocationWeather;
