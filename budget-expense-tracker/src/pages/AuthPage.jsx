import { useState } from "react";
import axios from "../api/axios";
import {  useNavigate} from "react-router-dom";

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

   const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const endpoint = tab === "login" ? "/auth/login" : "/auth/signup";
      // Only send name for signup
      const data = tab === "login"
        ? { email: form.email, password: form.password }
        : form;
      const res = await axios.post(endpoint, data);
      setMessage("Success! " + (res.data.message || "Logged in."));
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }
      // Optionally redirect: window.location.href = "/dashboard";
    } catch (err) {
      setMessage(err.response?.data?.message || "Error!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-xs bg-white rounded p-6 shadow">
        <div className="flex mb-4">
          <button
            className={`flex-1 p-2 ${tab === "login" ? "font-bold border-b-2 border-blue-500" : "text-gray-500"}`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 p-2 ${tab === "signup" ? "font-bold border-b-2 border-blue-500" : "text-gray-500"}`}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {tab === "signup" && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full mb-3 px-3 py-2 border rounded"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-3 px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-4 px-3 py-2 border rounded"
            required
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" type="submit">
            {tab === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
        {message && <div className="mt-4 text-center text-sm text-red-600">{message}</div>}
      </div>
    </div>
  );
}
