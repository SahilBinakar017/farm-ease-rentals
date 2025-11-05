import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import machineRoutes from "./routes/machineRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import "./models/User.js";
import "./models/Machine.js";
import "./models/Booking.js";
import cron from "node-cron";
import bcrypt from "bcryptjs";
import Booking from "./models/Booking.js";
import User from "./models/User.js";
import { updateBookingStatus } from "./utils/updateBookingStatus.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Smart Farm Machinery Rental API is running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

// Function to ensure admin user exists
const ensureAdminExists = async () => {
  const existingAdmin = await User.findOne({
    where: { email: "admin@farmease.com" },
  });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin",
      email: "admin@farmease.com",
      password: hashedPassword,
      role: "admin",
    });
    console.log("Default admin user created");
  } else {
    console.log("Admin already exists");
  }
};

// Connect to MySQL and start server
sequelize
  .sync()
  .then(async () => {
    console.log("Database connected & models synced");
    await ensureAdminExists();
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("Database connection failed:", err));

//  CRON job to auto-update bookings
cron.schedule("*/10 * * * *", async () => {
  const bookings = await Booking.findAll();
  for (const booking of bookings) {
    const newStatus = updateBookingStatus(booking);
    if (newStatus !== booking.status) {
      booking.status = newStatus;
      await booking.save();
    }
  }
  console.log("Auto booking status update completed");
});
