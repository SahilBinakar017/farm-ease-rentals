import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function EditMachine() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    baseRate: "",
    available: true,
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const data = await apiRequest(`/machines/${id}`, "GET", null, true);
        setForm({
          title: data.title || "",
          description: data.description || "",
          type: data.type || "",
          baseRate: data.baseRate || "",
          available: data.available,
        });
      } catch (err) {
        setMsg("Failed to load machine details");
      }
    };
    fetchMachine();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest(`/machines/${id}`, "PUT", form, true);
      setMsg("Machine updated successfully!");
      setTimeout(() => navigate("/my-machines"), 1000);
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Edit Machine</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded"
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
          placeholder="Base Rate"
          value={form.baseRate}
          onChange={(e) => setForm({ ...form, baseRate: e.target.value })}
          className="border p-2 rounded"
        />
        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
          />
          Available
        </label>
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Update Machine
        </button>
      </form>
      {msg && <p className="mt-4 text-center text-sm text-gray-700">{msg}</p>}
    </div>
  );
}
