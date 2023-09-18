import { useState, useEffect } from "react";
import { getMyLocation, getCityInfo, getWeatherData } from "./ApiServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faCloud,
  faCloudShowersHeavy,
  faCloudRain,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "./spinner";
import "./App.css";
// VITE_OPENWEATHERMAP_API_KEY=226e18aeaff429f1b7b191984119b8d8

function WeatherApp() {
  const [cityName, setCity] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [tempVal, setTemp] = useState("metric");
  const [isLoading, setIsLoading] = useState(true);
  const [cityNameValue, setCityValue] = useState("");
  // Keeps track of the cityName for unit conversion to make a new API call with new unit.
  const [icon, setIcon] = useState("");
  const keysArray = Object.keys(weatherData);

  useEffect(() => {
    if (Object.keys(weatherData).length === 0) {
      getMyLocation().then(([lat, lon]) => {
        getWeatherData(lat, lon, tempVal)
          .then((data) => {
            const { city } = data;
            const { name } = city;

            setCityValue(name);
            setWeatherData((prevWeatherData) => ({
              ...prevWeatherData,
              ...createDataObject(data),
            }));
          })
          .finally(() => {
            setIsLoading(false);
          });
      });
    }
    return () => {};
  }, []);

  useEffect(() => {
    // Keeps the current weather icon updated whenever a change is induced.
    updateWeatherIcon();
  }, [weatherData]);

  const handleInputChange = (event) => {
    const isDropDown = event.target.tagName === "SELECT";
    setCityValue(event.target.value);
    setCity(event.target.value);
    if (isDropDown) {
      getCityInfo(event.target.value).then(([lat, lon]) => {
        getWeatherData(lat, lon, tempVal)
          .then((data) => {
            setWeatherData((prevWeatherData) => ({
              ...prevWeatherData,
              ...createDataObject(data, tempVal),
            }));
          })
          .finally(() => {
            setIsLoading(false);
          });
      });
    }
  };
  const updateWeatherIcon = () => {
    const newIcon = weatherIcon();
    setIcon(newIcon);
  };

  const createDataObject = (data, unit = "metric") => {
    try {
      const { list } = data;
      const [firstDataSet] = list;
      const { temp, weather, humidity: Humidity } = firstDataSet;
      const {
        day: Day,
        min: Min,
        max: Max,
        night: Night,
        eve: Evening,
        morn: Morning,
      } = temp;
      const temperatures = {
        Morning,
        Day,
        Evening,
        Night,
        Min,
        Max,
      };
      const [weatherObject] = weather;
      const { main: CurrentWeather } = weatherObject;

      const tempSign = unit === "metric" ? "°" : "°F";

      for (const key in temperatures) {
        temperatures[key] = temperatures[key] + tempSign;
      }

      const dataObject = {
        CurrentWeather,
        ...temperatures,
        Humidity,
      };

      return dataObject;
    } catch (error) {
      throw new Error("Error Creating Data Object");
    }
  };

  const tempChange = () => {
    const newTemp = tempVal === "metric" ? "imperial" : "metric";

    setTemp(newTemp);
    convertValues(newTemp);
  };

  const convertValues = (unit) => {
    getCityInfo(cityNameValue).then(([lat, lon]) => {
      getWeatherData(lat, lon, unit)
        .then((data) => {
          setWeatherData((prevWeatherData) => ({
            ...prevWeatherData,
            ...createDataObject(data, unit),
          }));
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  };

  const weatherIcon = () => {
    // TO render the current weather description icon
    const iconStyle = { fontSize: "10vw" };

    let icon;

    switch (weatherData.CurrentWeather) {
      case "Clear":
        icon = <FontAwesomeIcon icon={faSun} style={iconStyle} />;
        break;
      case "Clouds":
        icon = <FontAwesomeIcon icon={faCloud} style={iconStyle} />;
        break;
      case "Rain":
        icon = <FontAwesomeIcon icon={faCloudRain} style={iconStyle} />;
        break;
      case "Drizzle":
        icon = <FontAwesomeIcon icon={faCloudShowersHeavy} style={iconStyle} />;
        break;
      case "Thunderstorm":
        icon = <FontAwesomeIcon icon={faCloudShowersHeavy} style={iconStyle} />;
        break;
      case "Snow":
        icon = <FontAwesomeIcon icon={faCloudShowersHeavy} style={iconStyle} />;
        break;
      case "Mist":
        icon = <FontAwesomeIcon icon={faCloud} style={iconStyle} />;
        break;
      case "Fog":
        icon = <FontAwesomeIcon icon={faCloud} style={iconStyle} />;
        break;
      case "Haze":
        icon = <FontAwesomeIcon icon={faCloud} style={iconStyle} />;
        break;
      default:
        icon = <FontAwesomeIcon icon={faSun} style={iconStyle} />;
    }

    return icon;
  };

  const renderWeatherIcon = (key) => {
    // TO render the timeline icons
    let icon;
    switch (key) {
      case "Morning":
      case "Day":
        icon = <FontAwesomeIcon icon={faSun} style={{ fontSize: "24px" }} />;
        break;
      case "Evening":
        icon = <FontAwesomeIcon icon={faCloud} style={{ fontSize: "24px" }} />;
        break;
      case "Night":
        icon = <FontAwesomeIcon icon={faMoon} style={{ fontSize: "24px" }} />;
        break;
      default:
        icon = null;
    }
    return icon;
  };

  return (
    <div className="container">
      <div className="firstBar">
        <button
          className="currentLocation"
          onClick={() => {
            getMyLocation().then(([lat, lon]) => {
              getWeatherData(lat, lon, tempVal)
                .then((data) => {
                  const { city } = data;
                  const { name } = city;
                  setCityValue(name);

                  setWeatherData((prevWeatherData) => ({
                    ...prevWeatherData,
                    ...createDataObject(data, tempVal),
                  }));
                })
                .finally(() => {
                  setIsLoading(false);
                });
            });
          }}
        >
          Use Current Location
        </button>

        <div className="toggle">
          <input
            type="checkbox"
            id="toggle"
            checked={tempVal === "imperial" ? true : false}
            onChange={tempChange}
          />
          <label htmlFor="toggle" className="toggle-label">
            Toggle Fahrenheit
          </label>
        </div>

        <label htmlFor="dropdown"></label>
        <select id="dropdown" onChange={handleInputChange}>
          <option value="" disabled selected>
            Select an option :
          </option>
          <option value="dubai">Dubai</option>
          <option value="hawaii">Hawaii</option>
          <option value="london">London</option>
        </select>
      </div>

      <div className="secondBar">
        <input
          className="input"
          type="text"
          placeholder="Enter City Name"
          value={cityName}
          onChange={handleInputChange}
        />

        <button
          className="inputButton"
          onClick={() => {
            getCityInfo(cityName).then(([lat, lon]) => {
              getWeatherData(lat, lon, tempVal)
                .then((data) => {
                  setWeatherData((prevWeatherData) => ({
                    ...prevWeatherData,
                    ...createDataObject(data, tempVal),
                  }));
                })
                .finally(() => {
                  setIsLoading(false);
                });
            });
          }}
        >
          Submit
        </button>
      </div>
      <div className="thirdBar">
        {icon}
        {weatherData.CurrentWeather}
        <div className="minmax">
          <span
            style={{ marginRight: "12px" }}
          >{`Min: ${weatherData.Min}`}</span>
          <span
            style={{ marginRight: "12px" }}
          >{`Max: ${weatherData.Max}`}</span>
          {`Humidity: ${weatherData.Humidity}`}
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="fourthBar">
          {keysArray.slice(1, -3).map((key) => (
            <div key={key} className="weather-info">
              {renderWeatherIcon(key)}
              <span className="weather-text">{`${key} : ${weatherData[key]}`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
