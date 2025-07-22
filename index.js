const usertab = document.querySelector("[data-userWeather]");
const searchtab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weathercontainer");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchform = document.querySelector("[data-searchform]");
const loadingscreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initially  variables needed

let currentTab = usertab;
currentTab.classList.add("current-tab");
const API_KEY ="d1845658f92b31c64bd94f06f7188c9c";

getfromSessionStorage();

//function used to handle switching
function switchTab(clickedtab) {
    if (clickedtab !== currentTab) {
        // Switch tab UI
        currentTab.classList.remove("current-tab");
        currentTab = clickedtab;
        currentTab.classList.add("current-tab");

        // If switching to "Search Weather"
        if (!searchform.classList.contains("active")) {
            // Hide user weather and grant access
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");

            // Show search form
            searchform.classList.add("active");
        } else {
            // Switching back to "Your Weather"
            searchform.classList.remove("active");

            // Load from session storage
            getfromSessionStorage();
        }
    }
}

//add event listener
usertab.addEventListener("click",() => {

     switchTab(usertab);//func call
});

//add event listener
searchtab.addEventListener("click",() => {
     switchTab(searchtab);//func call
});

//check if coordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    // Hide everything first
    searchform.classList.remove("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    loadingscreen.classList.remove("active");

    if (!localCoordinates) {
        // No coordinates → Ask for location
        grantAccessContainer.classList.add("active");
    } else {
        // Coordinates exist → Fetch weather
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeather(coordinates);
    }
}

async function fetchUserWeather(coordinates) {
    const { lat, lon } = coordinates;

    // Prepare UI
    grantAccessContainer.classList.remove("active");
    userInfoContainer.classList.remove("active");
    searchform.classList.remove("active");
    loadingscreen.classList.add("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();

        // Show user info
        loadingscreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        // Render data
        renderWeatherinfo(data);
    } catch (err) {
        loadingscreen.classList.remove("active");
        console.error("Error fetching weather data:", err);
        alert("Unable to fetch weather data. Please check your internet or API key.");
    }
}


// function used to show local info in UI

function renderWeatherinfo(weatherInfo){
    //fetch the  element

    const cityname = document.querySelector("[data-cityName]");
    const countryicon = document.querySelector("[data-countryIcon]");
    const weatherdesc = document.querySelector("[data-weatherDesc]");
    const weathericon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-cloudiness]");

    //put fetch value into UI
    cityname.innerText = weatherInfo?.name;
    countryicon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherdesc.innerText = weatherInfo?.weather?.[0]?.description;
    weathericon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    clouds.innerText =`${ weatherInfo?.clouds?.all}%`;

}

//show position function used to Set User-coordinate
function showPosition(position){

    const userCoordinates = {
           lat : position.coords.latitude,
           lon : position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));

    //func call
    fetchUserWeather(userCoordinates);
}

function getLocation(){

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("no geolocaion support available");
    }

}

const grantbtn = document.querySelector("[data-grantAccess]");
grantbtn.addEventListener("click",getLocation);


const  searchinput = document.querySelector("[data-searchInput]");

searchform.addEventListener("submit" , (e) => {

    e.preventDefault();

   let City = searchinput.value;

   if(City === ""){
     return;
   }
   else{

     fetchsearchInfo(City);
   }
});

async function fetchsearchInfo(city){
    loadingscreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
       
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingscreen.classList.remove("active");
        userInfoContainer.classList.add("active");
          //render data into browser
         renderWeatherinfo(data);
    }
    catch(err){
      console.log(err);

    }


}



