import React, { useState } from 'react'
import './Weather.css'

const api = {
  key: "25df6fc6157202fa19e5561c3505e9db",
  base: "https://api.openweathermap.org/data/2.5/"
}

const Weather = () => {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]); // store 5-day forecast

  const search = evt => {
    if (evt.key === "Enter") {
      // fetch current weather
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
          console.log("Current weather:", result);
        });

      // fetch 5-day forecast
      fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          // pick one forecast per day (12:00 time)
          const daily = result.list.filter(item => item.dt_txt.includes("12:00:00"));
          setForecast(daily);
          console.log("Forecast:", daily);
        });
    }
  }

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  }

  return (
    <div className={(typeof weather.main != "undefined") ? ((weather.main.temp > 16) ? 'app warm' : 'app') : 'app'}>
      <main>
        <div className='search-box'>
          <input type='text'
            className='search-bar'
            placeholder='Search...'
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyPress={search} />
        </div>

        {(typeof weather.main != "undefined") ? (
          <div>
            <div className='location-box'>
              <div className='location'>
                {weather.name}, {weather.sys.country}
              </div>
              <div className='date'>
                {dateBuilder(new Date())}
              </div>
            </div>

            <div className="weather-box">
              <div className="temp">
                {Math.round(weather.main.temp)}°c
              </div>
              <div className="weather">
                {weather.weather[0].main}
              </div>
              <div className="humidity">
                Humidity: {weather.main.humidity}%
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="forecast-box">
              <h3>5-Day Forecast</h3>
              <div className="forecast-list">
                {forecast.map((day, index) => (
                  <div key={index} className="forecast-card">
                    <p className="forecast-day">
                      {new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'long' })}
                    </p>
                    <p className="forecast-temp">{Math.round(day.main.temp)}°c</p>
                    <p className="forecast-weather">{day.weather[0].main}</p>
                    <p className="forecast-humidity">💧 {day.main.humidity}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (' ')}
      </main>
    </div>
  );
};

export default Weather;
