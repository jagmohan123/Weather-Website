const userTab = document.querySelector("[data-user-Weather]");
const searchTab = document.querySelector("[data-search-Weather]");
const userContainer = document.querySelector(".Weather-container");
const greantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-seachForm]");
const loadingContainer = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionStorage();

// switch tab one tab to another tab
function swichTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            greantAccessContainer.classList.remove("active");
            searchForm.classList.add("active")
        } else {
            // if i am in search tab if go user
            //  tab so make search tab invisible and user tab visile
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // i am in wheather tab so we have to display weathertab
            // so lets check the cordinates values , if we have in saved there in session
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    swichTab(userTab);
});

searchTab.addEventListener("click", () => {
    swichTab(searchTab);
});

// check cordinates value in session storage
function getFromSessionStorage() {
    const localCordinates = sessionStorage.getItem("user-coordinates");
    if (!localCordinates) {
        greantAccessContainer.classList.add("active");
    } else {
        const cordinates = JSON.parse(localCordinates);
        fetchUserInfo(cordinates);
    }
}


async function fetchUserInfo(cordinates) {
    const {
        lat,
        lon
    } = cordinates;
    // make grantContainerInvisible
    greantAccessContainer.classList.remove("active");
    loadingContainer.classList.add("active");

    // calling whether api

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        loadingContainer.classList.remove("active");
        userInfoContainer.classList.add("active");
        showWheatherInfoOnUI(data);

    } catch (err) {
        loadingContainer.classList.remove("active");
        console.log("faild API calling Due to ", err);

    }

}

function showWheatherInfoOnUI(info) {
    //1stly fecth all the feilds from html where we have to put value 
    const cityName = document.querySelector("[data-cityName]");
    const contryFlag = document.querySelector("[data-CountryIcon]");
    const weatherDiscription = document.querySelector("[data-weatherDescription]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temprature = document.querySelector("[data-Temprature]");
    const windspeed = document.querySelector("[data-windSpeed]");
    const Humidity = document.querySelector("[data-humidity]");
    const cloudCondition = document.querySelector("[data-cloud]");
    console.log(info);
    // way fo putting the value from nested json onject by chaing operator ?.

    cityName.innerText = info?.name;
    contryFlag.src = `https://flagcdn.com/144x108/${info?.sys?.country.toLowerCase()}.png`;
    weatherIcon.src = `http://openweathermap.org/img/w/${info?.weather?.[0]?.icon}.png`;
    weatherDiscription.innerText = info?.weather?.[0].description;
    temprature.innerText = `${info?.main?.temp} °C`;
    windspeed.innerText = `${info?.wind?.speed} m/s`;
    Humidity.innerText = `${info?.main?.humidity} %`;
    cloudCondition.innerText = `${info?.clouds?.all} %`;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPositon);
    } else {
        alert(" no gelolocation support available  ");
    }
}

function showPositon(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);
const searchInput = document.querySelector("[searchCity]");

searchForm.addEventListener("submit", (value) => {
    value.preventDefault();
    let city = searchInput.value;
    if (city === "") {
        return;
    } else {
        fetchWheatherInfo(city);
    }
});

async function fetchWheatherInfo(cityname) {
    loadingContainer.classList.add("active");
    userInfoContainer.classList.remove("active");
    greantAccessContainer.classList.remove("active");

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        loadingContainer.classList.remove("active");
        userInfoContainer.classList.add("active");
        showWheatherInfoOnUI(data);

    } catch (error) {
        greantAccessContainer.classList.remove("active");
        userInfoContainer.classList.remove("active");
        loadingContainer.classList.remove(".active");
        searchForm.classList.remove("active");
        let notFound=document.querySelector(".image-container");
        notFound.classList.add(".active");
        console.log("api run fail due to =>", error);

    }

}