document.addEventListener("DOMContentLoaded", () => {
  fetchCurrentWeather();
  fetchForecast();
  fetchWarnings();
  fetchHistoricalData();
});

function fetchCurrentWeather() {
  fetch("https://api.lhms.lt/current-weather-endpoint")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("current-weather-data").innerHTML = `
                <p>Temperature: ${data.temperature}°C</p>
                <p>Humidity: ${data.humidity}%</p>
                <p>Wind Speed: ${data.wind_speed} m/s</p>
            `;
    });
}

function fetchForecast() {
  fetch("https://api.lhms.lt/forecast-endpoint")
    .then((response) => response.json())
    .then((data) => {
      let forecastHTML = "";
      data.forecast.forEach((day) => {
        forecastHTML += `
                    <p>${day.date}: ${day.temperature_min}°C - ${day.temperature_max}°C, ${day.description}</p>
                `;
      });
      document.getElementById("forecast-data").innerHTML = forecastHTML;
    });
}

function fetchWarnings() {
  fetch("https://api.lhms.lt/warnings-endpoint")
    .then((response) => response.json())
    .then((data) => {
      let warningsHTML = "";
      data.warnings.forEach((warning) => {
        warningsHTML += `<p>${warning.description}</p>`;
      });
      document.getElementById("warnings-data").innerHTML = warningsHTML;
    });
}

function fetchHistoricalData() {
  fetch("https://api.lhms.lt/historical-data-endpoint")
    .then((response) => response.json())
    .then((data) => {
      let historicalHTML = "";
      data.historical.forEach((record) => {
        historicalHTML += `<p>${record.date}: ${record.temperature}°C</p>`;
      });
      document.getElementById("historical-data-content").innerHTML =
        historicalHTML;
    });
}
