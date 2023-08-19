const APPController = (() => {
  const APIKey = "b0be1ea726e41211c99a0669d5723128";

  async function _getGeolocation(cityName) {
    if (cityName.length === 0) {
      alert("Please type the in city name");
    } else {
      _showLoader();

      const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIKey}`;

      const geoResponse = await fetch(geoURL);

      if (geoResponse.status === 200) {
        const geoData = await geoResponse.json();

        if (geoData.length === 0) {
          alert(
            `Please type the correct city name, or the city is unavailable`
          );
        } else {
          const newGeoData = {
            lat: geoData[0].lat,
            lon: geoData[0].lon,
          };

          _getWeatherDetails(newGeoData);
        }
      } else {
        alert(`Server Error: ${geoResponse.status}, ${geoResponse.statusText}`);
      }
    }
  }

  async function _getWeatherDetails(geoData) {
    const { lat, lon } = geoData;
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`;

    const weatherResponse = await fetch(weatherURL);
    const weatherData = await weatherResponse.json();

    console.log(weatherData);
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
      visibility = `${visbilityDistance} Km`;
    } else {
      visibility = `${visbilityDistance} M`;
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
    _hideLoader();

    let AppUI = `
   
                
    
    <img src="./src/svg/weatherIcons/${cleanWeatherData.imageUrl}.svg" class="weather-icon"/>
    <span class="city-name">${cleanWeatherData.name}, ${cleanWeatherData.country}</span>
    <span class="weather-description">${cleanWeatherData.description}</span>
    <span class="current-time">Today ${cleanWeatherData.time}</span>
    <div class="temp-container">
        <span class="current-temp">${cleanWeatherData.temp}</span>
        <span class="w-degree">&deg</span>
    </div> 

<div class="w-details">
    <div class="w-more-details">
        <img src="./src/svg/weatherIcons/humidity.svg" class="details-icon"/>
        <span class="d-text">Humidity</span>
        <span class="h-text">${cleanWeatherData.humidity}&#37</span>
    </div>

    <div class="w-more-details">
        <img src="./src/svg/weatherIcons/wind.svg" class="details-icon"/>
        <span class="d-text">Wind</span>
        <span class="w-text">${cleanWeatherData.windSpeed} Km/h</span>
    </div>

    <div class="w-more-details">
        <img src="./src/svg/weatherIcons/fog.svg" class="details-icon"/>
        <span class="d-text">Visibilty</span>
        <span class="v-text">${cleanWeatherData.visibility}</span>
    </div>

</div>`;

    allWeatherDeatils.innerHTML = AppUI;

    //Show search input and button
    let search = document.getElementById("search");
    search.style.visibility = "visible";
  }

  //Loader
  const loader = document.getElementById("loading");

  function _showLoader() {
    loader.style.visibility = "visible";
  }

  function _hideLoader() {
    loader.style.visibility = "hidden";
  }

  //Set first screen image
  window.onload = function _discoverRandonPic() {
    const pictures = [
      "weather-news.webp",
      "weather-hot.webp",
      "weather-rain.webp",
      "weather-snow.webp",
      "weather-wind.webp",
    ];

    const getPic = pictures[Math.floor(Math.random() * pictures.length)];
    //console.log(getPic);
    document.getElementById("picFrame").src = `./src/illustrations/${getPic}`;

    //Hide search input and button
    let search = document.getElementById("search");
    search.style.visibility = "hidden";
  };

  //Get started code, get weather at your current location
  const getStartedBtn = document.getElementById("getStartedBtn");

  getStartedBtn.addEventListener("click", () => {
    if (navigator.onLine) {
      if (navigator.geolocation) {
        _showLoader();

        const userLocation =
          navigator.geolocation.getCurrentPosition(ShowPosition);

        function ShowPosition(position) {
          const userPosition = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };

          _getWeatherDetails(userPosition, APIKey);
        }
      } else {
        alert(
          `Sorry we could not get your location automatically, or the city is unavailable`
        );
      }
    } else {
      alert(`Please check your internet connection`);
    }
  });
})();
