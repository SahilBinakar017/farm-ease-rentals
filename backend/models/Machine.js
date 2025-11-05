import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Machine = sequelize.define(
  "Machine",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    type: { type: DataTypes.STRING },
    baseRate: { type: DataTypes.FLOAT, allowNull: false },
    available: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { timestamps: true }
);

Machine.belongsTo(User, { as: "owner", foreignKey: "ownerId" });

export default Machine;
