import React, { useState, useEffect } from "react";
import Styles from "./CurrentLocationWeatherForcast.module.scss";

function CurrentLocationWeatherForcast() {
  const serverHost = window.location.hostname;
  const apiUrl = `http://weatherpulse.azurewebsites.net:8080/forecastweather`;

  interface HoursObject {
    time: String;
    temp_c: Number;
    temp_f: Number;
  }
  let [nextHours, setNextHours] = useState<any[]>([]);

  useEffect(() => {
    let cachedWeatherForcast = localStorage.getItem("cachedWeatherForcastData");
    const options = {
      method: "GET",
      headers: { accept: "application/json" },
    };

    function updateForcast(cachedWeatherForcastData: any) {
      let updatedHours: HoursObject[] = [];

      for (
        let i = 0;
        i < cachedWeatherForcastData.forecast.forecastday[0].hour.length;
        i++
      ) {
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

    if (cachedWeatherForcast) {
      // Use the initially cached data
      let cachedWeatherForcastData = JSON.parse(cachedWeatherForcast);
      updateForcast(cachedWeatherForcastData);
    } else {
      console.log("Weather not cached");
      fetch(apiUrl, options)
        .then((response) => response.json())
        .then((response) => {
          // Cache the new data
          localStorage.setItem(
            "cachedWeatherForcastData",
            JSON.stringify(response)
          );

          // Fetch the newly cached data without calling localStorage.getItem again
          updateForcast(response);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    }
  }, []);

  return (
    <div className={Styles.hourDiv}>
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
    </div>
  );
}

export default CurrentLocationWeatherForcast;
