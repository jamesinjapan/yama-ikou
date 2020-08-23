import React from "react";
import ReactDOM from "react-dom";

import AppWithGeoloc from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <AppWithGeoloc />
  </React.StrictMode>,
  rootElement
);
