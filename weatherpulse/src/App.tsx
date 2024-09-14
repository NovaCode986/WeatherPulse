import React, {useEffect, useState} from 'react';
import './App.scss';
import CurrentLocationWeather from './CurrentLocationWeather/CurrentLocationWeather';
import CurrentLocationWeatherForcast from './CurrentLocationWeatherForcast/CurrentLocationWeatherForcast';

function App() {

  useEffect(()=>{
    const appElement = document.querySelector(".App");

    const handleMobileWidth = () =>{
      if(window.innerWidth <= 850){
        appElement?.classList.remove("App")
      }else{
        appElement?.classList.add("App")
      }
    }

    window.addEventListener("resize", handleMobileWidth);
    window.onload = handleMobileWidth;

    return () => window.removeEventListener("resize", handleMobileWidth);
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weatherpulse</h1>
      </header>
      <CurrentLocationWeather/>
      <CurrentLocationWeatherForcast/>
      <footer>
        <p>FOOTER</p>
      </footer>
    </div>
  );
}

export default App;