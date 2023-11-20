import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./state/UserContext";
import { UnitProvider } from "./state/UnitContext"; // Import the new provider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <UnitProvider>
        <App />
      </UnitProvider>
    </UserProvider>
  </React.StrictMode>
);
