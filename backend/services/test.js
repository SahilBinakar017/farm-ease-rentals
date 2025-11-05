import { calculateDynamicPrice } from "./pricingService.js";

const machine = { type: "Tractor", baseRate: 2000 };
const startTime = "2025-11-05T08:00:00";
const endTime = "2025-11-05T12:00:00";

calculateDynamicPrice(machine, startTime, endTime)
  .then(console.log)
  .catch(console.error);
