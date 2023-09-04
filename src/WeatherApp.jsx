import { useState, useEffect } from "react";
import { getMyLocation, getCityInfo, getWeatherData } from "./ApiServices";
import "./App.css";

function WeatherApp() {
  const [cityName, setCity] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const keysArray = Object.keys(weatherData);
  const [temp, setTemp] = useState(false);

  useEffect(() => {
    getMyLocation().then(([lat, lon]) => {
      getWeatherData(lat, lon).then((data) => {
        setWeatherData(createDataObject(data));
      });
    });

    return () => {};
  }, []);

  const handleInputChange = (event) => {
    const isDropDown = event.target.tagName === "SELECT";
    setCity(event.target.value);
    if (isDropDown) {
      getCityInfo(event.target.value).then(([lat, lon]) => {
        getWeatherData(lat, lon).then((data) => {
          setWeatherData(createDataObject(data));
        });
      });
    }
  };

  const tempChange = () => {
    setTemp(!temp);
    convertValues(!temp);
  };

  const convertValues = (toggleFahrenheit) => {
    setWeatherData((weather) => {
      const convertedWeather = { ...weather };
      for (const key in convertedWeather) {
        const value = convertedWeather[key];
        if (typeof value === "number") {
          convertedWeather[key] = convertTemperature(value, toggleFahrenheit);
        }
      }
      return convertedWeather;
    });
  };
  
  const convertTemperature = (celsius, toggleFahrenheit) => {
    if (toggleFahrenheit) {
      return (celsius * 9/5) + 32;
    } else {
      return ((celsius - 32) * 5/9);
    }
  };
  

  const createDataObject = (data) => {
    try {
      const { list } = data;
      const [firstDataSet] = list;
      const { temp, weather, humidity, feels_like } = firstDataSet;
      const [weatherObject] = weather;
      const { main: mainWeather, description } = weatherObject;
      
 

      const dataObject = {
        mainWeather,
        description,
        humidity,
        ...temp,
        ...feels_like,
      };

      return dataObject;
    } catch (error) {
      throw new Error("Error Creating Data Object");
    }
  };

  return (
    <div className="container">
      <button
        onClick={() => {
          getMyLocation().then(([lat, lon]) => {
            getWeatherData(lat, lon).then((data) => {
              setWeatherData(createDataObject(data));
            });
          });
        }}
      >
        Use Current Location
      </button>
      <button
        onClick={() => {
          getCityInfo(cityName).then(([lat, lon]) => {
            getWeatherData(lat, lon).then((data) => {
              setWeatherData(createDataObject(data));
            });
          });
        }}
      >
        Submit
      </button>

      <label htmlFor="dropdown">Select an option:</label>
      <select id="dropdown" onChange={handleInputChange}>
        <option value="dubai">Dubai</option>
        <option value="rome">Rome</option>
        <option value="london">London</option>
      </select>
      <p>Selected option: {cityName}</p>

      <div className="toggle">
        <input
          type="checkbox"
          id="toggle"
          checked={temp}
          onChange={tempChange}
        />
        <label htmlFor="toggle" className="toggle-label">
          Toggle Fahrenheit
        </label>
      </div>
      <p id="temperature">test</p>

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
