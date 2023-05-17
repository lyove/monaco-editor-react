import React from "react";
import ReactDOM from "react-dom";

import App from "./demo";

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback="Loading">
      <App />
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById("root"),
);
