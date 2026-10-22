import axios from "axios";

const taskApi = axios.create({
  baseURL: "http://localhost:3005/api",
  withCredentials: true,
});

export async function getMembers() {
  const response = await taskApi.get("/members");
  return response.data;
}

export async function createTask({ title, description, assignedTo }) {
  const response = await taskApi.post("/createtask", {
    title,
    description,
    assignedTo,
  });

  return response.data;
}

export async function getMyTasks() {
  const response = await taskApi.get("/my-task");
  return response.data;
}

export async function startTask(taskId) {
  const response = await taskApi.post(`/starttask/${taskId}`);
  return response.data;
}

export async function submitTask(taskId) {
  const response = await taskApi.post(`/submittask/${taskId}`);
  return response.data;
}

export async function completeTask(taskId) {
  const response = await taskApi.post(`/completeTask/${taskId}`);
  return response.data;
}

export async function getTasksForReview() {
  const response = await taskApi.get("/tasks-for-review");
  return response.data;
}
