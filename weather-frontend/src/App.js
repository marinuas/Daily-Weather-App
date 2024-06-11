import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';
import sunImage from './sun.png'; // Make sure you have a sun.png in your src directory

const App = () => {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    try {
      const response = await axios.get('http://localhost:3000/weather', {
        params: { location, start_date: startDate, end_date: endDate }
      });
      console.log('API response:', response.data);
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching weather data', error);
      setError(`Error fetching weather data: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  const formatTime = (datetime) => {
    const date = new Date(datetime);
    return date.toUTCString().split(' ')[4].substring(0, 5); 
  };

  const hasWeatherData = weatherData && weatherData.daily && weatherData.daily.time && weatherData.daily.temperature_2m_max && weatherData.daily.temperature_2m_min && weatherData.daily.sunrise && weatherData.daily.sunset;

  return (
    <div className="container">
      <h1>
        Daily Weather App <img src={sunImage} alt="Sun" className="sun-icon" />
      </h1>
      <div className="form-group">
        <label>Location: </label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Start Date: </label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div className="form-group">
        <label>End Date: </label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <button onClick={fetchWeather}>Fetch Weather</button>
      {error && <p className="error">{error}</p>}
      {hasWeatherData ? (
        <div>
          <h2>Weather Data</h2>
          <div className="chart-container">
            <Line
              data={{
                labels: weatherData.daily.time,
                datasets: [{
                  label: 'Max Temperature (°C)',
                  data: weatherData.daily.temperature_2m_max,
                  fill: false,
                  borderColor: 'rgb(255, 99, 132)',
                  tension: 0.1
                },
                {
                  label: 'Min Temperature (°C)',
                  data: weatherData.daily.temperature_2m_min,
                  fill: false,
                  borderColor: 'rgb(54, 162, 235)',
                  tension: 0.1
                }]
              }}
            />
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Max Temperature (°C)</th>
                  <th>Min Temperature (°C)</th>
                  <th>Sunrise (UTC +0)</th>
                  <th>Sunset (UTC +0)</th>
                </tr>
              </thead>
              <tbody>
                {weatherData.daily.time.map((time, index) => (
                  <tr key={index}>
                    <td>{time}</td>
                    <td>{weatherData.daily.temperature_2m_max[index]}</td>
                    <td>{weatherData.daily.temperature_2m_min[index]}</td>
                    <td>{formatTime(weatherData.daily.sunrise[index])}</td>
                    <td>{formatTime(weatherData.daily.sunset[index])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        weatherData && <p>No weather data available for the selected period.</p>
      )}
    </div>
  );
};

export default App;
