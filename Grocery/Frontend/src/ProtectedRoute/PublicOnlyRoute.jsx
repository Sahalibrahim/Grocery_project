// PublicOnlyRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PublicOnlyRoute = ({ children }) => {
  const accessToken = localStorage.getItem("access_token");
  return accessToken ? <Navigate to="/home" /> : children;
};

export default PublicOnlyRoute;
