import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import {
  completeTask,
  createTask,
  getMyTask,
  getTasksForReview,
  startTask,
  submitTask,
} from "../controllers/TaskController.js";

const router = express.Router();

router.post("/createtask", authMiddleware, roleMiddleware("admin"), createTask);



router.post(
  "/starttask/:taskId",
  authMiddleware,
  roleMiddleware("member"),
  startTask,
);

router.post(
  "/submittask/:taskId",
  authMiddleware,
  roleMiddleware("member"),
  submitTask,
);

router.post(
  "/completeTask/:taskId",
  authMiddleware,
  roleMiddleware("admin"),
  completeTask,
);

router.get("/my-task",authMiddleware,getMyTask)

router.get(
  "/tasks-for-review",
  authMiddleware,
  roleMiddleware("admin"),
  getTasksForReview
);
export default router;
