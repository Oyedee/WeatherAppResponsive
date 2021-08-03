//Select display elements
const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const buttonElement = document.querySelector(".button");


//creating weather object
const weather = {};

//get temperature unit
weather.temperature = {
    unit : "celcius"
}

//App constants and Variables
const KELVIN = 273;
//API key
const KEY = "8c258277bbfd64f54a4b357323f6ce1f";

//Check if Browser supports Geolocation
if("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition( setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't support geolocation.</p>"
}

//implement setPosition function to set user's position
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

//implement showError function when there is an issue
function showError(error) {
    notificationElement.style.display = "block"
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

//Get weather from API provider
function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${KEY}`;

    console.log(api);

    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function (data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function() {
            displayWeather();
        });
}

function getWeatherWithCity(city) {
    let api = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}`;

    console.log(api);

    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function (data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function() {
            displayWeather();
            console.log("display weather");
        });
}

//Display weather to User
function displayWeather() {
    iconElement.innerHTML = `<img src="${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;

    let now =new Date();
    let date =document.querySelector(".date");
    date.innerText = dateBuilder(now);
}

function dateBuilder (d){
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    let day =days[d.getDate()];
    let date =d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date + 1 } ${month} ${year}`;
}
//celcius conversion to fahrenheit
function celciusToFahrenheit(temperature) {
    return (temperature * 9/5) + 32;
}

//do a celcius to fahrenheit conversion when the user clicks the temperature
tempElement.addEventListener("click", function() {
    if(weather.temperature.value === undefined) return;

      if(weather.temperature.unit == "celcius") {
          let fahrenheit = celciusToFahrenheit(weather.temperature.value);
          fahrenheit = Math.floor(fahrenheit);

          tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
          weather.temperature.unit ="fahrenheit";
      } else {
          tempElement.innerHTML = `${weather.temperature.value} °<span>C</span>`;
          weather.temperature.unit = "celcius"
      }
});

//function to get user city from search box
buttonElement.addEventListener("click", function() {
    let input = document.getElementById("searchbox").value;
    city = input;
    getWeatherWithCity(city);
});

// date
