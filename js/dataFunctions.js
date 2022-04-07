const apiKey = `2e6793cccfac1ae283c9bd823eb14da7`;
export const setCurrLocationObj = (locationObj, coordsObj) => {
    const { lat, lon, name, unit } = coordsObj;
    locationObj.setLat(lat);
    locationObj.setLon(lon);
    locationObj.setName(name);
    if(unit) locationObj.setUnit(unit);
}

export const getHomeLoc = _ => {
    return localStorage.getItem(`homeLocation`)
}


export const getCoordsFromApi = async (searchEntry, unit) => {
    const regex = /^\d+$/g;
    const flag = regex.test(searchEntry)
    ? `zip`
    : `q`;
    const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${searchEntry}&${unit}&appid=${apiKey}`;
    const encodedUrl = encodeURI(url);
    try {
        const weatherResponse = await fetch(encodedUrl);
        const dataJson = await weatherResponse.json();
        return dataJson;
    } catch (err) {
        console.error(err)
    }
}

export const getWeatherFromCoords = async locationObj => {
    const lat = locationObj.getLat();
    const lon = locationObj.getLon();
    const unit = locationObj.getUnit();
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&units=${unit}&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        const dataJson = await response.json();
        return dataJson;
    } catch (err) {
        console.error(err)
    }
};