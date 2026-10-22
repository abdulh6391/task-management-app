import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router";
import { routes } from "./app.routes";

import { setUser, setAuthChecked } from "../features/auth/state/auth.state";
import { getCurrentUser } from "../features/auth/services/auth.api";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await getCurrentUser();

        console.log("Current user:", data.user);
        dispatch(setUser(data.user));
      } catch (error) {
        console.error(
          "Auth restore failed:",
          error.response?.status,
          error.response?.data || error.message,
        );

        dispatch(setUser(null));
      } finally {
        dispatch(setAuthChecked(true));
      }
    }

    checkAuth();
  }, [dispatch]);

  return <RouterProvider router={routes} />;
};

export default App;
