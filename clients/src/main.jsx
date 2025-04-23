import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext.jsx";
import DashboardProvider from "./context/DashboardContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <DashboardProvider>
        <BrowserRouter>
          <App />
         </BrowserRouter>
      </DashboardProvider>
    </AuthProvider>
  </React.StrictMode>
);
