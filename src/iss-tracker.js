import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@em-polymer/google-map/google-map.js';
import '@em-polymer/google-map/google-map-marker.js';

import { twoline2satrec, propagate, gstime, eciToGeodetic, degreesLat, degreesLong } from 'satellite.js';

class IssTracker extends PolymerElement {
  static get is() { return 'iss-tracker'; }

  static get template() {
    return html`
      <style>
        .data-section {
          background-color: white;
          bottom: 25px;
          margin: 0 auto;
          padding: 25px;
          position: absolute;
          right: 25px;
          z-index: 1;
        }

        .data-section span {
          display: block;
        }

        #map {
          height: 100vh;
        }
      </style>

      <iron-ajax auto url="https://api.wheretheiss.at/v1/satellites/25544?units=miles" handle-as="json" on-response="handlePositionResponse"
        id="ajaxRequest"></iron-ajax>
      <iron-ajax auto url="https://api.wheretheiss.at/v1/satellites/25544/tles" handle-as="json" on-response="handleTLEResponse></iron-ajax>

      <div id="map"></div>

      <paper-card class="data-section">
        <paper-checkbox checked="{{centerMap}>Center map</paper-checkbox>

        <h2>{{satelliteName}</h2>
        <span>{{timeString}</span>
        <span>Latitude: {{latitudeDisplay}&deg;</span>
        <span>Longitude: {{longitudeDisplay}&deg;</span>
        <span>Altitude: {{altitude} {{distanceUnits}</span>
        <span>Velocity: {{velocity} {{speedUnits}</span>
        <span>{{visibility}</span>

        <paper-radio-group selected="miles" id="unitsSelector">
          <paper-radio-button name="miles">miles</paper-radio-button>
          <paper-radio-button name="kilometers">kilometers</paper-radio-button>
        </paper-radio-group>
      </paper-card>
    `;
  }

  constructor() {
    super();
    this.distanceUnits = 'miles';
    this.speedUnits = 'mph';
    this.horizonCircle = undefined;
    this.showHorizon = true;
    this.centerMap = true;
    this.termCircle = undefined;
  }

  /**
   * Handle the ajax response
   *
   * @param  {object} e  		the event fired
   * @param  {object} data	the ajax data
   */
  handlePositionResponse(event) {
    const data = event.detail;
    this.updateValues(data.response);
    this._setISSVisibility(data.response.visibility);
    if (this.showHorizon) {
      this.drawHorizon(data.response.footprint);
    } else {
      this.hideHorizon();
    }
    if (this.centerMap) {
      const map = this.$.map;
      map.latitude = this.latitude;
      map.longitude = this.longitude;
    }
    this.drawSunriseSunset(data.response.solar_lat, data.response.solar_lon);
    setTimeout(this.getISSPosition.bind(this), 2000);
  }

  /**
   * Updates the values on the model from the ajax response
   *
   * @param  {object} response  the ajax response
   */
  updateValues(response) {
    this.latitude = response.latitude;
    this.longitude = response.longitude;
    this.latitudeDisplay = this._formatNumber(response.latitude);
    this.longitudeDisplay = this._formatNumber(response.longitude);
    this.altitude = this._formatNumber(response.altitude);
    this.velocity = this._formatNumber(response.velocity);
  }

  /**
   * Calculates a number to 2dp and then formats it based on the users locale
   *
   * @param  {number} number the number to format
   * @return {number}        the formatted number
   */
  _formatNumber(number) {
    let formatted = Math.round(number * 100) / 100;
    formatted = new Intl.NumberFormat().format(number);
    return formatted;
  }

  /**
   * Creates a readable String for the whether the ISS is in daylight or night
   *
   * @param {String} visibility the visibility String from the API
   */
  _setISSVisibility(visibility) {
    //TODO: are there more values here?
    switch (visibility) {
      case 'daylight':
        this.visibility = 'The ISS is in daylight';
        break;
      case 'eclipsed':
        this.visibility = 'The ISS is in the Earth\'s shadow';
        break;
    }
  }

  /**
   * Draws the horizon circle on the map
   *
   * @param  {number} footprint the footprint of the ISS
   */
  drawHorizon(footprint) {
    const horizonCenter = new google.maps.LatLng(this.latitude, this.longitude);
    let horizonRadius = footprint / 2;
    if (this.distanceUnits === 'miles') {
      horizonRadius /= 0.00062137;
    } else {
      horizonRadius *= 1000;
    }
    // no custom element for a circle (yet) so let's do it the old fashioned way!
    if (typeof this.horizonCircle !== 'object') {
      this.horizonCircle = new google.maps.Circle({
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.8,
        strokeWeight: 2,          fillColor: '#FFFFFF',
        fillOpacity: 0.3,
        map: this.$.map.map,
        center: horizonCenter,
        radius: horizonRadius
      });
    } else {
      this.horizonCircle.setMap(this.$.map.map);
      this.horizonCircle.setCenter(horizonCenter);
      this.horizonCircle.setRadius(horizonRadius);
    }
  }

  /**
   * Hides the horizon circle around the ISS
   */
  hideHorizon() {
    if (typeof this.horizonCircle === 'object') {
      this.horizonCircle.setMap(null);
    }
  };

  /**
   * Draws the sunrise/sunset line on the map
   *
   * @param  {number} solarLat  the solar latitude
   * @param  {number} solarLong the solar longitude
   */
  drawSunriseSunset(solarLat, solarLong) {
    const darkLat = solarLat * -1;
    const darkLong = solarLong - 180;
    if (typeof this.termCircle !== 'object') {
      this.termCircle = new google.maps.Circle({
        strokeColor: 'black',
        strokeOpacity: 0.1,
        strokeWeight: 5,
        fillColor: 'black',
        fillOpacity: 0.4,
        map: this.$.map.map,
        center: new google.maps.LatLng(darkLat, darkLong),
        radius: 10018790
      });
    } else {
      this.termCircle.setCenter(new google.maps.LatLng(darkLat, darkLong));
    }
  }

  /**
   * Makes an Ajax request to get the current position of the ISS.
   */
  getISSPosition() {
    const radioButtons = this.$.unitsSelector;
    const ajaxRequest = this.$.ajaxRequest;
    this.distanceUnits = radioButtons.selected;
    // what units do we want returned?
    if (this.distanceUnits === 'miles') {
      this.speedUnits = 'mph';
      ajaxRequest.url = ajaxRequest.url.replace('kilometers', 'miles');
    } else {
      this.speedUnits = 'kph';
      ajaxRequest.url = ajaxRequest.url.replace('miles', 'kilometers');
    }
    ajaxRequest.generateRequest();
  }

  handleTLEResponse(data) {
    const now = new Date();
    // Initialize a satellite record
    const satrec = twoline2satrec(data.response.line1, data.response.line2);
    // Propagate satellite using time since epoch (in minutes).
    const positionAndVelocity = propagate(satrec, new Date());
    const positionEci = positionAndVelocity.position;
    const gmst = gstime(new Date());
    // Geodetic
    const positionGd = eciToGeodetic(positionEci, gmst);
    // Geodetic coords are accessed via "longitude", "latitude".
    const longitude = positionGd.longitude;
    const latitude = positionGd.latitude;
    console.log(degreesLong(longitude));
    console.log(degreesLat(latitude));
  }

  /**
   * Shows the current time. Creates a timer to call it every 0.5s
   */
  showTime() {
    const now = new Date();
    const time = now.toUTCString();
    this.timeString = time;
    setTimeout(this.showTime, 500);
  }
}

window.customElements.define(IssTracker.is, IssTracker);
