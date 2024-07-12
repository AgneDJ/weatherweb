document.addEventListener("DOMContentLoaded", () => {
  fetchCurrentWeather();
  fetchForecast();
  fetchWarnings();
  fetchHistoricalData();
  initMap();
  initRadarMap();
});

function fetchCurrentWeather() {
  fetch("https://api.lhms.lt/current-weather-endpoint")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("current-weather-data").innerHTML = `
              <p class="text-lg"><strong>Temperature:</strong> ${data.temperature}°C</p>
              <p class="text-lg"><strong>Humidity:</strong> ${data.humidity}%</p>
              <p class="text-lg"><strong>Wind Speed:</strong> ${data.wind_speed} m/s</p>
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
                  <p class="text-lg"><strong>${day.date}:</strong> ${day.temperature_min}°C - ${day.temperature_max}°C, ${day.description}</p>
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
        warningsHTML += `<p class="text-lg">${warning.description}</p>`;
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
        historicalHTML += `<p class="text-lg">${record.date}: ${record.temperature}°C</p>`;
      });
      document.getElementById("historical-data-content").innerHTML =
        historicalHTML;
    });
}

function initMap() {
  var map = L.map("map").setView([55.1694, 23.8813], 7); // Centered on Lithuania

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // Add a synoptic layer here, if available
  // Example for adding markers:
  fetch("https://api.lhms.lt/synoptic-endpoint")
    .then((response) => response.json())
    .then((data) => {
      data.synoptic.forEach((station) => {
        L.marker([station.latitude, station.longitude])
          .addTo(map)
          .bindPopup(
            `<b>${station.name}</b><br>Temperature: ${station.temperature}°C`
          );
      });
    });
}

function initRadarMap() {
  var radarMap = L.map("radar-map").setView([55.1694, 23.8813], 7); // Centered on Lithuania

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(radarMap);

  // Add radar overlay
  fetchRadarData(radarMap);
}

function fetchRadarData(map) {
  fetch("https://api.lhms.lt/radar-endpoint")
    .then((response) => response.json())
    .then((data) => {
      var radarLayer = L.imageOverlay(data.radar_image_url, [
        [data.bounds.southWest.lat, data.bounds.southWest.lng],
        [data.bounds.northEast.lat, data.bounds.northEast.lng],
      ]);
      radarLayer.addTo(map);
    });
}
