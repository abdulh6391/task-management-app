import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  successMessage: null,
  authChecked: false,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },

    addTask: (state, action) => {
      state.tasks.unshift(action.payload);
    },

    updateTask: (state, action) => {
      const updatedTask = action.payload;

      const index = state.tasks.findIndex(
        (task) => task._id === updatedTask._id,
      );

      if (index !== -1) {
        state.tasks[index] = updatedTask;
      } else {
        state.tasks.unshift(updatedTask);
      }
    },

    setTaskLoading: (state, action) => {
      state.loading = action.payload;
    },

    setTaskError: (state, action) => {
      state.error = action.payload;
    },

    setTaskSuccess: (state, action) => {
      state.successMessage = action.payload;
    },

    clearTaskMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setAuthChecked: (state, action) => {
      state.authChecked = action.payload;
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  setTaskLoading,
  setTaskError,
  setTaskSuccess,
  clearTaskMessages,
  setAuthChecked
} = taskSlice.actions;

export default taskSlice.reducer;
