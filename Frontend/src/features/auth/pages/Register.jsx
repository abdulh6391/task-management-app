import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/authhook";
import { useNavigate } from "react-router";

const Register = () => {
  const { handleRegisterUser } = useAuth();

  const { loading, error } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
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

    const username = formData.username.trim();
    const email = formData.email.trim();
    const password = formData.password;

    if (!username) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = "Only letters, numbers and underscores are allowed";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Include one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Include one lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Include one number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");

    if (!validateForm()) return;

    const result = await handleRegisterUser({
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
    });

    if (result.success) {
      setSuccessMessage(result.message);

      setFormData({
        username: "",
        email: "",
        password: "",
      });

      navigate("/login");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-white placeholder:text-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl sm:p-8">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">
          Create Account
        </h1>

        <p className="mb-7 text-center text-sm text-gray-400">
          Register to get started
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
          {/* Username */}
          <div className="mb-5">
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-gray-200"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              autoComplete="username"
              maxLength={30}
              className={inputClass}
            />

            {errors.username && (
              <p className="mt-2 text-sm text-red-400">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-200"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              autoComplete="email"
              className={inputClass}
            />

            {errors.email && (
              <p className="mt-2 text-sm text-red-400">{errors.email}</p>
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
              autoComplete="new-password"
              maxLength={128}
              className={inputClass}
            />

            {errors.password && (
              <p className="mt-2 text-sm text-red-400">{errors.password}</p>
            )}

            <p className="mt-2 text-xs leading-5 text-gray-400">
              At least 8 characters, including uppercase, lowercase and a
              number.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
