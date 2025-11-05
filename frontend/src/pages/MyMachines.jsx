import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function MyMachines() {
  const [machines, setMachines] = useState([]);
  const [msg, setMsg] = useState("");

  const fetchMachines = async () => {
    try {
      const data = await apiRequest("/machines/owner", "GET", null, true);
      setMachines(data.machines || []);
    } catch (err) {
      console.error("Error fetching machines:", err);
      setMsg("Failed to load machines");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this machine?"))
      return;
    try {
      const res = await apiRequest(`/machines/${id}`, "DELETE", null, true);
      setMsg(res.message);
      fetchMachines();
    } catch (err) {
      setMsg(err.message);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-8 mb-8">
      <h2 className="text-3xl font-bold mb-6 text-green-700">My Machines</h2>
      {msg && <p className="text-sm text-gray-600 mb-4">{msg}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {machines.length > 0 ? (
          machines.map((m) => (
            <div key={m.id} className="bg-white p-4 rounded-xl shadow">
              <h3 className="text-xl font-semibold">{m.title}</h3>
              <p className="text-gray-600">{m.type}</p>
              <p className="text-gray-700 mt-1">{m.description}</p>
              <p className="text-gray-800 font-bold mt-2">₹{m.baseRate}/hr</p>
              <p
                className={`mt-1 font-medium ${
                  m.available ? "text-green-600" : "text-red-500"
                }`}
              >
                {m.available ? "Available" : "Unavailable"}
              </p>

              <div className="flex gap-3 mt-3">
                <Link
                  to={`/edit-machine/${m.id}`}
                  className="flex-1 bg-blue-500 hover:bg-blue-200 text-white px-3 py-1 rounded text-center"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-700">No machines added yet.</p>
        )}
      </div>
    </div>
  );
}
