import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import fetch from 'node-fetch';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
const apiKey = process.env.WEATHERPULSE_API_KEY;

const corsOptions = {
  origin: '*', // or '*' during development
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));


app.get('/currentweather', (req, res) => {
  const options = {
    method: "GET",
    headers: { accept: "application/json" },
  };

  fetch(
    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Isle of Man&aqi=no`,
    options
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      res.json(data); // Send data to client
    })
    .catch((err) => {
      console.error('Fetch error:', err);
      res.status(500).json({ error: 'Failed to fetch weather data' });
    });
});

app.get('/forecastweather', (req, res) => {
  const options = {
    method: "GET",
    headers: { accept: "application/json" },
  };

  fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=Isle%20of%20Man&days=3&aqi=no&alerts=no`,
    options
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      res.json(data); // Send data to client
    })
    .catch((err) => {
      console.error('Fetch error:', err);
      res.status(500).json({ error: 'Failed to fetch weather data' });
    });
})


// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.send("Hello from the back end!")
  //res.sendFile(path.join(__dirname, '../weatherpulse/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
