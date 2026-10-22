import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useTask } from "../hook/useTask";

const MemberDashboard = () => {
  const navigate = useNavigate();
  const { user, authChecked } = useSelector((state) => state.auth);

  const {
    tasks,
    loading,
    error,
    successMessage,
    handleGetMyTasks,
    handleStartTask,
    handleSubmitTask,
  } = useTask();
  useEffect(() => {
    if (!authChecked) return;

    if (!user || user.role !== "member") {
      navigate("/login", { replace: true });
      return;
    }

    handleGetMyTasks();
  }, [authChecked, user, navigate]);
  const handleStart = async (taskId) => {
    await handleStartTask(taskId);
  };

  const handleSubmit = async (taskId) => {
    await handleSubmitTask(taskId);
  };

  const statusClass = (status) => {
    const styles = {
      pending: "bg-gray-700 text-gray-200",
      "in-progress": "bg-blue-500/10 text-blue-400",
      "under-review": "bg-amber-500/10 text-amber-400",
      completed: "bg-green-500/10 text-green-400",
    };

    return styles[status] || "bg-gray-700 text-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">TaskFlow</h1>
            <p className="mt-1 text-sm text-gray-400">Member Dashboard</p>
          </div>

          <span className="rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            {user?.username || "Member"}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="text-3xl font-bold">My Tasks</h2>
        <p className="mt-2 text-gray-400">
          View your assigned tasks and update their progress.
        </p>

        {successMessage && (
          <p className="mt-6 rounded-lg bg-green-500/10 p-3 text-green-400">
            {successMessage}
          </p>
        )}

        {error && (
          <p className="mt-6 rounded-lg bg-red-500/10 p-3 text-red-400">
            {error}
          </p>
        )}

        {loading && <p className="mt-6 text-gray-400">Processing...</p>}

        {!loading && tasks.length === 0 && (
          <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-8 text-center">
            <h3 className="text-lg font-semibold">No tasks yet</h3>
            <p className="mt-2 text-gray-400">
              Tasks assigned to you will appear here.
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {tasks.map((task) => (
            <article
              key={task._id}
              className="rounded-2xl border border-gray-800 bg-gray-900 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-xl font-semibold">{task.title}</h3>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(task.status)}`}
                >
                  {task.status}
                </span>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-400">
                {task.description}
              </p>

              {task.started_at && (
                <p className="mt-4 text-xs text-gray-500">
                  Started: {new Date(task.started_at).toLocaleString()}
                </p>
              )}

              <div className="mt-6">
                {task.status === "pending" && (
                  <button
                    onClick={() => handleStart(task._id)}
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500 disabled:opacity-50"
                  >
                    Start Task
                  </button>
                )}

                {task.status === "in-progress" && (
                  <button
                    onClick={() => handleSubmit(task._id)}
                    disabled={loading}
                    className="rounded-lg bg-amber-600 px-4 py-2 font-medium hover:bg-amber-500 disabled:opacity-50"
                  >
                    Submit for Review
                  </button>
                )}

                {task.status === "under-review" && (
                  <p className="text-sm text-amber-400">
                    Your task is waiting for admin review.
                  </p>
                )}

                {task.status === "completed" && (
                  <p className="text-sm text-green-400">
                    Task completed successfully.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MemberDashboard;
