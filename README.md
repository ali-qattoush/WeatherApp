# Weather App made with React + Vite

Description:

In this project, you will create a simple weather application that allows users to check the current weather conditions of a specific location. You will use functional components in React to fetch data from a weather API and display it to the user.

Features:

1. Location Input: Provide an input field where users can enter the name of a city or a location.

2. Fetch Weather Data: When the user submits the location, use a weather API (such as OpenWeatherMap) to fetch the current weather data for that location.

3. Display Weather: Display the fetched weather information, including temperature, weather conditions, humidity, and any other relevant data.

4. Error Handling: Implement error handling in case the API request fails or the entered location is not found.

5. Styling: Style the application using CSS or a CSS-in-JS library to make it visually appealing.

Implementation Guidelines:

- Set up a new React project using Create React App or your preferred method.

- Create a functional component called WeatherApp that represents the main application.

- Implement a state hook to manage the user's entered location and the fetched weather data.

- Use the axios library to make a GET request to the weather API.

- Update the state with the fetched weather data and handle any errors that may occur during the API request.

- Render the location input field, the weather information, and any error messages in the WeatherApp component.

- Style the application using CSS or a styling library of your choice to make it visually appealing and user-friendly.

Bonus Challenges:

1. Add a dropdown menu with predefined locations for users to choose from.

2. Display weather icons corresponding to the current weather conditions (e.g., a sun icon for clear skies).

3. Provide a toggle for switching between Celsius and Fahrenheit temperature units.

4. Implement a loading spinner while the API request is in progress.