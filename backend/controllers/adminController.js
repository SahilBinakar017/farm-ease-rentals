import User from "../models/User.js";
import Machine from "../models/Machine.js";
import Booking from "../models/Booking.js";

export const getFarmers = async (req, res) => {
  try {
    const farmers = await User.findAll({ where: { role: "farmer" } });
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching farmers" });
  }
};

export const deleteFarmer = async (req, res) => {
  try {
    const { id } = req.params;
    const farmer = await User.findByPk(id);

    if (!farmer) return res.status(404).json({ message: "Farmer not found" });
    if (farmer.role !== "farmer")
      return res.status(400).json({ message: "Not a farmer" });

    await farmer.destroy();
    res.json({ message: "Farmer deleted successfully" });
  } catch (error) {
    console.error("Error deleting farmer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOwners = async (req, res) => {
  try {
    const owners = await User.findAll({ where: { role: "owner" } });
    res.json(owners);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching owners" });
  }
};

export const deleteOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await User.findByPk(id);
    if (!owner) return res.status(404).json({ message: "Owner not found" });
    if (owner.role !== "owner")
      return res.status(400).json({ message: "Not an owner" });
    await owner.destroy();
    res.json({ message: "Owner deleted successfully" });
  } catch (err) {
    console.error("Error deleting owner:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMachines = async (req, res) => {
  try {
    const machines = await Machine.findAll({
      include: [
        { model: User, as: "owner", attributes: ["id", "name", "email"] },
      ],
    });
    res.json(machines);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching machines" });
  }
};

export const deleteMachine = async (req, res) => {
  try {
    const { id } = req.params;
    const machine = await Machine.findByPk(id);
    if (!machine) return res.status(404).json({ message: "Machine not found" });
    await machine.destroy();
    res.json({ message: "Machine deleted successfully" });
  } catch (err) {
    console.error("Error deleting machine:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
        { model: Machine, as: "machine", attributes: ["id", "title", "type"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching bookings" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    await booking.destroy();
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ message: "Server error" });
  }
};
