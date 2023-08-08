const APPController = (() => {
  async function _getGeolocation(cityName) {
    const APIKey = "b0be1ea726e41211c99a0669d5723128";
    const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIKey}`;

    const geoResponse = await fetch(geoURL);
    const geoData = await geoResponse.json();

    _getWeatherDetails(geoData, APIKey);
  }

  async function _getWeatherDetails(geoData, APIKey) {
    const { lat, lon } = geoData[0];
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`;

    const weatherResponse = await fetch(weatherURL);
    const weatherData = await weatherResponse.json();

    _computeData(weatherData);
  }

  //Search Method
  let searchBtn = document.getElementById("searchBtn");

  searchBtn.addEventListener("click", () => {
    let cityName = document.getElementById("searchInput").value;
    _getGeolocation(cityName);
  });

  //compute data/format data

  function _computeData(data) {
    const rawWeatherData = data;

    let imageUrl = rawWeatherData.weather[0].icon;
    const name = rawWeatherData.name;
    const country = rawWeatherData.sys.country;
    const weatherDescription = rawWeatherData.weather[0].description;
    let currentTime;
    let time = 0;
    let temp = parseFloat(rawWeatherData.main.temp);
    let humidity = parseInt(rawWeatherData.main.humidity);
    let windSpeed = parseFloat(rawWeatherData.wind.speed);
    let visbilityDistance = parseInt(rawWeatherData.visibility);
    let visibility;

    //set time for user
    time = new Date();
    if (time.getHours() >= 12) {
      currentTime = `${time.getHours()}:${time.getMinutes()} PM`;
    } else {
      currentTime = `${time.getHours()}:${time.getMinutes()} AM`;
    }

    //convert visibility Meters to KM
    if (visbilityDistance >= 1000) {
      visbilityDistance = visbilityDistance / 1000;
      console.log(visbilityDistance);
      visibility = `${10} Km`;
    } else {
      visibility = `${15} M`;
    }

    //Round of temp
    temp = Math.round(temp);

    //Round of wind speed
    windSpeed = Math.round(windSpeed);

    //send data to UI
    const cleanWeatherData = {
      imageUrl: imageUrl,
      name: name,
      country: country,
      description: weatherDescription,
      time: currentTime,
      temp: temp,
      humidity: humidity,
      windSpeed: windSpeed,
      visibility: visibility,
    };

    _setUserInterface(cleanWeatherData);
  }

  //Set UI with data
  function _setUserInterface(cleanWeatherData) {
    let allWeatherDeatils = document.getElementById("allWeatherDeatils");

    let AppUI = `<img src="./src/svg/weatherIcons/${cleanWeatherData.imageUrl}.svg" class="weather-icon"/>
    <span class="city-name">${cleanWeatherData.name}, ${cleanWeatherData.country}</span>
    <span class="weather-description">${cleanWeatherData.description}</span>
    <span class="current-time">Today ${cleanWeatherData.time}</span>
    <div class="temp-container">
        <span class="current-temp">${cleanWeatherData.temp}</span>
        <span class="w-degree">&deg</span>
    </div> 

<div class="w-details">
    <div class="w-more-details">
        <img src="./src/svg/mainIcons/wi-humidity.svg" class="details-icon"/>
        <span class="d-text">Humidity</span>
        <span class="h-text">${cleanWeatherData.humidity}&#37</span>
    </div>

    <div class="w-more-details">
        <img src="./src/svg/mainIcons/wi-windy.svg" class="details-icon"/>
        <span class="d-text">Wind</span>
        <span class="w-text">${cleanWeatherData.windSpeed} Km/h</span>
    </div>

    <div class="w-more-details">
        <img src="./src/svg/mainIcons/wi-visibility.svg" class="details-icon"/>
        <span class="d-text">Visibilty</span>
        <span class="v-text">${cleanWeatherData.visibility}</span>
    </div>

</div>`;

    allWeatherDeatils.innerHTML = AppUI;
  }
})();
