import { createBrowserRouter, Navigate } from "react-router";

import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import AdminDashboard from "../features/task/pages/AdminDashboard";
import MemberDashboard from "../features/task/pages/memberDashboard";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/member",
    element: <MemberDashboard />,
  },
]);
