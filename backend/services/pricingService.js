export const calculateDynamicPrice = async (machine, startTime, endTime) => {
  const hours =
    (new Date(endTime).getTime() - new Date(startTime).getTime()) / 3600000;

  if (hours <= 0) throw new Error("Invalid time range");

  const basePrice = machine.baseRate * hours;

  //Try to get ML-based price prediction
  let mlPrice = 0;
  try {
    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        machineType: machine.type,
        baseRate: machine.baseRate,
        hours,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      mlPrice = data.predictedPrice || 0;
    }
  } catch (err) {
    console.warn("ML service unavailable, using fallback price");
  }

  // Combine both
  const dynamicPrice = mlPrice > 0 ? mlPrice : basePrice;
  const gst = dynamicPrice * 0.18;
  const finalPrice = dynamicPrice + gst;

  return { basePrice, dynamicPrice, gst, finalPrice, mlPrice };
};
