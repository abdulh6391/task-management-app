import { useDispatch, useSelector } from "react-redux";

import {
  addTask,
  setTasks,
  updateTask,
  setTaskLoading,
  setTaskError,
  setTaskSuccess,
  clearTaskMessages,
} from "../state/task.state";

import {
  getMembers as getMembersApi,
  createTask as createTaskApi,
  getMyTasks as getMyTasksApi,
  startTask as startTaskApi,
  submitTask as submitTaskApi,
  completeTask as completeTaskApi,
  getTasksForReview as getTasksForReviewApi,
} from "../services/task.api";

export const useTask = () => {
  const dispatch = useDispatch();

  const { tasks, loading, error, successMessage } = useSelector(
    (state) => state.task,
  );

  async function handleGetMembers() {
    try {
      dispatch(setTaskError(null));

      const data = await getMembersApi();

      return {
        success: true,
        members: data.members ?? [],
      };
    } catch (err) {
      const message =
        err.response?.data?.message || "Members fetch nahi ho sake.";

      dispatch(setTaskError(message));

      return { success: false, message, members: [] };
    }
  }

  async function handleCreateTask(formData) {
    try {
      dispatch(clearTaskMessages());
      dispatch(setTaskLoading(true));

      const data = await createTaskApi(formData);

      dispatch(addTask(data.task));
      dispatch(setTaskSuccess(data.message || "Task created successfully"));

      return { success: true, data };
    } catch (err) {
      const message =
        err.response?.data?.message || "Task create nahi ho saka.";

      dispatch(setTaskError(message));

      return { success: false, message };
    } finally {
      dispatch(setTaskLoading(false));
    }
  }

  async function handleGetMyTasks() {
    try {
      dispatch(clearTaskMessages());
      dispatch(setTaskLoading(true));

      const data = await getMyTasksApi();

      dispatch(setTasks(data.tasks ?? []));

      return { success: true, tasks: data.tasks ?? [] };
    } catch (err) {
      const message =
        err.response?.data?.message || "Tasks fetch nahi ho sake.";

      dispatch(setTaskError(message));

      return { success: false, message };
    } finally {
      dispatch(setTaskLoading(false));
    }
  }

  async function handleStatusAction(apiFunction, taskId, successText) {
    try {
      dispatch(clearTaskMessages());
      dispatch(setTaskLoading(true));

      const data = await apiFunction(taskId);

      if (data.task) {
        dispatch(updateTask(data.task));
      }

      dispatch(setTaskSuccess(data.message || successText));

      return { success: true, data };
    } catch (err) {
      const message =
        err.response?.data?.message || "Task status update nahi hua.";

      dispatch(setTaskError(message));

      return { success: false, message };
    } finally {
      dispatch(setTaskLoading(false));
    }
  }

  function handleStartTask(taskId) {
    return handleStatusAction(
      startTaskApi,
      taskId,
      "Task started successfully",
    );
  }

  function handleSubmitTask(taskId) {
    return handleStatusAction(
      submitTaskApi,
      taskId,
      "Task submitted for review",
    );
  }

  function handleCompleteTask(taskId) {
    return handleStatusAction(
      completeTaskApi,
      taskId,
      "Task completed successfully",
    );
  }

  async function handleGetTasksForReview() {
    try {
      dispatch(setTaskError(null));

      const data = await getTasksForReviewApi();

      dispatch(setTasks(data.tasks ?? []));

      return {
        success: true,
        tasks: data.tasks ?? [],
      };
    } catch (err) {
      const message =
        err.response?.data?.message || "Review tasks fetch nahi ho sake.";

      dispatch(setTaskError(message));

      return {
        success: false,
        message,
        tasks: [],
      };
    }
  }

  return {
    tasks,
    loading,
    error,
    successMessage,
    handleGetMembers,
    handleCreateTask,
    handleGetMyTasks,
    handleStartTask,
    handleSubmitTask,
    handleCompleteTask,
    handleGetTasksForReview,
  };
};
