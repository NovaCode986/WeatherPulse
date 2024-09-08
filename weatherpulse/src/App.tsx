import React, {useEffect, useState} from 'react';
import './App.css';
import CurrentLocationWeather from './CurrentLocationWeather/CurrentLocationWeather';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Weatherpulse</h1>
        <CurrentLocationWeather/>
      </header>
    </div>
  );
}

export default App;