import React from "react";
import { Navigate, RouteObject } from "react-router-dom";
import Home from "./containers/Home/home";
import Register from "./containers/Authentication/register";
import Login from "./containers/Authentication/login";
import ProfileCreation from "./containers/User/profileCreation";
import ChallengeComponent from "./containers/challenge/challenge";
import ChallengeRoom from "./containers/challenge/challengeRoom";
import { isAuth } from "./utility/helper";

// PrivateRoute component
const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  return isAuth() ? <>{element}</> : <Navigate to="/" />;
};

// Define routes with proper typing
const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/home", element: <Home /> },
  { path: "/authenticate/register", element: <Register /> },
  { path: "/authenticate/login", element: <Login /> },
  {
    path: "/user/createmyprofile",
    element: <PrivateRoute element={<ProfileCreation />} />,
  },
  { path: "/challenge", element: <ChallengeComponent /> },
  { path: "/challenge/:id", element: <ChallengeRoom /> }, // New route
];

export default routes;
