const apiKey = '9318468eb5abab0a2725579762e7c043';

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');

searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const city = cityInput.value;
  getWeatherData(city);
});

function getWeatherData(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      addToSearchHistory(city);
    })
    .catch(error => {
      console.error('Error:', error);
    });

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      displayForecast(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function displayCurrentWeather(data) {
  const weather = data.weather[0];
  const temperature = data.main.temp;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

  currentWeather.innerHTML = `
    <div class="weather-card">
      <h3>${data.name}</h3>
      <p>Date: ${getCurrentDate()}</p>
      <img src="https://openweathermap.org/img/w/${weather.icon}.png" alt="${weather.description}">
      <p>Temperature: ${kelvinToCelsius(temperature)}°C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
    </div>
  `;
}

function displayForecast(data) {
  const forecastData = data.list;

  let forecastHTML = '';
  for (let i = 0; i < forecastData.length; i += 8) {
    const weather = forecastData[i].weather[0];
    const temperature = forecastData[i].main.temp;
    const humidity = forecastData[i].main.humidity;
    const windSpeed = forecastData[i].wind.speed;
    const date = formatDate(forecastData[i].dt);

    forecastHTML += `
      <div class="weather-card">
        <h3>${date}</h3>
        <img src="https://openweathermap.org/img/w/${weather.icon}.png" alt="${weather.description}">
        <p>Temperature: ${kelvinToCelsius(temperature)}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      </div>
    `;
  }

  forecast.innerHTML = forecastHTML;
}

function addToSearchHistory(city) {
  const searchEntry = document.createElement('p');
  searchEntry.textContent = city;
  searchEntry.addEventListener('click', function () {
    getWeatherData(city);
  });
  searchHistory.appendChild(searchEntry);
}

function getCurrentDate() {
  const date = new Date();
  return date.toDateString();
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toDateString();
}

function kelvinToCelsius(kelvin) {
  return Math.round(kelvin - 273.15);
}
