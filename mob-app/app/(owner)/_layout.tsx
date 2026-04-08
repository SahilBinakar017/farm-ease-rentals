import { Tabs } from "expo-router";

export default function OwnerLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="owner-machines" options={{ title: "My Machines" }} />
      <Tabs.Screen name="owner-bookings" options={{ title: "Bookings" }} />
      <Tabs.Screen name="add-machine" options={{ title: "Add Machine" }} />
    </Tabs>
  );
}
