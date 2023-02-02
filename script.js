"use strict";

const apiKey = "b4dfadf0c642efeb5ff9d984a82da693";
const searchBtn = document.querySelector(".search-box__btn");
const cityNameHolder = document.querySelector(".weather-card__city-name");
const timeHolder = document.querySelector(".weather-card__time");
const imgHolder = document.querySelector(".weather-condition__img");
const conditionHolder = document.querySelector(
  ".weather-condition-description"
);
const precipitationHolder = document.querySelector(
  ".weather-card__precipitation"
);
const minTempHolder = document.querySelector(".weather-card__min-temp");
const maxTempHolder = document.querySelector(".weather-card__max-temp");
const windSpeedHolder = document.querySelector(".weather-card__wind-speed");
const currentTempHolder = document.querySelector(".weather-card__cur-temp");

const getCityCoordinate = async function (cityName) {
  try {
    const cityResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`
    );
    const [cityData] = await cityResponse.json();
    if (!cityData) throw new Error("There is not such a city");
    const coordinate = { lat: cityData.lat, lon: cityData.lon };
    return coordinate;
  } catch (err) {
    alert(err);
  }
};
getCityCoordinate("beijing");

const getCityWeather = async function (cityName) {
  const cityCoordinate = await getCityCoordinate(cityName);
  const cityResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${cityCoordinate.lat}&lon=${cityCoordinate.lon}&appid=${apiKey}&units=metric`
  );
  const cityData = await cityResponse.json();
  return cityData;
};

const getCityPollution = async function (cityName) {
  const cityCoordinate = await getCityCoordinate(cityName);
  const cityResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${cityCoordinate.lat}&lon=${cityCoordinate.lon}&appid=${apiKey}`
  );
  const cityData = await cityResponse.json();
  return cityData;
};

const getCityForecast = async function (cityName) {
  const cityCoordinate = await getCityCoordinate(cityName);
  const cityResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${cityCoordinate.lat}&lon=${cityCoordinate.lon}&appid=${apiKey}&units=metric`
  );
  const cityData = await cityResponse.json();
  const cityForecast = cityData.list;
  return cityForecast;
};

const abstractData = async function (cityName) {
  const currentWeather = await getCityWeather(cityName);
  const weatherForcast = await getCityForecast(cityName);
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  });
  return {
    name: currentWeather.name,
    time: currentTime,
    icon: `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`,
    condition: currentWeather.weather[0].description,
    precipitation: weatherForcast[0].pop,
    temperature: currentWeather.main.temp,
    temperatureMin: currentWeather.main.temp_min,
    temperatureMax: currentWeather.main.temp_max,
    windSpeed: currentWeather.wind.speed,
  };
};

const insertCityData = async function (cityName) {
  const cityData = await abstractData(cityName);
  cityNameHolder.textContent = cityData.name;
  timeHolder.textContent = cityData.time;
  imgHolder.src = cityData.icon;
  conditionHolder.textContent = cityData.condition;
  currentTempHolder.innerHTML = `${cityData.temperature.toFixed()}<sup>&deg;c</sup>`;
  precipitationHolder.textContent = `${cityData.precipitation * 100}%`;
  windSpeedHolder.textContent = `${cityData.windSpeed.toFixed()} km/h`;
  minTempHolder.innerHTML = `${cityData.temperatureMin.toFixed()}<sup>&deg;c</sup>`;
  maxTempHolder.innerHTML = `${cityData.temperatureMax.toFixed()}<sup>&deg;c</sup>`;
};

searchBtn.addEventListener("click", async (e) => {
  const cityNameInput = document.querySelector(".search-box__input").value;
  e.preventDefault();
  insertCityData(cityNameInput);
});

document.querySelector("form").addEventListener("submit", async (e) => {
  const cityNameInput = document.querySelector(".search-box__input").value;
  e.preventDefault();
  insertCityData(cityNameInput);
});
