import { useState, useEffect } from "react";
import {
  getMyLocation,
  getCityInfo,
} from "./ApiServices"; 
import "./App.css";

function WeatherApp() {
  const [cityName, setCity] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const keysArray = Object.keys(weatherData);

  useEffect(() => {

    getMyLocation(setWeatherData); 

    return () => {
      setCity("");
      setWeatherData({});
    };
  }, []);

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  return (
    <div className="container">
      <button onClick={() => getMyLocation(setWeatherData)}>
        Use Current Location
      </button>
      <button onClick={() => getCityInfo(cityName, setWeatherData)}>Submit</button>

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
