import { Tabs } from "expo-router";

export default function FarmerLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="machines" options={{ title: "Machines" }} />
      <Tabs.Screen name="bookings" options={{ title: "My Bookings" }} />
    </Tabs>
  );
}
