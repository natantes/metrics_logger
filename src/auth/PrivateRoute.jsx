import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../state/UserContext";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  return user ? children : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
