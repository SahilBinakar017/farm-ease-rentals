import express from "express";
import {
  changeBookingStatus,
  createBooking,
  getMyBookings,
  getOwnerBookings,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Create new booking (only logged-in users)
router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/owner", protect, getOwnerBookings);
router.put("/:id/status", protect, changeBookingStatus);

export default router;
