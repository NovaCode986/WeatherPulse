import React, { useState, useEffect } from "react";
import Styles from "./CurrentLocationWeatherForcast.module.scss";

function CurrentLocationWeatherForcast() {
  const serverHost = window.location.hostname;
  const apiUrl = `https://weatherpulse.azurewebsites.net/forecastweather`;

  interface HoursObject {
    time: String;
    temp_c: Number;
    temp_f: Number;
  }
  let [nextHours, setNextHours] = useState<any[]>([]);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: { accept: "application/json" },
    };

    function updateForcast(cachedWeatherForcastData: any) {
      let updatedHours: HoursObject[] = [];

      for ( let i = 0; i < cachedWeatherForcastData.forecast.forecastday[0].hour.length; i++ ) {
        let hour = cachedWeatherForcastData.forecast.forecastday[0].hour[i];
        let hourSplit = hour.time.split(" ");
        if (parseInt(hourSplit[1].replace(":", "")) >= 1200) {
          hourSplit[1] = hourSplit[1].concat(" pm");
        } else {
          hourSplit[1] = hourSplit[1].concat(" am");
        }
        let hoursObject: HoursObject = {
          time: hourSplit[1],
          temp_c: hour.temp_c,
          temp_f: hour.temp_f,
        };
        updatedHours.push(hoursObject);
      }
      setNextHours(updatedHours);
    }
    fetch(apiUrl, options)
      .then((response) => response.json())
      .then((response) => {
        updateForcast(response);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  }, []);

  return (
    <div className={Styles.hourDiv}>
    {nextHours[0] ? (
      <>
      <h2>Hourly temperature</h2>
      <ul>
        {nextHours.map((hour, index) => (
          <li key={index}>
            <div>
              <p>{hour.time}</p>
            </div>
            <div className={Styles.tempDiv}>
              <span>C {hour.temp_c} </span>
              <span>F {hour.temp_f}</span>
            </div>
          </li>
        ))}
      </ul>
      </>
    ):(
      <h2>Loading forcast...</h2>
    )}
    </div>
  );
}

export default CurrentLocationWeatherForcast;
