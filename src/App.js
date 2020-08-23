import React, { Component } from "react";
import "./styles.css";

import { geolocated } from "react-geolocated";
import Geolocation from "./Geolocation";

import Map from "./Map";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultMapSettings: {
        zoom: 10,
        latitude: 35.7804,
        longitude: 139.669
      },
      defaultYamaRecoSettings: {
        page: 1,
        range: 30,
        type_id: 1
      },
      position: {
        longitude: null,
        latitude: null
      }
    };
  }

  hasChangedCoords(prevState) {
    if (this.props.coords) {
      return (
        this.props.coords.latitude !== prevState.position.latitude ||
        this.props.coords.longitude !== prevState.position.longitude
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.hasChangedCoords(prevState)) {
      this.setState({
        position: {
          latitude: this.props.coords.latitude,
          longitude: this.props.coords.longitude
        }
      });
    }
  }

  render() {
    return (
      <div className="App">
        <h1>Yama Ikou!</h1>
        <p>Find nearby mountains in Japan</p>
        <Geolocation {...this.props} />
        <Map
          mapSettings={this.state.defaultMapSettings}
          yamaRecoSettings={this.state.defaultYamaRecoSettings}
          position={this.state.position}
        />
      </div>
    );
  }
}

const AppWithGeoloc = geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
})(App);

export default AppWithGeoloc;
