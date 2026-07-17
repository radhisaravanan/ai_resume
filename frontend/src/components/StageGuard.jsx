import React from "react";
import { Navigate } from "react-router-dom";

const STAGE_ROUTES = {
  1: "/register",
  2: "/login",
  3: "/resume",
  4: "/permissions",
  5: "/dashboard",
  6: "/interview",
  7: "/report",
};

export const StageGuard = ({ children, requiredStage }) => {
  const userToken = localStorage.getItem("auth_token");

  // Login mattum Register-ku token thevai illai
  if (requiredStage > 2 && !userToken) {
    return <Navigate to="/login" replace />;
  }

  const highestCompletedStage = parseInt(
    localStorage.getItem("highest_stage") || "1",
    10,
  );

  // User sequential sequence-ai thaandi jump panna thadukkum
  if (requiredStage > highestCompletedStage) {
    return (
      <Navigate to={STAGE_ROUTES[highestCompletedStage] || "/login"} replace />
    );
  }

  return children;
};
