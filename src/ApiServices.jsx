import axios from "axios";
const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

export const getCityInfo = (city) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
      )
      .then((response) => {
        if (response.data.length > 0) {
          const cityObject = response.data[0];
          const latLon = [cityObject.lat, cityObject.lon];

          resolve(latLon);
        } else if (response.data.length === 0) {
          reject(new Error("City not found"));
        }
      
      })
      .catch((error) => {
        reject(error);
      })
  });
};

export const getWeatherData = (lat, lon, unit = "metric") => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`
      )
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

export const getMyLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
  
      resolve([lat, lon]);
    }),
      (error) => {
        reject(error); 
      };
  });
};
