import express from "express";
import {
  createInitialAdmin,
  getCurrentUser,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
import {
  createUserValidator,
  loginValidator,
  validateRequest,
} from "../validator/authValidator.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { getAllMembers } from "../controllers/TaskController.js";

const router = express.Router();

router.post("/register", createUserValidator, validateRequest, registerUser);
router.post("/login", loginValidator, validateRequest, loginUser);

router.post("/setup-admin", createInitialAdmin);

router.get(
  "/admin-dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to Admin Dashboard",
    });
  },
);

router.get(
  "/member-dashboard",
  authMiddleware,
  roleMiddleware("member"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to Member Dashboard",
    });
  },
);

router.get("/members", authMiddleware, roleMiddleware("admin"), getAllMembers);
router.get("/me", authMiddleware, getCurrentUser);
export default router;
