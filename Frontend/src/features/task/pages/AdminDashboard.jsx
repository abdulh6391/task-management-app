import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useTask } from "../hook/useTask";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, authChecked } = useSelector((state) => state.auth);

  const {
    tasks,
    loading,
    error,
    successMessage,
    handleGetMembers,
    handleCreateTask,
    handleCompleteTask,
    handleGetTasksForReview,
  } = useTask();

  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });
  useEffect(() => {
    if (!authChecked) return;

    if (!user || user.role !== "admin") {
      navigate("/login", { replace: true });
      return;
    }

    let active = true;

    const loadMembers = async () => {
      setLoadingMembers(true);

      const result = await handleGetMembers();

      if (active) {
        if (result.success) {
          setMembers(result.members);
        } else {
          setMembers([]);
          console.error("Members fetch failed:", result.message);
        }

        setLoadingMembers(false);
      }
    };

    const loadTasks = () => {
      handleGetTasksForReview();
    };

    loadMembers();
    loadTasks();

    const intervalId = setInterval(loadTasks, 5000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [authChecked, user, navigate]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await handleCreateTask({
      title: formData.title.trim(),
      description: formData.description.trim(),
      assignedTo: formData.assignedTo,
    });

    if (result.success) {
      setFormData({
        title: "",
        description: "",
        assignedTo: "",
      });
    }
  };

  const handleComplete = async (taskId) => {
    await handleCompleteTask(taskId);
  };

  const inputClass =
    "w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">TaskFlow</h1>
            <p className="mt-1 text-sm text-gray-400">Admin Dashboard</p>
          </div>

          <span className="rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            {user?.username || "Admin"}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
        <section>
          <h2 className="text-3xl font-bold">Create a Task</h2>
          <p className="mt-2 text-gray-400">
            Create a task and assign it to a team member.
          </p>

          <div className="mt-6 max-w-2xl rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:p-8">
            {successMessage && (
              <p className="mb-5 rounded-lg bg-green-500/10 p-3 text-green-400">
                {successMessage}
              </p>
            )}

            {error && (
              <p className="mb-5 rounded-lg bg-red-500/10 p-3 text-red-400">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Task Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Build login page"
                  className={inputClass}
                  maxLength={150}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the task requirements..."
                  className={`${inputClass} min-h-32 resize-y`}
                  rows={5}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Assign to Member
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className={inputClass}
                  required
                  disabled={loadingMembers || members.length === 0}
                >
                  <option value="">
                    {loadingMembers
                      ? "Loading members..."
                      : members.length === 0
                        ? "No members registered"
                        : "Select a member"}
                  </option>

                  {members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.username} ({member.email})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || loadingMembers || members.length === 0}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Processing..." : "Create Task"}
              </button>
            </form>
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-2xl font-bold">Tasks for Review</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {tasks
              .filter((task) => task.status === "under-review")
              .map((task) => (
                <article
                  key={task._id}
                  className="rounded-xl border border-gray-800 bg-gray-900 p-5"
                >
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    {task.description}
                  </p>

                  <p className="mt-3 text-sm text-amber-400">
                    Status: Under Review
                  </p>

                  <button
                    onClick={() => handleComplete(task._id)}
                    disabled={loading}
                    className="mt-4 rounded-lg bg-green-600 px-4 py-2 font-medium hover:bg-green-500 disabled:opacity-50"
                  >
                    Mark Completed
                  </button>
                </article>
              ))}

            {tasks.filter((task) => task.status === "under-review").length ===
              0 && (
              <p className="text-gray-400">
                No tasks waiting for review in the current Redux state.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
