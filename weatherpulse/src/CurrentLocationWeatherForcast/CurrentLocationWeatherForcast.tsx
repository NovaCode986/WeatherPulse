import { useState, useEffect } from "react";
import Styles from "./CurrentLocationWeatherForcast.module.scss";

function CurrentLocationWeatherForcast() {
  const apiUrl = `https://weatherpulse.azurewebsites.net/forecastweather`;

  //what will be displayed to the user, stored as an object
  interface HoursObject {
    time: String;
    temp_c: Number;
    temp_f: Number;
  }

  //array to store list of above objects
  let [todayForcastArray, setTodayForcastArray] = useState<any[]>([]);

  useEffect(() => {
    //preemptively fetch the cached weather data, whether or not it exists
    let cachedWeatherForcast = localStorage.getItem("cachedForcastData");
    //set up weather API get request config
    const options = {
      method: "GET",
      headers: { accept: "application/json" },
    };

    //reworks the raw data fetched from the weather API
    function formatForcastData(cachedForcastData: any) {
      //array to temporarily store reworked API data
      let formattedHoursArray: HoursObject[] = [];

      for ( let i = 0; i < cachedForcastData.forecast.forecastday[0].hour.length; i++ ) {
        //
        let hour = cachedForcastData.forecast.forecastday[0].hour[i]; //raw API hour object

        let hourSplit = hour.time.split(" "); //["2025-05-18","00:00"]
        let hours_minutes = hourSplit[1].split(":"); //["01","00"]
        let hours = hours_minutes[0].split(""); //["0","1"]
        const currentHour = new Date().getHours(); //11
        let formattedHour = "";//stores reworked hour time value
        if (hours[0] == 0) { //if the hour starts with a zero, such as 01, extract the leading number
          formattedHour = hours[1];
        } else {
          formattedHour = `${hours[0]}${hours[1]}`; //if not, convert back to a sting, such as "10"
        }
        let am_pm = "";//stores the am/pm text
        if (parseInt(hourSplit[1].replace(":", "")) >= 1200) {//is 0100 greater than or equal to 1200 (12:00pm)
          am_pm = "pm";
        } else {
          am_pm = "am";
        }

        let finalHourString = `${formattedHour}:00 ${am_pm}`;//store the custom time string, such as "11:00 am"
        //create and populate the final weather data object
        let hoursObject: HoursObject = {
          time: finalHourString,
          temp_c: hour.temp_c,
          temp_f: hour.temp_f,
        };
        //only add to formattedHoursArray weather data objects that are equal to or greater than the current hour
        if (parseInt(formattedHour) >= currentHour) {
          formattedHoursArray.push(hoursObject);
        }
      }
      setTodayForcastArray(formattedHoursArray);//copy the temporary weather data object array to the main array
    }

    //if there is currently cached weather data
    if (cachedWeatherForcast) {
      let cachedForcastData = JSON.parse(cachedWeatherForcast);
      //call the function to format the data
      formatForcastData(cachedForcastData);
    } else {
      console.log("Weather not cached");
      //fetch new data from back end API
      fetch(apiUrl, options)
        .then((response) => response.json())
        .then((response) => {
          // Cache the new data
          localStorage.setItem("cachedForcastData", JSON.stringify(response));

          // Fetch the newly cached data without calling localStorage.getItem again
          formatForcastData(response);
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
        {todayForcastArray.map((hour, index) => (
          <li key={index}>
            <div>
              <p>{hour.time}</p>
            </div>
            <div className={Styles.tempDiv}>
              <p>C {hour.temp_c}</p>
              <p>F {hour.temp_f}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CurrentLocationWeatherForcast;
