// PublicOnlyRoute.jsx
// import React from "react";
// import { Navigate } from "react-router-dom";

// const PublicOnlyRoute = ({ children }) => {
//   const accessToken = localStorage.getItem("access_token");
//   return accessToken ? <Navigate to="/home" /> : children;
// };

// export default PublicOnlyRoute;


import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../Utils/AxiosInstance";

const PublicOnlyRoute = ({ children }) => {
  const [redirectPath, setRedirectPath] = useState(null);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await axiosInstance.get("http://localhost:8000/api/users/get_user_info/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const role = res.data.role;

        if (role === "seller") setRedirectPath("/sellerpage");
        // else if (role === "admin") setRedirectPath("/adminpage");
        else setRedirectPath("/home");
      } catch (err) {
        console.error("Error fetching user role", err);
        setRedirectPath(null);
      }
    };

    if (accessToken) {
      fetchUserRole();
    }
  }, [accessToken]);

  if (accessToken && redirectPath) {
    return <Navigate to={redirectPath} />;
  }

  return !accessToken ? children : null; // Show nothing while loading
};

export default PublicOnlyRoute;