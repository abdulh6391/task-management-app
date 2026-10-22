import { config } from "../config/config.js";
import User from "../model/UserModel.js";
import jwt from "jsonwebtoken";

const normalizeUsername = (username) => username.trim();
const normalizeEmail = (email) => email.trim().toLowerCase();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function createInitialAdmin(req, res) {
  try {
    const setupSecret = req.get("x-admin-setup-secret");

    if (
      !process.env.ADMIN_SETUP_SECRET ||
      setupSecret !== process.env.ADMIN_SETUP_SECRET
    ) {
      return res.status(403).json({
        success: false,
        message: "Invalid setup secret",
      });
    }

    const { username, email, password } = req.body ?? {};

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required",
      });
    }

    const normalizedUsername = normalizeUsername(username);
    const normalizedEmail = normalizeEmail(email);

    const existingAdmin = await User.exists({
      role: "admin",
    });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          existingUser.role === "member"
            ? "This username or email is already registered as a Member. Admin cannot be created."
            : "Username or email already exists.",
      });
    }

    // 6. Create Admin
    const admin = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password,
      role: "admin",
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Create Admin Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Username, email, or Admin account already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body ?? {};

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required",
      });
    }

    const normalizedUsername = normalizeUsername(username);
    const normalizedEmail = normalizeEmail(email);

    // Check existing Admin and Member
    const existingUser = await User.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          existingUser.role === "admin"
            ? "This username or email belongs to an Admin. Please login."
            : "Username or email already exists.",
      });
    }

    // Do not accept role from the request.
    // Model default role will be "member".
    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password,
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      config.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "Member registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function loginUser(req, res) {
  try {
    const { identifier, password } = req.body ?? {};

    if (
      typeof identifier !== "string" ||
      typeof password !== "string" ||
      !identifier.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Username/email and password are required",
      });
    }

    const normalizedIdentifier = identifier.trim();

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: normalizedIdentifier },
        { email: normalizeEmail(normalizedIdentifier) },
      ],
    });

    console.log("Identifier:", normalizedIdentifier);
    console.log("User found:", Boolean(user));

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username/email or password",
      });
    }

    // Verify password against its stored hash
    const isPasswordCorrect = await user.comparePassword(password);
    console.log("Password matched:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid username/email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      config.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.id).select(
      "_id username email role",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please login again.",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch current user",
    });
  }
}
