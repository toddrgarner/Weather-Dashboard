//************************ Reference-Variables ************************//


var inputEl = document.getElementById("city-input");
var searchEl = document.getElementById("search-input");
var clearEl = document.getElementById("clear-history");
var nameEl = document.getElementById("clear-name");
var currentPix = document.getElementById("current-pix");
var currentTempEl = document.getElementById("temperature");
var currentHumidityEl = document.getElementById("humidity");
var currentWindeEl = document.getElementById("wind-speed");
var currentUVEl = document.getElementById("UV-index");
var historyEl = document.getElementById("history");
var searchHistory = JSON.parse(localStorage.getItem("search")) || []

//************************ Container ************************//









var APIKey = "485c2c73dee04033790e901c450ffe0e";
var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + "austin" + "&appid=" + APIKey
function start() {
fetch(apiUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        var latitude = data.coord.lat;
        var longitude = data.coord.lon;
        let cityID = data.id
        let uvUrl = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIKey + "&cnt=1"
    fetch(uvUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data)
            
            let forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
            fetch(forecastUrl)
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {
                    console.log(data)
                })
        })
})
    
}


start()