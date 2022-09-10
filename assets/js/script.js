// *** Reference-Variables ***//
function start(searchedCity) {
  var inputEl = document.getElementById("city-input");
  var searchEl = document.getElementById("search-input");
  var clearEl = document.getElementById("clear-history");
  var nameEl = document.getElementById("city-name");
  var currentPix = document.getElementById("current-pix");
  var currentTempEl = document.getElementById("temperature");
  var currentHumidityEl = document.getElementById("humidity");
  var currentWindEl = document.getElementById("wind-speed");
  var currentUVEl = document.getElementById("UV-index");
  var historyEl = document.getElementById("history");
  var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

  // *** Fetch API Section ***//

  var APIKey = "485c2c73dee04033790e901c450ffe0e";
  // *** When button is clicked - city name typed in by user *** //
  function fetchWeather(weatherApiCity) {
    //*** City named saved - process current condition to retrieve from weather map api ***//
    var apiUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      weatherApiCity +
      "&appid=" +
      APIKey;
    fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        var latitude = data.coord.lat;
        var longitude = data.coord.lon;
        let cityID = data.id;
        var currentDate = new Date(data.dt * 1000);
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        nameEl.innerHTML =
          data.name + " (" + month + "/" + day + "/" + year + ")";
        currentTempEl.innerHTML =
          "Temperature: " + k2f(data.main.temp) + " &#176F";
        currentHumidityEl.innerHTML = "Humidity: " + data.main.humidity + "%";
        currentWindEl.innerHTML = "Wind Speed: " + data.wind.speed + " MPH";
        let uvUrl =
          "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" +
          latitude +
          "&lon=" +
          longitude +
          "&appid=" +
          APIKey +
          "&cnt=1";
        fetch(uvUrl)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            console.log(data);

            let forecastUrl =
              "https://api.openweathermap.org/data/2.5/forecast?id=" +
              cityID +
              "&appid=" +
              APIKey;
            fetch(forecastUrl)
            .then(function (response) {
              return response.json()
          })  .then(function(data) {
              // *** Column Section ***
              const forecastEls = document.querySelectorAll(".forecast");
              for (let i = 0; i < forecastEls.length; i++) {
                forecastEls[i].innerHTML = "";
                const forecastIndex = i * 8 + 4;
                const forecastDate = new Date(
                  data.list[forecastIndex].dt * 1000
                );
                const forecastDay = forecastDate.getDate();
                const forecastMonth = forecastDate.getMonth() + 1;
                const forecastYear = forecastDate.getFullYear();
                const forecastDateEl = document.createElement("p");
                forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                forecastDateEl.innerHTML =
                  forecastMonth + "/" + forecastDay + "/" + forecastYear;
                forecastEls[i].append(forecastDateEl);
                const forecastWeatherEl = document.createElement("img");
                forecastWeatherEl.setAttribute(
                  "src",
                  "https://openweathermap.org/img/wn/" +
                    data.list[forecastIndex].weather[0].icon +
                    "@2x.png"
                );
                forecastWeatherEl.setAttribute(
                  "alt",
                  data.list[forecastIndex].weather[0].description
                );
                forecastEls[i].append(forecastWeatherEl);
                // Forecast Temp
                const forecastTempEl = document.createElement("p");
                forecastTempEl.innerHTML =
                  "Temp: " +
                  k2f(data.list[forecastIndex].main.temp) +
                  " &#176F";
                forecastEls[i].append(forecastTempEl);
                // Forecast Wind
                const forecastWindEl = document.createElement("p");
                forecastWindEl.innerHTML =
                  "Wind: " + data.list[forecastIndex].wind.speed + " MPH";
                forecastEls[i].append(forecastWindEl);
                // Forecast Humidity
                const forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.innerHTML =
                  "Humidity: " + data.list[forecastIndex].main.humidity + "%";
                forecastEls[i].append(forecastHumidityEl);
              }
          
            });
          });
      });
  }

  function k2f(k) {
    return Math.floor((k - 273.15) * 1.8 + 32);
  }

  searchEl.addEventListener("click", function () {
    const searchTerm = inputEl.value;
    fetchWeather(searchTerm);
    searchHistory.push(searchTerm)
    localStorage.setItem("search", JSON.stringify(searchHistory))
    renderSearchHistory()
  });

  clearEl.addEventListener("click", function() {
    searchHistory = [];
    localStorage.clear()
    renderSearchHistory()
  })

    function renderSearchHistory() {
      historyEl.innerHTML = "";
      for(let i = 0; i < searchHistory.length; i++) {
        const historyItem = document.createElement("input")
        historyItem.setAttribute("type", "text")
        historyItem.setAttribute("style", "margin-bottom: 10px;")
        historyItem.setAttribute("readonly", "true")
        historyItem.setAttribute("class", "form-control d-block bg-grey")
        historyItem.setAttribute("value", searchHistory[i])
        historyItem.addEventListener("click", function() {
          fetchWeather(historyItem.value)
        })
        historyEl.append(historyItem)
      }
    }

    renderSearchHistory();
    if(searchHistory.length > 0) {
      fetchWeather(searchHistory[searchHistory.length - 1])
    }



}

start();
