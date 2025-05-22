import { useState, useEffect } from "react";
import Styles from "./CurrentLocationWeatherForcast.module.scss";

function CurrentLocationWeatherForcast() {
  const apiUrl = `https://weatherpulse.azurewebsites.net/forecastweather`;
  const apiUrlDev = "http://localhost:5000/forecastweather";

  interface HoursObject {
    time: string;
    temp_c: number;
    temp_f: number;
  }

  interface DayForecast {
    dayName: string;
    dayHours: HoursObject[];
  }

  // --- State Variables ---
  // Fix: Change the type to DayForecast[]
  const [forecastData, setForecastData] = useState<DayForecast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Helper Function: Get Week Day Name ---
  function getWeekDay(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: "long" };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  }

  useEffect(() => {
    const fetchAndFormatWeather = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let cachedWeatherForcast = localStorage.getItem("cachedForcastData");
        let rawData: any;

        if (cachedWeatherForcast) {
          rawData = JSON.parse(cachedWeatherForcast);
          console.log("Using cached data.");
        } else {
          console.log("Fetching new weather data...");
          const response = await fetch(apiUrlDev, {
            method: "GET",
            headers: { accept: "application/json" },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          rawData = await response.json();
          localStorage.setItem("cachedForcastData", JSON.stringify(rawData));
        }

        // This array will hold your structured forecast data
        const processedForecast: DayForecast[] = [];

        rawData.forecast.forecastday.forEach((forecastDay: any) => {
          // Get the day name from the date string provided in the raw data
          // rawData.forecast.forecastday.date should be available for each day
          const dayName = getWeekDay(forecastDay.date);

          // Initialize the DayForecast object for the current day
          const currentDayForecast: DayForecast = {
            dayName: dayName,
            dayHours: [], // This will be populated with HoursObject
          };

          const currentHour = new Date().getHours(); // Get current hour for filtering

          forecastDay.hour.forEach((hour: any) => {
            const hourSplit = hour.time.split(" "); // e.g., ["2025-05-18","00:00"]
            const hours_minutes = hourSplit[1].split(":"); // e.g., ["01","00"]
            const hourInt = parseInt(hours_minutes[0]);

            const am_pm = hourInt >= 12 ? "pm" : "am";
            const formattedHour = String(hourInt % 12 || 12);

            const finalHourString = `${formattedHour}:00 ${am_pm}`;

            const hoursObject: HoursObject = {
              time: finalHourString,
              temp_c: hour.temp_c,
              temp_f: hour.temp_f,
            };

            // Logic to only show current and future hours for the first day
            // Otherwise, show all hours for subsequent days
            if (processedForecast.length === 0) { // This is the first day
              if (hourInt >= currentHour) {
                currentDayForecast.dayHours.push(hoursObject);
              }
            } else { // Subsequent days, show all hours
              currentDayForecast.dayHours.push(hoursObject);
            }
          });
          processedForecast.push(currentDayForecast); // Add the completed DayForecast to the array
        });

        // Update the state with the correctly structured data
        setForecastData(processedForecast);
      } catch (err: any) {
        console.error("Error fetching or formatting weather data:", err);
        setError(err.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFormatWeather();
  }, [apiUrlDev]); // Added apiUrlDev to dependency array in case it changes

  // --- Render Logic ---
  if (isLoading) {
    return <div className={Styles.forcastDiv}>Loading weather data...</div>;
  }

  if (error) {
    return (
      <div className={Styles.forcastDiv} style={{ color: "red" }}>
        Error: {error}
      </div>
    );
  }

  if (forecastData.length === 0) {
    return (
      <div className={Styles.forcastDiv}>No hourly weather data available.</div>
    );
  }

  return (
    <div className={Styles.forcastDiv}>
      <h2>Hourly temperature</h2>
      <div className={Styles.divDays}>
        {forecastData.map((dayForecast, dayIndex) => ( // Renamed 'day' to 'dayForecast' for clarity
          <div key={dayIndex} className={Styles.divDay}> {/* Use a div for the day container */}
            <h3>{dayForecast.dayName}</h3> {/* Display the day name */}
            <ul>
              {dayForecast.dayHours.map((hour, hourIndex) => (
                <li key={`${dayIndex}-${hourIndex}`}>
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
        ))}
      </div>
    </div>
  );
}

export default CurrentLocationWeatherForcast;