import React, {useEffect, useState} from 'react';
import './App.css';

function App() {
  const [weatherNow, setWeatherNow] = useState<any>(null);
  const [weatherCached, setWeatherCached] = useState<any>(null)
  useEffect(() => {
    const cachedWeather = localStorage.getItem('weatherData');
    const options = {method: 'GET', headers: {accept: 'application/json'}};
    if(!cachedWeather){
      fetch('http://api.weatherapi.com/v1/search.json?key=2332dfb52a52492ab80143318240709&q=Isle of Man&aqi=no', options)
      .then(response => response.json())
      .then((response) => {
        console.log(response)
        setWeatherNow(response)
        localStorage.setItem('weatherData', JSON.stringify(response));
      })
      .catch(err => console.error(err));
    }else{
      setWeatherCached("Weather is cached")
      setWeatherNow(JSON.parse(cachedWeather))
    }
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Cinepulse</h1>
        {weatherCached == "Weather is cached" ? (<p>Weather is cached</p>): (<p>Weather not cached</p>)}
        {weatherNow ? 
        ( <p>Current temperature in {weatherNow.location.name}: {weatherNow.current.temp_c}°C</p> ) : 
        ( <p>Loading weather...</p> )}
      </header>
    </div>
  );
}

export default App;