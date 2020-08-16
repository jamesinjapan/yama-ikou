import React, { Component } from "react";
import { Map as LeafletMap, Marker, Popup, TileLayer } from "react-leaflet";
import * as mockData from "./mockData.json";
import { Icon } from "leaflet";

const MountainIcon = new Icon({
  iconUrl: "/mountain_icon.svg",
  iconSize: [25, 25]
});

class MountainMap extends Component {
  constructor(props) {
    super(props);
    this.state = { position: null, zoom: 10 };
  }

  componentDidMount() {
    const setLocation = async () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log([position.coords.longitude, position.coords.latitude]);
          this.setState({
            position: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
        },
        (err) => console.log(err)
      );
    };

    setLocation();
  }

  getCenter() {
    return [this.state.position.lat, this.state.position.lng];
  }

  setActiveMountain(activeMountain) {
    this.setState({ activeMountain: activeMountain });
  }

  fetchData() {
    fetch("https://api.github.com/users/hacktivist123/repos")
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  render() {
    if (this.state.position) {
      return (
        <LeafletMap center={this.getCenter()} zoom={this.state.zoom}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {mockData.poilist.map((mountain) => (
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
      );
    } else {
      return (
        <div className="MountainMap">
          <p>Loading...</p>
        </div>
      );
    }
  }
}

export default MountainMap;
