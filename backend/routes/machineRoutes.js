import express from "express";
import {
  addMachine,
  getAllMachines,
  getMachineById,
  updateMachine,
  deleteMachine,
  getMachinesByOwner,
} from "../controllers/machineController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Create new machine (only logged-in users)
router.post("/", protect, addMachine);

// Get all machines (public)
router.get("/", getAllMachines);

// Get machine(by owner)
router.get("/owner", protect, getMachinesByOwner);

// Get single machine by ID (public)
router.get("/:id", getMachineById);

// Update machine (only owner)
router.put("/:id", protect, updateMachine);

// Delete machine (only owner)
router.delete("/:id", protect, deleteMachine);

export default router;
