export const updateBookingStatus = (booking) => {
  const now = new Date();
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);

  if (booking.status === "cancelled") return "cancelled";

  if (now >= end) return "completed";
  if (now >= start && now < end) return "confirmed";
  if (now < start)
    return booking.status === "requested" ? "requested" : booking.status;

  return booking.status;
};
