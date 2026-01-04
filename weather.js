// Replace with your actual OpenWeatherMap API Key
const apiKey = "f40c321e2f4fa923b4474398023ee800";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("getWeatherBtn");

  // Only run if the button exists on this page
  if (btn) {
    btn.addEventListener("click", () => {
      const city = document.getElementById("cityInput").value;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      fetch(url)
        .then((response) => {
          if (!response.ok) throw new Error("City not found");
          return response.json();
        })
        .then((data) => {
          // Update UI elements
          document.getElementById("weatherDisplay").style.display = "block";
          document.getElementById("cityName").innerText = data.name;
          document.getElementById("temp").innerText = Math.round(
            data.main.temp
          );
          document.getElementById("humidity").innerText = data.main.humidity;
          document.getElementById("description").innerText =
            data.weather[0].description;

          // Set the weather icon
          const iconCode = data.weather[0].icon;
          document.getElementById(
            "weatherIcon"
          ).src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        })
        .catch((err) => {
          console.error(err);
          alert("Error: " + err.message);
        });
    });
  }
});

const API_KEY = "f40c321e2f4fa923b4474398023ee800";
const CITY = "Kolkata";

async function getFullWeather() {
  // 1. Get Lat/Lon and Temperature
  const weatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}`
  );
  const wData = await weatherRes.json();

  // 2. Use that Lat/Lon to get AQI
  const aqiRes = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${wData.coord.lat}&lon=${wData.coord.lon}&appid=${API_KEY}`
  );
  const aqiData = await aqiRes.json();

  // 3. Display both
  document.getElementById("weather").innerHTML = `
        <h3>${CITY}</h3>
        <p>Temp: ${wData.main.temp}°C</p>
        <p>Condition: ${wData.weather[0].description}</p>
        <p><b>AQI Level: ${aqiData.list[0].main.aqi} (Scale 1-5)</b></p>
    `;
}

getFullWeather();
