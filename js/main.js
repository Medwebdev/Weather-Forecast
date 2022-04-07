//Use Class And Create Current Location Object With Keys => Lt, Lon, Unit and Name
import CurrentLocation from "./CurrentLocation.js"; 
import { getSearchFocus, addSpinner, displayError, showSrMessage, cleanText, displayApiError, updateDisplay } from "./domFunctions.js";
import { setCurrLocationObj, getHomeLoc, getCoordsFromApi, getWeatherFromCoords } from "./dataFunctions.js";
const currentLoc = new CurrentLocation();

// Do Functions Once The Window Is Loaded

document.addEventListener(`DOMContentLoaded`, () => {
    initApp()
});

const initApp = _ => {
    getSearchFocus();
    //Buttons Functions
    const markLocation = document.getElementById(`markLocation`);
    markLocation.addEventListener(`click`, getGeoWeather);
    const homeBtn = document.getElementById(`homeLocation`);
    homeBtn.addEventListener(`click`, loadWeather);
    const save = document.getElementById(`saveLocation`);
    save.addEventListener(`click`, saveLocation);
    const switchUnits = document.getElementById(`toggleUnits`);
    switchUnits.addEventListener(`click`, toggleUnits)
    const refreshBtn = document.getElementById(`refresh`);
    refreshBtn.addEventListener(`click`, refreshApp);
    const form = document.getElementById(`searchBar`);
    form.addEventListener(`submit`, submitSearch)
    loadWeather()
}

const getGeoWeather = event => {
    if(event && event.type === `click`) {
        const markIcon = document.querySelector(`.fa-map-marker-alt`);
        addSpinner(markIcon);
    }
    if(!navigator.geolocation) return geoError();
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
}

const geoError = errObj => {
    const errMsg = errObj ? errObj.message : `Location Is Not Supported`;
    displayError(errMsg, `${errMsg}, please try later.`)
}

const geoSuccess = position => {
    const coordsObj = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        name: `Lat: ${Number(position.coords.latitude).toFixed(2)}, Lon: ${Number(position.coords.longitude).toFixed(2)}`
    };
    setCurrLocationObj(currentLoc, coordsObj);
    updateDataAndDisplay(currentLoc);
};

const loadWeather = event => {
    const savedLocation = getHomeLoc();
    if(!savedLocation && !event) return getGeoWeather();
    if(!savedLocation && event) {
        displayError(
            `No Home Location Saved!`,
            `No Home Location Saved, Please Save Your Location First.`
        );
    } else if(savedLocation && !event) {
        displayHomeWeather(savedLocation);
    } else {
        const homeIcon = document.querySelector(`.fa-home`);
        addSpinner(homeIcon);
        displayHomeWeather(savedLocation);
    }
}

const displayHomeWeather = location => {
    if(typeof location === `string`) {
        const locationObj = JSON.parse(location);
        setCurrLocationObj(currentLoc, locationObj);
        updateDataAndDisplay(currentLoc)
    }
}

const saveLocation = _ => {
    const saveIcon = document.querySelector(`.fa-save`);
    addSpinner(saveIcon);
    const location = {
        lat: currentLoc.getLat(),
        lon: currentLoc.getLon(),
        name: currentLoc.getName(),
        unit: currentLoc.getUnit()
    };
    localStorage.setItem(`homeLocation`, JSON.stringify(location));
    showSrMessage(`Saved ${currentLoc.getName()} as home location`);
};

const toggleUnits = _ => {
    const icon = document.querySelector(`.fa-ruler-horizontal`);
    addSpinner(icon);
    currentLoc.toggleUnit();
    updateDataAndDisplay(currentLoc)
};

const refreshApp = _ => {
    const refreshIcon = document.querySelector(`#refresh > .fa-sync`);
    addSpinner(refreshIcon);
    updateDataAndDisplay(currentLoc)
}

const submitSearch = async event => {
    event.preventDefault();
    const searchEntry = document.getElementById(`searchBar__text`).value;
    const cleanEntry = cleanText(searchEntry);
    const searchIcon = document.querySelector(`.fa-search`);
    addSpinner(searchIcon)
    const coordsObj = await getCoordsFromApi(cleanEntry, currentLoc.getUnit());
    if(coordsObj) {
        if(coordsObj.cod == 200) {
            const myCoordsObj = {
                lat: coordsObj.coord.lat,
                lon: coordsObj.coord.lon,
                name: coordsObj.sys.country 
                ? `${coordsObj.name}, ${coordsObj.sys.country}`
                : `${coordsObj.name}`
            }
            setCurrLocationObj(currentLoc, myCoordsObj);
            updateDataAndDisplay(currentLoc);
        } else {
            displayApiError(coordsObj)
        }
    } else {
        displayError(
            `Connection Error`,
            `Connection Error`
        )
    }
}

const updateDataAndDisplay = async locationObj => {
    const weatherJson = await getWeatherFromCoords(locationObj);
    if(weatherJson) updateDisplay(weatherJson, locationObj );
};
// console.log(navigator)