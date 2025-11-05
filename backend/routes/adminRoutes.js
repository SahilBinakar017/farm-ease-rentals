import express from "express";
import {
  getFarmers,
  getOwners,
  getMachines,
  getAllBookings,
  deleteFarmer,
  deleteOwner,
  deleteMachine,
  deleteBooking,
} from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/farmers", getFarmers);
router.get("/owners", getOwners);
router.get("/machines", getMachines);
router.get("/bookings", getAllBookings);
router.delete("/farmers/:id", authMiddleware, deleteFarmer);
router.delete("/owners/:id", authMiddleware, deleteOwner);
router.delete("/machines/:id", authMiddleware, deleteMachine);
router.delete("/bookings/:id", authMiddleware, deleteBooking);

export default router;
