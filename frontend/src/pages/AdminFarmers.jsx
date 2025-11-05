import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

export default function AdminFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const data = await apiRequest("/admin/farmers", "GET", null, true);
        setFarmers(data);
      } catch (err) {
        console.error("Error loading farmers:", err);
      }
    };
    fetchFarmers();
  }, []);

  const openModal = (farmer) => {
    setSelectedFarmer(farmer);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedFarmer(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    try {
      await apiRequest(
        `/admin/farmers/${selectedFarmer.id}`,
        "DELETE",
        null,
        true
      );
      setFarmers((prev) => prev.filter((f) => f.id !== selectedFarmer.id));
      closeModal();
      alert("Farmer deleted successfully");
    } catch (err) {
      console.error("Error deleting farmer:", err);
      alert("Failed to delete farmer");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 mb-10 relative">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
        Farmers List
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
            {farmers.map((f) => (
              <tr key={f.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{f.id}</td>
                <td className="p-3">{f.name}</td>
                <td className="p-3">{f.email}</td>
                <td className="p-3">
                  <button
                    onClick={() => openModal(f)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {farmers.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="p-3 text-center text-gray-500 italic"
                >
                  No farmers found
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
              Delete Farmer
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">
                {selectedFarmer.name}
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
