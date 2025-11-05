import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await apiRequest("/admin/bookings", "GET", null, true);
        setBookings(data);
      } catch (err) {
        console.error("Error loading bookings:", err);
      }
    };
    fetchBookings();
  }, []);

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    try {
      await apiRequest(
        `/admin/bookings/${selectedBooking.id}`,
        "DELETE",
        null,
        true
      );
      setBookings((prev) => prev.filter((b) => b.id !== selectedBooking.id));
      closeModal();
      alert("Booking deleted successfully");
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 mb-10 relative">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
        All Bookings
      </h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Machine</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Start</th>
              <th className="p-3 text-left">End</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{b.id}</td>
                <td className="p-3">{b.machine?.title || "N/A"}</td>
                <td className="p-3">{b.user?.name || "N/A"}</td>
                <td className="p-3">
                  {new Date(b.startTime).toLocaleString()}
                </td>
                <td className="p-3">{new Date(b.endTime).toLocaleString()}</td>
                <td className="p-3 capitalize">{b.status}</td>
                <td className="p-3">
                  <button
                    onClick={() => openModal(b)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="p-3 text-center text-gray-500 italic"
                >
                  No bookings found
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
              Delete Booking
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete booking ID{" "}
              <span className="font-semibold text-red-600">
                #{selectedBooking.id}
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
