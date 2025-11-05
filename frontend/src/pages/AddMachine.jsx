import { useState } from "react";
import { apiRequest } from "../utils/api";

export default function AddMachine() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    baseRate: "",
  });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRequest("/machines", "POST", form, true);
      setMsg(res.message || "Machine added successfully!");
      setForm({ title: "", description: "", type: "", baseRate: "" });
    } catch (err) {
      setMsg(err.message || "Error adding machine");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">
        Add a New Machine
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Machine Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="tractor">Tractor</option>
          <option value="harvester">Harvester</option>
          <option value="plough">Plough</option>
          <option value="drone">Drone</option>
        </select>

        <input
          type="number"
          placeholder="Base Rate (₹/hour)"
          value={form.baseRate}
          onChange={(e) => setForm({ ...form, baseRate: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Add Machine
        </button>
      </form>

      {msg && (
        <p className="mt-4 text-center text-sm text-gray-700 font-medium">
          {msg}
        </p>
      )}
    </div>
  );
}
