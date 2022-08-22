export const getSearchFocus = _ => {
    document.getElementById(`searchBar__text`).focus()
}

export const addSpinner = icon => {
    animateBtn(icon);
    setTimeout(animateBtn, 1000, icon)
}

const animateBtn = btn => {
    btn.classList.toggle(`none`);
    btn.nextElementSibling.classList.toggle(`none`);
}

export const displayError = (headerMsg, srMsg) => {
    showHeaderMsg(headerMsg);
    showSrMessage(srMsg);
};

export const displayApiError = obj => {
    const errMsg = properCase(obj.message);
    showHeaderMsg(errMsg);
    showSrMessage(`${errMsg}, please try later.`);
};

const properCase = text => {
    const properText = text
    .split(` `)
    .map(word => {
        return word[0].toUpperCase() + word.slice(1);
    })
    return properText.join(` `);
}

const showHeaderMsg = msg => {
    const header = document.getElementById(`currentLocation`);
    header.textContent = msg;
};

export const showSrMessage = msg => {
    const sr = document.getElementById(`confirmation`);
    sr.textContent = msg
}

export const cleanText = string => {
    const regex = / {2, }/g;
    const cleanEntry = string.replaceAll(regex, ` `).trim();
    return cleanEntry;
} 

export const updateDisplay = (weatherJson, locationObj) => {
    fadeDisplay();
    clearDisplay();
    document.getElementById(`currentLocation`).textContent = locationObj.getName()
    const mainClass = getWeatherIconClass(weatherJson.current.weather[0].icon);
    setBG(mainClass);
    const ccArray = createCurrentWeatherDivs(weatherJson, locationObj.getUnit());
    displayCurrentConditions(ccArray);
    displaySixDaysWeather(weatherJson);
    fadeDisplay();
}

const setBG = img => {
    document.querySelector(`main`).className = img;
}

const getWeatherIconClass = icon => {
    const firstTwoChars = icon.slice(0, 2);
    const lastChar = icon.slice(-1);
    const weatherLookup = {
        "01": "clear-sky" ,
        "02": "few-clouds",
        "03": "scattered-clouds",
        "04": "broken-clouds",
        "09": "shower-rain",
        10: "rain",
        11: "thunderstorm",
        13: "snow",
        50: "mist"
    }
    const mainClass = `${lastChar}-${weatherLookup[firstTwoChars]}`
    return mainClass
}

const createCurrentWeatherDivs = (weatherJsonObj, unit) => {
    const tempUnit = unit === `imperial` ? `F` : `C`;
    const windUnit = unit === `imperial` ? `mph` : `m/s`;
    const currentTemp = createElem(`div`, `currentTemp`)
    const temp = createElem(`h2`, `temp`, `${Math.round(+weatherJsonObj.current.temp)}°`);
    const units = createElem(`p`, `unit`, `${tempUnit}`);
    currentTemp.append(temp);
    currentTemp.append(units);
    const div = document.createElement('div')
    div.classList = 'ccWrapper'
    const state = createElem(`div`, `currentCondition__status`, `${weatherJsonObj.current.weather[0].description}`);
    const minTemp = createElem(`div`, `minTemp`, `Low: ${Math.round(+weatherJsonObj.daily[0].temp.min)}°`);
    const maxTemp = createElem(`div`, `maxTemp`, `High: ${Math.round(+weatherJsonObj.daily[0].temp.max)}°`);
    const feelsLike = createElem(`div`, `feelsLike`, `Feels Like ${Math.round(+weatherJsonObj.current.feels_like)}°`);
    const humidity = createElem(`div`, `humidity`, `Humidity ${Math.round(+weatherJsonObj.current.humidity)}%`)
    const wind = createElem(`div`, `wind`, `Wind ${Math.round(+weatherJsonObj.current.wind_speed)} ${windUnit}`);
    [state, feelsLike, humidity, wind].forEach(el => div.append(el))
    const iconContainer = createElem(`div`, `currentForecast__icon`);
    const icon = setWeatherIcon(weatherJsonObj.current.weather[0].icon)
    iconContainer.append(icon);
    return [currentTemp, minTemp, maxTemp, iconContainer, div];
}

const setWeatherIcon = icon => {
    const firstTwoChars = icon.slice(0, 2);
    const lastChar = icon.slice(-1);
    let iconWeather ;
    switch(firstTwoChars) {
        case `01` : 
        if(lastChar === `d`) iconWeather = createElem(`i`, `far fa-sun`);
        if(lastChar === `n`) iconWeather = createElem(`i`, `far fa-moon`);
        break; 

        case `02` : 
        if(lastChar === `d`) iconWeather = createElem(`i`, `fas fa-cloud-sun`);
        if(lastChar === `n`) iconWeather = createElem(`i`, `fas fa-cloud-moon`);
        break;

        case `03` : 
        if(lastChar === `d`) iconWeather = createElem(`i`, `fas fa-cloud-sun`);
        if(lastChar === `n`) iconWeather = createElem(`i`, `fas fa-cloud-moon`);
        break;

        case `04` : 
        if(lastChar === `d`) iconWeather = createElem(`i`, `fas fa-cloud-sun`);
        if(lastChar === `n`) iconWeather = createElem(`i`, `fas fa-cloud-moon`);
        break;

        case `09` :
        if(lastChar === `d`) iconWeather = createElem(`i`, `fas fa-cloud-rain`);
        if(lastChar === `n`) iconWeather = createElem(`i`, `fas fa-cloud-moon-rain`);
        break;

        case `10` :
        if(lastChar === `d`) iconWeather = createElem(`i`, `fas fa-cloud-rain`);
        if(lastChar === `n`) iconWeather = createElem(`i`, `fas fa-cloud-moon-rain`);
        break;

        case `11` : 
        if(lastChar === `d`) iconWeather = createElem(`i`, `fas fa-poo-storm`);
        if(lastChar === `n`) iconWeather = createElem(`i`, `fas fa-cloud-moon-rain`);
        break;

        case `13` : 
        if(lastChar === `d`) iconWeather = createElem(`i`, `far fa-snowflake`);
        if(lastChar === `n`) iconWeather = createElem(`i`, `far fa-snowflake`);
        break;
        
        case 50 : 
        if(lastChar === `d`) iconWeather = createElem(`i`, `fas fa-smog`);
        if(lastChar === `n`) iconWeather = createElem(`i`, `fas fa-smog`);
        break;
        
        default: iconWeather = createElem(`i`, `far fa-sun`)
    }
    return iconWeather;
}

const fadeDisplay = _ => {
    const cc = document.getElementById(`currentConditions`);
    cc.classList.toggle(`zero-vis`);
    cc.classList.toggle(`fade-in`);
    const sixDays = document.getElementById(`sixDaysForecast__list`);
    sixDays.classList.toggle(`zero-vis`);
    sixDays.classList.toggle(`fade-in`);
}

const clearDisplay = _ => {
    const cc = document.getElementById(`currentConditions`);
    deleteContents(cc);
    const sixDays = document.getElementById(`sixDaysForecast__list`);
    deleteContents(sixDays);
};

const deleteContents = element => {
    let child = element.lastElementChild;
    while(child) {
        element.removeChild(child);
        child = element.lastElementChild
    };
};

const displayCurrentConditions = ccArray => {
    const cc = document.getElementById(`currentConditions`);
    ccArray.forEach(element => {
        cc.append(element)
    })
}

const displaySixDaysWeather = weatherJson => {
    const sixDaysList = document.getElementById(`sixDaysForecast__list`);
    for(let i = 1; i <= 6; i++) {
        const li = createElem(`li`);
        const dayName = getDayName(weatherJson.daily[i].dt);
        const abbr = createElem(`abbr`, ``, dayName);
        abbr.title = dayName;
        const img = createElem(`img`, `weatherIcon`)
        img.src = `https://openweathermap.org/img/wn/${weatherJson.daily[i].weather[0].icon}.png`
        img.alt = weatherJson.daily[i].weather[0].description;
        const highTemp = createElem(`span`, `high`, `${Math.round(+weatherJson.daily[i].temp.max)}°`);
        const lowTemp = createElem(`span`, `low`, `${Math.round(+weatherJson.daily[i].temp.min)}°`);
        li.append(abbr);
        li.append(img);
        li.append(highTemp);
        li.append(lowTemp);
        sixDaysList.append(li);
    }
}

const getDayName = ms => {
    const dateObj = new Date(ms * 1000);
    const dayName = dateObj.toUTCString();
    return dayName.slice(0, 3).toUpperCase()

}

const createElem = (tagName, className, textContent) => {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = textContent;
    return element;
}