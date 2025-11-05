import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Machine from "./Machine.js";

const Booking = sequelize.define(
  "Booking",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    startTime: { type: DataTypes.DATE, allowNull: false },
    endTime: { type: DataTypes.DATE, allowNull: false },
    basePrice: { type: DataTypes.FLOAT },
    dynamicPrice: { type: DataTypes.FLOAT },
    discount: { type: DataTypes.FLOAT, defaultValue: 0.0 },
    gst: { type: DataTypes.FLOAT, defaultValue: 0.0 },
    finalPrice: { type: DataTypes.FLOAT },
    status: {
      type: DataTypes.ENUM("requested", "confirmed", "completed", "cancelled"),
      defaultValue: "requested",
    },
  },
  { timestamps: true }
);

Booking.belongsTo(User, { as: "user", foreignKey: "userId" });
Booking.belongsTo(Machine, { as: "machine", foreignKey: "machineId" });

export default Booking;
