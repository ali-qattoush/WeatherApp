import axios from "axios";
const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

export const getCityInfo = (city,setWeatherData) => {
  axios
    .get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    )
    .then((response) => {
      const cityObject = response.data[0];
      const lat = cityObject.lat;
      const lon = cityObject.lon;

      getWeatherData(lat, lon, setWeatherData);
    })
    .catch((error) => {
      alert("Error fetching Longitude & Latidute :", error);
    });
};

export const getWeatherData = (lat, lon, setWeatherData) => {
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


    })
    .catch((error) => {
      alert("Error fetching weather :", error);
    });
};

export const getMyLocation = (setWeatherData) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      getWeatherData(lat, lon, setWeatherData);
    },
    (error) => {
      alert("Error getting own location :", error);
    }
  );
};


export const getMyLocation2 = async (setWeatherData) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      getWeatherData(lat, lon, setWeatherData);
    },
    (error) => {
      console.error("Error getting own location :", error);
    }
  );

}