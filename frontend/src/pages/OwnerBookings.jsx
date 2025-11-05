import { useEffect, useState, useContext } from "react";
import { apiRequest } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchOwnerBookings = async () => {
      try {
        const data = await apiRequest("/bookings/owner", "GET", null, true);
        setBookings(data);
      } catch (err) {
        console.error("Error fetching owner bookings:", err);
      }
    };
    fetchOwnerBookings();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await apiRequest(`/bookings/${id}/status`, "PUT", { status }, true);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    } catch (err) {
      console.error("Error updating booking status:", err);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "requested":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 mb-10 p-4">
      <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">
        Bookings on My Machines
      </h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">
          No bookings have been made on your machines yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-green-700">
                {b.machine?.title || "Unknown Machine"}
              </h3>
              <p className="text-gray-600">Type: {b.machine?.type || "N/A"}</p>
              <p className="text-gray-600">
                Start: {new Date(b.startTime).toLocaleString()}
              </p>
              <p className="text-gray-600">
                End: {new Date(b.endTime).toLocaleString()}
              </p>
              <p className="font-bold text-gray-800 mt-2">
                ₹{b.finalPrice?.toFixed(2)} (incl. GST)
              </p>

              <div className="mt-2 bg-gray-50 p-2 rounded-md">
                <p className="text-gray-800 ">
                  <span className="font-semibold">Rented by:</span>{" "}
                  {b.user?.name}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Email:</span> {b.user?.email}
                </p>
              </div>

              <div className="mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                    b.status
                  )}`}
                >
                  {b.status.toUpperCase()}
                </span>

                {b.status === "requested" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(b.id, "confirmed")}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(b.id, "cancelled")}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
