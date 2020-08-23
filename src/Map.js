import React, { Component } from "react";

import { Map as LeafletMap, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";

const MountainIcon = new Icon({
  iconUrl: "/mountain_icon.svg",
  iconSize: [25, 25]
});

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapSettings: props.mapSettings,
      yamaRecoSettings: props.yamaRecoSettings,
      position: props.position
    };
  }

  hasChangedCoords(prevState) {
    if (this.props.position) {
      return (
        this.props.position.latitude !== prevState.position.latitude ||
        this.props.position.longitude !== prevState.position.longitude
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.hasChangedCoords(prevState)) {
      this.setState({
        position: {
          latitude: this.props.position.latitude,
          longitude: this.props.position.longitude
        }
      });
      this.updateData();
    }
  }

  latitude() {
    if (this.state.position && this.state.position.latitude) {
      return this.state.position.latitude;
    }

    return this.state.mapSettings.latitude;
  }

  longitude() {
    if (this.state.position && this.state.position.longitude) {
      return this.state.position.longitude;
    }

    return this.state.mapSettings.longitude;
  }

  updateData() {
    const params = {
      lon: this.longitude(),
      lat: this.latitude(),
      ...this.state.yamaRecoSettings
    };

    const urlParameters = Object.entries(params)
      .map((e) => e.join("="))
      .join("&");

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: urlParameters
    };

    fetch(
      "https://cors-anywhere.herokuapp.com/https://api.yamareco.com/api/v1/nearbyPoi",
      requestOptions
    )
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }

        // check for bad data response
        if (data.err) {
          return Promise.reject(data);
        }

        this.setState({ mountains: data.poilist });
      })
      .catch((error) => {
        this.setState({ errorMessage: error.toString() });
        console.error("There was an error!", error);
      });
  }

  getCenter() {
    return [this.latitude(), this.longitude()];
  }

  setActiveMountain(activeMountain) {
    this.setState({ activeMountain: activeMountain });
  }

  render() {
    return (
      <div className="Map">
        <table>
          <thead>
            <tr>
              <th colSpan="2">Map Location</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>latitude</td>
              <td>{this.latitude()}</td>
            </tr>
            <tr>
              <td>longitude</td>
              <td>{this.longitude()}</td>
            </tr>
            <tr>
              <td>zoom</td>
              <td>{this.state.mapSettings.zoom}</td>
            </tr>
          </tbody>
        </table>
        <LeafletMap
          center={this.getCenter()}
          zoom={this.state.mapSettings.zoom}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {this.state.mountains &&
            this.state.mountains.map((mountain) => (
              <Marker
                key={mountain.ptid}
                position={[mountain.lat, mountain.lon]}
                icon={MountainIcon}
                onClick={() => {
                  this.setActiveMountain(mountain);
                }}
              />
            ))}

          {this.state.activeMountain && (
            <Popup
              position={[
                this.state.activeMountain.lat,
                this.state.activeMountain.lon
              ]}
              onClose={() => {
                this.setActiveMountain(null);
              }}
            >
              <div>
                <h2>{this.state.activeMountain.name}</h2>
                {this.state.activeMountain.name_en !== "Mt. " && (
                  <p>English Name: {this.state.activeMountain.name_en}</p>
                )}
                {this.state.activeMountain.elevation > 0 && (
                  <p>Elevation: {this.state.activeMountain.elevation} m</p>
                )}
                <p>
                  Distance:{" "}
                  {parseFloat(this.state.activeMountain.distance).toFixed(1)} km
                </p>
                {this.state.activeMountain.detail && (
                  <p>Additional Details: {this.state.activeMountain.detail}</p>
                )}
                {this.state.activeMountain.photo_url && (
                  <img
                    width="100%"
                    src={this.state.activeMountain.photo_url}
                    alt={this.state.activeMountain.name}
                  />
                )}
              </div>
            </Popup>
          )}
        </LeafletMap>
      </div>
    );
  }
}

export default Map;
