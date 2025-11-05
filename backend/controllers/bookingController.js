import Booking from "../models/Booking.js";
import Machine from "../models/Machine.js";
import User from "../models/User.js";
import { calculateDynamicPrice } from "../services/pricingService.js";
import { updateBookingStatus } from "../utils/updateBookingStatus.js";

export const createBooking = async (req, res) => {
  try {
    const { machineId, startTime, endTime } = req.body;

    if (!machineId || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const machine = await Machine.findByPk(machineId);
    if (!machine) return res.status(404).json({ message: "Machine not found" });

    const { basePrice, dynamicPrice, gst, finalPrice, mlPrice } =
      await calculateDynamicPrice(machine, startTime, endTime);

    const booking = await Booking.create({
      userId: req.user.id,
      machineId,
      startTime,
      endTime,
      basePrice,
      dynamicPrice,
      gst,
      finalPrice,
    });

    res.status(201).json({
      message: "Booking created",
      mlPriceUsed: mlPrice > 0,
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [{ model: Machine, as: "machine" }],
      order: [["createdAt", "DESC"]],
    });

    const now = new Date();

    for (const booking of bookings) {
      const newStatus = updateBookingStatus(booking);
      if (newStatus !== booking.status) {
        booking.status = newStatus;
        await booking.save();
      }
    }

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOwnerBookings = async (req, res) => {
  try {
    console.log("Owner ID:", req.user?.id);

    const bookings = await Booking.findAll({
      include: [
        {
          model: Machine,
          as: "machine",
          where: { ownerId: req.user.id },
          attributes: ["id", "title", "type"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching owner bookings:", error);
    res.status(500).json({ message: error.message });
  }
};

export const changeBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByPk(id, {
      include: [{ model: Machine, as: "machine" }],
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.machine.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const allowedStatuses = ["requested", "confirmed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: "Booking status updated successfully", booking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
