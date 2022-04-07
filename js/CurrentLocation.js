export default class CurrentLocation {
    constructor() {
        this._lat = null;
        this._lon = null;
        this._unit = `imperial`;
        this._name = null;
    };

    //Get Location Latitude
    getLat() {
        return this._lat;
    };

    //Set Location Latitude
    setLat(lat) {
        this._lat = lat;
    };

    //Get Location Longitude
    getLon() {
        return this._lon
    };

    //Set Location Longitude
    setLon(lon) {
        this._lon = lon;
    };

    //Get Location Name

    getName() {
        return this._name;
    };

    //Set Location Name 
    setName(name) {
        this._name = name;
    };

    //get Location Units Type
    getUnit() {
        return this._unit;
    };

    //Set Location Unit
    setUnit(unit) {
        this._unit = unit;
    };

    //Toggle Uit Type
    toggleUnit() {
        this._unit = this._unit === `imperial` ? `metric` : `imperial`;
    };

};