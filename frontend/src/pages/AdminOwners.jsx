import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

export default function AdminOwners() {
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const data = await apiRequest("/admin/owners", "GET", null, true);
        setOwners(data);
      } catch (err) {
        console.error("Error loading owners:", err);
      }
    };
    fetchOwners();
  }, []);

  const openModal = (owner) => {
    setSelectedOwner(owner);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedOwner(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    try {
      await apiRequest(
        `/admin/owners/${selectedOwner.id}`,
        "DELETE",
        null,
        true
      );
      setOwners((prev) => prev.filter((o) => o.id !== selectedOwner.id));
      closeModal();
      alert("Owner deleted successfully");
    } catch (err) {
      console.error("Error deleting owner:", err);
      alert("Failed to delete owner");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 mb-10 relative">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
        Owners List
      </h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {owners.map((o) => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{o.id}</td>
                <td className="p-3">{o.name}</td>
                <td className="p-3">{o.email}</td>
                <td className="p-3">
                  <button
                    onClick={() => openModal(o)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {owners.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="p-3 text-center text-gray-500 italic"
                >
                  No owners found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Delete Owner
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">
                {selectedOwner.name}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
