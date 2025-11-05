import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function Booking() {
  const { id } = useParams();
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });
  const [availableHours, setAvailableHours] = useState([]);
  const [endOptions, setEndOptions] = useState([]);
  const [msg, setMsg] = useState("");
  const [response, setResponse] = useState(null);

  const hours = Array.from({ length: 16 }, (_, i) => i + 6);
  const formatHour = (h) => `${String(h).padStart(2, "0")}:00`;

  // Populate start time options (6AM–9PM, but skip past hours today)
  useEffect(() => {
    const now = new Date();
    let hour = now.getHours() + 1;
    if (now.getMinutes() > 0) hour += 1;
    const minHour = Math.max(hour, 6);
    const futureHours = hours.filter((h) => h >= minHour && h <= 21);
    setAvailableHours(futureHours);
  }, []);

  // Adjust end time options dynamically
  useEffect(() => {
    if (!form.startTime) return;
    const startHour = parseInt(form.startTime.split(":")[0]);
    let nextHour = startHour + 1;

    const nextDayHours = [];
    if (nextHour > 21) {
      for (let h = 6; h <= 21; h++) nextDayHours.push(h);
      setEndOptions(nextDayHours);
    } else {
      const sameDayHours = [];
      for (let h = nextHour; h <= 21; h++) sameDayHours.push(h);
      setEndOptions(sameDayHours);
    }
  }, [form.startTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const startDate = new Date(`${form.date}T${form.startTime}`);
      const endDate = new Date(`${form.date}T${form.endTime}`);
      if (endDate <= startDate) endDate.setDate(endDate.getDate() + 1);

      const data = await apiRequest("/bookings", "POST", {
        machineId: id,
        startTime: startDate,
        endTime: endDate,
      });

      setResponse(data.booking);
      setMsg("Booking successful!");
    } catch (err) {
      setMsg(err.message);
    }
  };

  const closeModal = () => {
    setResponse(null);
    setMsg("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow relative">
      <h2 className="text-2xl font-bold mb-4 text-center">Book Machine</h2>

      <form onSubmit={handleBook} className="flex flex-col gap-4">
        <label className="font-semibold">Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="border p-2 rounded"
          min={new Date().toISOString().split("T")[0]}
        />

        <label className="font-semibold">Start Time</label>
        <select
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Select Start Time</option>
          {availableHours.map((h) => (
            <option key={h} value={formatHour(h)}>
              {formatHour(h)}
            </option>
          ))}
        </select>

        <label className="font-semibold">End Time</label>
        <select
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          required
          className="border p-2 rounded"
          disabled={!form.startTime}
        >
          <option value="">Select End Time</option>
          {endOptions.map((h) => (
            <option key={h} value={formatHour(h)}>
              {formatHour(h)}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Confirm Booking
        </button>
      </form>

      {msg && !response && (
        <p className="mt-4 text-center text-sm text-gray-700 font-medium">
          {msg}
        </p>
      )}

      {response && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-[32rem] relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-lg font-bold"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4 text-green-700 text-center">
              Booking Summary
            </h3>
            <div className="text-sm text-gray-800 space-y-1">
              <p>Machine ID: {response.machineId}</p>
              <p>
                Start Time:{" "}
                {new Date(response.startTime).toLocaleString("en-IN")}
              </p>
              <p>
                End Time: {new Date(response.endTime).toLocaleString("en-IN")}
              </p>
              <p>Base Price: ₹{response.basePrice}</p>
              <p>Dynamic Price: ₹{response.dynamicPrice}</p>
              <p>GST: ₹{response.gst}</p>
              <p className="font-semibold text-lg">
                Final Price: ₹{response.finalPrice}
              </p>
              <p>Status: {response.status}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
