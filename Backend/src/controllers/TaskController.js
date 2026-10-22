import mongoose from "mongoose";
import User from "../model/UserModel.js";
import Task from "../model/TaskModel.js";
import AuditLog from "../model/auditLogSchema.js";

//Task created by admin
export async function createTask(req, res) {
  try {
    const admin = req.user.id;

    const { title, description, assignedTo } = req.body;

    // 1. Required fields check
    if (!title?.trim() || !description?.trim() || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Title, description and assignedTo are required",
      });
    }

    // 2. Validate MongoDB ID
    if (!mongoose.isValidObjectId(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignedTo user ID",
      });
    }

    // 3. Find member
    const member = await User.findById(assignedTo);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found",
      });
    }

    // 4. Check role
    if (member.role !== "member") {
      return res.status(403).json({
        success: false,
        message: "Task can only be assigned to a member",
      });
    }

    // 5. Create task
    const task = await Task.create({
      title: title.trim(),
      description: description.trim(),
      createdBy: admin,
      assignedTo: member._id,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    console.error("Create task error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

//Task start by member
export async function startTask(req, res) {
  try {
    const taskId = req.params.taskId;
    const member = req.user.id;

    if (!mongoose.isValidObjectId(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Task ID",
      });
    }

    const task = await Task.findOne({
      _id: taskId,
      assignedTo: member,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not Found",
      });
    }

    if (task.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only Pending Task can Start",
      });
    }

    task.status = "in-progress";
    task.started_at = new Date();

    await task.save();

    return res.status(200).json({
      success: false,
      message: "Task Started SuccessFully",
      task,
    });
  } catch (err) {
    console.log("Start Task Error", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
export async function submitTask(req, res) {
  try {
    const { taskId } = req.params;
    const member = req.user.id;

    if (!mongoose.isValidObjectId(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Task ID",
      });
    }

    const task = await Task.findOne({
      _id: taskId,
      assignedTo: member,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or not assigned to you",
      });
    }

    if (task.status !== "in-progress") {
      return res.status(400).json({
        success: false,
        message: "Only in-progress tasks can be submitted",
      });
    }

    const previousStatus = task.status;
    const submittedTime = new Date();

    task.status = "under-review";
    task.submitted_at = submittedTime;

    await task.save();

    await AuditLog.create({
      task_id: task._id,
      changed_by: member,
      from_status: previousStatus,
      to_status: task.status,
      changed_at: submittedTime,
    });

    return res.status(200).json({
      success: true,
      message: "Task submitted for review successfully",
      task,
    });
  } catch (err) {
    console.error("Task submission error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
export async function completeTask(req, res) {
  try {
    const { taskId } = req.params;
    const admin = req.user.id;

    if (!mongoose.isValidObjectId(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Task ID",
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.status !== "under-review") {
      return res.status(400).json({
        success: false,
        message: "Only tasks under review can be completed",
      });
    }

    const previousStatus = task.status;
    const completedTime = new Date();

    task.status = "completed";
    task.completed_at = completedTime;

    await task.save();

    await AuditLog.create({
      task_id: task._id,
      changed_by: admin,
      from_status: previousStatus,
      to_status: task.status,
      changed_at: completedTime,
    });

    return res.status(200).json({
      success: true,
      message: "Task completed successfully",
      task,
    });
  } catch (err) {
    console.error("Complete task error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getMyTask(req, res) {
  const member = req.user.id;

  const tasks = await Task.find({
    assignedTo: member,
  }).sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    message: "My tasks fetched SuccessFully",
    totalTasks: tasks.length,
    tasks,
  });
}

export async function getAllMembers(req, res) {
  try {
    const members = await User.find({ role: "member" })
      .select("_id username email")
      .sort({ username: 1 });

    return res.status(200).json({
      success: true,
      members,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch members",
    });
  }
}

export async function getTasksForReview(req, res) {
  try {
    const tasks = await Task.find({
      status: "under-review",
    })
      .populate("assignedTo", "username email")
      .populate("createdBy", "username email")
      .sort({ submitted_at: -1 });

    return res.status(200).json({
      success: true,
      message: "Tasks for review fetched successfully",
      totalTasks: tasks.length,
      tasks,
    });
  } catch (err) {
    console.error("Get tasks for review error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks for review",
    });
  }
}
