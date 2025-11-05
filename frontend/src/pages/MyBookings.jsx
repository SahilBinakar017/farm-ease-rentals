import { useEffect, useState, useContext } from "react";
import { apiRequest } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await apiRequest("/bookings/my", "GET");
        setBookings(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 mb-10 p-4">
      <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">
        My Bookings
      </h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">You have no bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
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
              <p
                className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  b.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : b.status === "completed"
                    ? "bg-blue-100 text-blue-700"
                    : b.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {b.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
