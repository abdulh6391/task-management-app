import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/authhook";
import { useNavigate } from "react-router";

const Login = () => {
  const { handleLoginUser } = useAuth();
  const { loading, error } = useSelector((state) => state.auth);

  const navigate=useNavigate()

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setSuccessMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = "Email or username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccessMessage("");

  if (!validateForm()) return;

  const result = await handleLoginUser({
    identifier: formData.identifier.trim(),
    password: formData.password,
  });

  if (result.success) {
    if (result.user.role === "admin") {
      navigate("/admin", { replace: true });
    } else if (result.user.role === "member") {
      navigate("/member", { replace: true });
    }
  }
};


  const inputClass =
    "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-white placeholder:text-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl sm:p-8">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">
          Welcome Back
        </h1>

        <p className="mb-7 text-center text-sm text-gray-400">
          Login to your account
        </p>

        {error && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email or Username */}
          <div className="mb-5">
            <label
              htmlFor="identifier"
              className="mb-2 block text-sm font-medium text-gray-200"
            >
              Email or Username
            </label>

            <input
              id="identifier"
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter email or username"
              autoComplete="username"
              className={inputClass}
            />

            {errors.identifier && (
              <p className="mt-2 text-sm text-red-400">{errors.identifier}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-200"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              autoComplete="current-password"
              className={inputClass}
            />

            {errors.password && (
              <p className="mt-2 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
