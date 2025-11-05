import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await apiRequest("/auth/login", "POST", form, false);
      login(data);
      setMsg("Logged in successfully!");

      setTimeout(() => {
        if (data.user.role === "owner") {
          navigate("/add-machine");
        } else {
          navigate("/machines");
        }
      }, 1000);
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-700">
        Login
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Login
        </button>
      </form>

      {msg && <p className="mt-4 text-center text-sm text-gray-700">{msg}</p>}
    </div>
  );
}
