const apiKey = '9318468eb5abab0a2725579762e7c043';

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');

searchForm.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(e) {
  e.preventDefault();
  const city = cityInput.value;
  if (city.trim() !== '') {
    getWeatherData(city);
    cityInput.value = '';
  }
}

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

}

function displayCurrentWeather(data) {
  const weather = data.weather[0];
  const temperature = data.main.temp;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

  const currentWeatherCard = document.createElement('div');
  currentWeatherCard.classList.add('weather-card');
  currentWeatherCard.innerHTML = `
    <h3>${data.name}</h3>
    <p>Date: ${getCurrentDate()}</p>
    <img src="https://openweathermap.org/img/w/${weather.icon}.png" alt="${weather.description}">
    <p>Temperature: ${kelvinToCelsius(temperature)}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} m/s</p>
  `;

  clearElement(currentWeather);
  currentWeather.appendChild(currentWeatherCard);
}

function displayForecast(data) {
  const forecastData = data.list;

  const forecastCards = forecastData
    .filter((_, index) => index % 8 === 0)
    .map(forecast => createForecastCard(forecast));

  clearElement(forecast);
  forecastCards.forEach(card => forecast.appendChild(card));
}

function createForecastCard(forecast) {
  const weather = forecast.weather[0];
  const temperature = forecast.main.temp;
  const humidity = forecast.main.humidity;
  const windSpeed = forecast.wind.speed;
  const date = formatDate(forecast.dt);

  const forecastCard = document.createElement('div');
  forecastCard.classList.add('weather-card');
  forecastCard.innerHTML = `
    <h3>${date}</h3>
    <img src="https://openweathermap.org/img/w/${weather.icon}.png" alt="${weather.description}">
    <p>Temperature: ${kelvinToCelsius(temperature)}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} m/s</p>
  `;

  return forecastCard;
}

function addToSearchHistory(city) {
  const searchEntry = document.createElement('p');
  searchEntry.textContent = city;
  searchEntry.addEventListener('click', () => {
    getWeatherData(city);
  });
  searchHistory.appendChild(searchEntry);
}

function clearElement(element) {
  while (element.firstChild) {
    element.firstChild.remove();
  }
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
