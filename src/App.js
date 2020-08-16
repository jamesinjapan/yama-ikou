import React from "react";
import "./styles.css";
import MountainMap from "./MountainMap";

export default function App() {
  return (
    <div className="App">
      <h1>Yama Ikou!</h1>
      <p>Find nearby mountains in Japan</p>
      <MountainMap />
    </div>
  );
}
