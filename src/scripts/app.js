/*global satellite:false */
(function() {
    'use strict';

    var app = document.querySelector('#app');

    app.distanceUnits = 'miles';
    app.horizonCircle = undefined;
    app.showHorizon = true;
    app.centerMap = true;
    app.termCircle = undefined;

    /**
     * Handle the ajax response
     *
     * @param  {object} e  		the event fired
     * @param  {object} data	the ajax data
     */
    app.handlePositionResponse = function(e, data) {
        app.updateValues(data.response);
        app._setISSVisibility(data.response.visibility);

        if (app.showHorizon) {
            app.drawHorizon(data.response.footprint);
        } else {
            app.hideHorizon();
        }

        if (app.centerMap) {
            var map = document.querySelector('#map');
            map.latitude = app.latitude;
            map.longitude = app.longitude;
        }

        app.drawSunriseSunset(data.response.solar_lat, data.response.solar_lon);

        window.setTimeout(app.getISSPosition, 2000);
    };

    /**
     * Updates the values on the model from the ajax response
     *
     * @param  {object} response  the ajax response
     */
    app.updateValues = function(response) {
        app.latitude = response.latitude;
        app.longitude = response.longitude;
        app.latitudeDisplay = app._formatNumber(response.latitude);
        app.longitudeDisplay = app._formatNumber(response.longitude);

        app.altitude = app._formatNumber(response.altitude);
        app.velocity = app._formatNumber(response.velocity);
    };

    /**
     * Calculates a number to 2dp and then formats it based on the users locale
     *
     * @param  {number} number the number to format
     * @return {number}        the formatted number
     */
    app._formatNumber = function(number) {
        var formatted = Math.round(number * 100) / 100;
        formatted = new Intl.NumberFormat().format(number);

        return formatted;
    };

    /**
     * Creates a readable String for the whether the ISS is in daylight or night
     *
     * @param {String} visibility the visibility String from the API
     */
    app._setISSVisibility = function(visibility) {
        //TODO: are there more values here?
        switch (visibility) {
            case 'daylight':
                app.visibility = 'The ISS is in daylight';
                break;
            case 'eclipsed':
                app.visibility = 'The ISS is in the Earth\'s shadow';
                break;
        }
    };

    /**
     * Draws the horizon circle on the map
     *
     * @param  {number} footprint the footprint of the ISS
     */
    app.drawHorizon = function(footprint) {
        var horizonCenter = new google.maps.LatLng(app.latitude, app.longitude);
        var horizonRadius = footprint / 2;

        if (app.distanceUnits === 'miles') {
            horizonRadius /= 0.00062137;
        } else {
            horizonRadius *= 1000;
        }

        // no custom element for a circle (yet) so let's do it the old fashioned way!
        if (typeof app.horizonCircle !== 'object') {
            app.horizonCircle = new google.maps.Circle({
                strokeColor: '#FFFFFF',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FFFFFF',
                fillOpacity: 0.3,
                map: document.querySelector('#map').map,
                center: horizonCenter,
                radius: horizonRadius
            });
        } else {
            app.horizonCircle.setMap(document.querySelector('#map').map);
            app.horizonCircle.setCenter(horizonCenter);
            app.horizonCircle.setRadius(horizonRadius);
        }
    };

    /**
     * Hides the horizon circle around the ISS
     */
    app.hideHorizon = function() {
        if (typeof app.horizonCircle === 'object') {
            app.horizonCircle.setMap(null);
        }
    };

    /**
     * Draws the sunrise/sunset line on the map
     *
     * @param  {number} solarLat  the solar latitude
     * @param  {number} solarLong the solar longitude
     */
    app.drawSunriseSunset = function(solarLat, solarLong) {
        var darkLat = solarLat * -1;
        var darkLong = solarLong - 180;

        if (typeof app.termCircle !== 'object') {
            app.termCircle = new google.maps.Circle({
                strokeColor: 'black',
                strokeOpacity: 0.1,
                strokeWeight: 5,
                fillColor: 'black',
                fillOpacity: 0.4,
                map: document.querySelector('#map').map,
                center: new google.maps.LatLng(darkLat, darkLong),
                radius: 10018790
            });
        } else {
            app.termCircle.setCenter(new google.maps.LatLng(darkLat, darkLong));
        }
    };

    /**
     * Makes an Ajax request to get the current position of the ISS.
     */
    app.getISSPosition = function() {
        var radioButtons = document.querySelector('paper-radio-group');
        var ajaxRequest = document.querySelector('#ajaxRequest');

        app.distanceUnits = radioButtons.selected;

        // what units do we want returned?
        if (app.distanceUnits === 'miles') {
            app.speedUnits = 'mph';
            ajaxRequest.url = ajaxRequest.url.replace('kilometers', 'miles');
        } else {
            app.speedUnits = 'kph';
            ajaxRequest.url = ajaxRequest.url.replace('miles', 'kilometers');
        }

        ajaxRequest.generateRequest();
    };

    app.handleTLEResponse = function(e, data) {
        var now = new Date();

        // Initialize a satellite record
        var satrec = satellite.twoline2satrec(data.response.line1, data.response.line2);

        // Propagate satellite using time since epoch (in minutes).
        var positionAndVelocity = satellite.propagate(
            satrec,
            now.getUTCFullYear(),
            now.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds()
        );

        var positionEci = positionAndVelocity.position;
        var gmst = satellite.gstimeFromDate(now.getUTCFullYear(),
            now.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds());
        // Geodetic
        var positionGd = satellite.eciToGeodetic(positionEci, gmst);
        // Geodetic coords are accessed via "longitude", "latitude".
        var longitude = positionGd.longitude;
        var latitude = positionGd.latitude;
        console.log(satellite.degreesLong(longitude));
        console.log(satellite.degreesLat(latitude));
    };

    /**
     * Shows the current time. Creates a timer to call it every 0.5s
     */
    app.showTime = function() {
        var now = new Date();
        var time = now.toUTCString();

        app.timeString = time;
        setTimeout(app.showTime, 500);
    };

    app.showTime();
}());