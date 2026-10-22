
import { useDispatch } from "react-redux";
import {
  setLoading,
  setUser,
  setError,
} from "../state/auth.state";

import {
  registerUser,
  loginUser,
} from "../services/auth.api";

export const useAuth = () => {
  const dispatch = useDispatch();

  // Register user
  async function handleRegisterUser({ username, email, password }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data = await registerUser({
        username,
        email,
        password,
      });

      const user = data.user ?? data.data?.user;

      if (!user) {
        throw new Error(
          data.message || "User response mein nahi mila."
        );
      }

      dispatch(setUser(user));

      return {
        success: true,
        message: data.message || "Registration successful!",
      };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Registration failed";

      dispatch(setError(message));

      return {
        success: false,
        message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  }

  // Login user
  async function handleLoginUser({ identifier, password }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data = await loginUser({
        identifier,
        password,
      });

      const user = data.user ?? data.data?.user;

      if (!user) {
        throw new Error(
          data.message || "Login response mein user nahi mila."
        );
      }

      dispatch(setUser(user));

      return {
        success: true,
        message: data.message || "Login successful!",
        user,
      };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed";

      dispatch(setError(message));

      return {
        success: false,
        message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handleRegisterUser,
    handleLoginUser,
  };
};
