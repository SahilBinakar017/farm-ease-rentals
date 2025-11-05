import Machine from "../models/Machine.js";
import User from "../models/User.js";

// Create new machine
export const addMachine = async (req, res) => {
  try {
    const { title, description, type, baseRate } = req.body;

    if (!title || !baseRate) {
      return res
        .status(400)
        .json({ message: "Missing fields: title or baseRate" });
    }

    const machine = await Machine.create({
      title,
      description,
      type,
      baseRate,
      ownerId: req.user.id,
    });

    res.status(201).json({
      message: "Machine added successfully",
      machine,
    });
  } catch (error) {
    console.error("Error adding machine:", error);
    res.status(500).json({ message: "Server error while adding machine" });
  }
};

// Get all machines
export const getAllMachines = async (req, res) => {
  try {
    const machines = await Machine.findAll({
      include: [
        { model: User, as: "owner", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(machines);
  } catch (error) {
    console.error("Error fetching machines:", error);
    res.status(500).json({ message: "Server error while fetching machines" });
  }
};

// Get machine by ID
export const getMachineById = async (req, res) => {
  try {
    const machine = await Machine.findByPk(req.params.id, {
      include: [
        { model: User, as: "owner", attributes: ["id", "name", "email"] },
      ],
    });

    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    res.status(200).json(machine);
  } catch (error) {
    console.error("Error fetching machine:", error);
    res.status(500).json({ message: "Server error while fetching machine" });
  }
};

// Update machine details (only by owner)
export const updateMachine = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, baseRate, available } = req.body;

    const machine = await Machine.findByPk(id);

    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    // Only owner can update
    if (machine.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this machine" });
    }

    machine.title = title || machine.title;
    machine.description = description || machine.description;
    machine.type = type || machine.type;
    machine.baseRate = baseRate || machine.baseRate;
    machine.available = available ?? machine.available;

    await machine.save();

    res.status(200).json({
      message: "Machine updated successfully",
      machine,
    });
  } catch (error) {
    console.error("Error updating machine:", error);
    res.status(500).json({ message: "Server error while updating machine" });
  }
};

// Delete machine (only by owner)
export const deleteMachine = async (req, res) => {
  try {
    const { id } = req.params;

    const machine = await Machine.findByPk(id);

    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    if (machine.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this machine" });
    }

    await machine.destroy();

    res.status(200).json({ message: "Machine deleted successfully" });
  } catch (error) {
    console.error("Error deleting machine:", error);
    res.status(500).json({ message: "Server error while deleting machine" });
  }
};

// Get all machines by owner (authenticated user)
export const getMachinesByOwner = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const machines = await Machine.findAll({
      where: { ownerId },
      include: [
        { model: User, as: "owner", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!machines || machines.length === 0) {
      return res
        .status(404)
        .json({ message: "No machines found for this owner" });
    }

    res.status(200).json({
      message: "Machines fetched successfully",
      machines,
    });
  } catch (error) {
    console.error("Error fetching owner's machines:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching owner's machines" });
  }
};
