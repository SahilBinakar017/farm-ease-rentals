import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function Machines() {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    apiRequest("/machines", "GET", null, false)
      .then(setMachines)
      .catch((err) => console.error(err.message));
  }, []);

  const imageMap = {
    tractor: "/tractor.jpg",
    harvester: "/harvester.jpg",
    drone: "/drone.jpg",
    plough: "/plough.jpg",
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 mb-8 px-4">
      <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">
        Available Machines
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {machines.length > 0 ? (
          machines.map((m) => {
            const imageSrc =
              imageMap[m.type?.toLowerCase()] || "/default-machine.jpg";
            return (
              <div
                key={m.id}
                className={`p-5 rounded-xl shadow-lg border transition transform hover:scale-105 ${
                  m.available ? "bg-white" : "bg-gray-100 opacity-70"
                }`}
              >
                {/* Machine Image */}
                <img
                  src={imageSrc}
                  alt={m.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />

                {/* Machine Info */}
                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  {m.title}
                </h3>

                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Type:</span> {m.type || "N/A"}
                </p>

                <p className="text-gray-600 mb-2 line-clamp-3">
                  {m.description || "No description provided."}
                </p>

                <p className="text-gray-900 font-bold text-lg mt-2">
                  ₹{m.baseRate}/hour
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Owner: {m.owner?.name || "Unknown"}
                </p>

                <Link
                  to={`/booking/${m.id}`}
                  className={`block mt-4 text-center py-2 rounded font-medium transition ${
                    m.available
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed pointer-events-none"
                  }`}
                >
                  {m.available ? "Book Now" : "Unavailable"}
                </Link>
              </div>
            );
          })
        ) : (
          <p className="col-span-3 text-center text-gray-500">
            No machines available at the moment.
          </p>
        )}
      </div>
    </div>
  );
}
