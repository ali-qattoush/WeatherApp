import { useState } from "react";
import axios from "axios";
import "./App.css";

const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

// "api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid=226e18aeaff429f1b7b191984119b8d8"
// "http://api.openweathermap.org/geo/1.0/direct?q={city name}&limit={limit}&appid=226e18aeaff429f1b7b191984119b8d8"
// api key : 226e18aeaff429f1b7b191984119b8d8
// 31.728138718617352, 35.13578183078738

function WeatherApp() {
  const [cityName, setCity] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const keysArray = Object.keys(weatherData);

  function getCityInfo(city) {
    axios
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
      )
      .then((response) => {
        const cityObject = response.data[0];
        const lat = cityObject.lat;
        const lon = cityObject.lon;

        getWeatherData(lat, lon);
      })
      .catch((error) => {
        console.error("Error fetching Longitude & Latidute :", error);
      });
  }

  function getWeatherData(lat, lon) {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      )
      .then((response) => {
        const { list } = response.data;
        const [firstDataSet] = list;
        const { temp, weather, humidity, feels_like } = firstDataSet;
        const [weatherObject] = weather;
        const { main: mainWeather, description } = weatherObject;

        setWeatherData({
          mainWeather,
          description,
          humidity,
          ...temp,
          ...feels_like,
        });

        console.log("full data : ", response.data);
        console.log("Weather Data State :", weatherData);
      })
      .catch((error) => {
        console.error("Error fetching weather :", error);
      });
  }

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  function getMyLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        getWeatherData(lat, lon);
      },
      (error) => {
        console.error("Error getting own location :", error);
      }
    );
  }

  return (
    <div className="container">
      <button onClick={() => getMyLocation()}>Use Current Location</button>
      <button onClick={() => getCityInfo(cityName)}>Submit</button>
      <input
        type="text"
        placeholder="Enter City Name"
        value={cityName}
        onChange={handleInputChange}
      />

      <br />

      {keysArray.map((key) => (
        <div key={key}>
          <li>{key + " : " + weatherData[key]}</li>
        </div>
      ))}
    </div>
  );
}

export default WeatherApp;
