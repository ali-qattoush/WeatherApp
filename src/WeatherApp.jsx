import { useState, useEffect } from "react";
import { getMyLocation, getCityInfo, getWeatherData } from "./ApiServices";
import Spinner from "./spinner";
import "./App.css";

function WeatherApp() {
  const [cityName, setCity] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [temp, setTemp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const keysArray = Object.keys(weatherData);

  useEffect(() => {
    getMyLocation().then(([lat, lon]) => {
      getWeatherData(lat, lon)
        .then((data) => {
          setWeatherData(createDataObject(data));
        })
        .finally(setIsLoading(false));
        // remove spinner when done loading
    });
    // it loads too fast so i added some delay

    return () => {};
  }, []);

  const handleInputChange = (event) => {
    const isDropDown = event.target.tagName === "SELECT";
    setCity(event.target.value);
    if (isDropDown) {
      setTemp(false);
      getCityInfo(event.target.value).then(([lat, lon]) => {
        getWeatherData(lat, lon)
          .then((data) => {
            setWeatherData(createDataObject(data));
          })
          .finally(setIsLoading(false));
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
        if (typeof value === "number" && key !== "humidity") {
          convertedWeather[key] = convertTemperature(value, toggleFahrenheit);
        }
      }
      return convertedWeather;
    });
  };

  const convertTemperature = (celsius, toggleFahrenheit) => {
    if (toggleFahrenheit) {
      return parseFloat(((celsius * 9) / 5 + 32).toFixed(1));
    } else {
      return parseFloat((((celsius - 32) * 5) / 9).toFixed(1));
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
          setTemp(false);
          getMyLocation().then(([lat, lon]) => {
            getWeatherData(lat, lon)
              .then((data) => {
                setWeatherData(createDataObject(data));
              })
              .finally(setIsLoading(false));
              
          });
        }}
      >
        Use Current Location
      </button>
      <button
        onClick={() => {
          setTemp(false);
          getCityInfo(cityName).then(([lat, lon]) => {
            getWeatherData(lat, lon)
              .then((data) => {
                setWeatherData(createDataObject(data));
              })
              .finally(setIsLoading(false));
          });
        }}
      >
        Submit
      </button>

      <label htmlFor="dropdown">Select an option:</label>
      <select id="dropdown" onChange={handleInputChange}>
        <option value="dubai">Dubai</option>
        <option value="hawaii">Hawaii</option>
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

      <input
        type="text"
        placeholder="Enter City Name"
        value={cityName}
        onChange={handleInputChange}
      />

      <br />
      {isLoading ? (
        <Spinner />
      ) : (
        keysArray.map((key) => (
          <div key={key}>
            <li>{key + " : " + weatherData[key]}</li>
          </div>
        ))
      )}
    </div>
  );
}

export default WeatherApp;
