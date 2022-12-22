"use strict";

const apiKey = "b4dfadf0c642efeb5ff9d984a82da693";

const getCityCor = async function () {
  const city = document.querySelector("#search").value;
  const cityGeo = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  );
  const [cityGeoJSON] = await cityGeo.json();
  console.log(cityGeoJSON);
  return {
    lat: cityGeoJSON.lat,
    lon: cityGeoJSON.lon,
  };
};

const getCityWeather = async function () {
  const cityCor = await getCityCor();
  //   console.log(cityCor.lat, cityCor.lon);
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${cityCor.lat}&lon=${cityCor.lon}&appid=${apiKey}&units=metric`
  );

  const responseJSON = await response.json();
  console.log(responseJSON);
  return responseJSON;
};

const polishedData = async function () {
  const data = await getCityWeather();
  const dateTime = new Date(data.dt * 1000);
  console.log(dateTime.toTimeString("en-GB"));
  const obj = {
    name: data.name,
    time: dateTime.toLocaleTimeString("en-GB").slice(0, 5),
    main: data.main,
    weather: data.weather[0],
    windSpeed: (data.wind.speed / 3.6).toFixed(1),
  };
  return obj;
};

const insertWeatherCard = function (data) {
  const bgc = document.querySelector(".background");
  const main = document.querySelector(".weather-card");
  main.remove();
  console.log(data);
  const html = `<main class="weather-card">
      <div class="city--time-container">
          <span class="city">${data.name}</span>
          <span class="time">${data.time}</span>
      </div>
      <div class="weather-description">
          <!-- <ion-icon class="weather-description-img" name="rainy-outline"></ion-icon> -->
          <img class="weather-description-img" src="https://openweathermap.org/img/wn/${
            data.weather.icon
          }@2x.png" alt="">
          <span class="weather-description-text">${
            data.weather.description
          }</span>
      </div>
      <div class="weather-info">
      <div class="weather-details">
        <div class="wind-detail">
            <ion-icon class="icon" name="water-outline"></ion-icon>
            <span class="text">95%</span>
        </div>
        <div class="wind-detail">
            <ion-icon class="icon" name="thermometer-outline"></ion-icon>
            <span class="text">${data.main.temp_max.toFixed(
              1
            )}<sup>&deg;c</sup> / ${data.main.temp_min.toFixed(
    1
  )}<sup>&deg;c</sup></span>
        </div>
        <div class="wind-detail">
            <svg class="icon" style="width:24px;height:24px" viewBox="0 0 24 24">
                <path fill="currentColor" d="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z" />
            </svg>
            <span class="text">${data.windSpeed} km/h</span>
        </div>
      </div>
          <div class="weather-temp">${data.main.temp.toFixed(
            0
          )}<sup>&deg;c</sup></div>
      </div>
    </main>`;
  bgc.insertAdjacentHTML("beforeend", html);
};

// getCityWeather("alaska");

const searchBtn = document.querySelector(".btn");

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  console.log("push");
  //   console.log(data);
  const data = await polishedData();
  insertWeatherCard(data);
});

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("push");
  //   console.log(data);
  const data = await polishedData();
  insertWeatherCard(data);
});
