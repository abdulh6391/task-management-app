import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.state";
import taskReducer from "../features/task/state/task.state";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
  },
});

export default store;
