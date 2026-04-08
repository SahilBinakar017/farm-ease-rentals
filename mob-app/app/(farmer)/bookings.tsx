import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { apiRequest } from "@/utils/apiRequests";
import AppHeader from "@/components/AppHeader";
import { COLORS, SPACING, RADIUS } from "@/constants/ui";

type Booking = {
  id: number;
  startTime: string;
  endTime: string;
  finalPrice: number;
  status: string;
  machine: {
    title: string;
    type: string;
  };
};

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [timeFilter, setTimeFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await apiRequest("/bookings");
      setBookings(data);
    } catch (err: any) {
      console.log("Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  //  FILTER LOGIC
  const now = new Date();

  const filteredBookings = bookings.filter((b) => {
    const start = new Date(b.startTime);
    const end = new Date(b.endTime);

    // TIME FILTER
    if (timeFilter === "current" && !(start <= now && end >= now)) return false;
    if (timeFilter === "upcoming" && !(start > now)) return false;
    if (timeFilter === "previous" && !(end < now)) return false;

    //  MACHINE FILTER
    if (typeFilter !== "all" && b.machine?.type.toLowerCase() !== typeFilter) {
      return false;
    }

    return true;
  });

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.screen}>
      <AppHeader title="My Bookings" />

      {/* FILTER BAR */}
      <View style={styles.filterRow}>
        {/* TIME FILTER */}
        <Picker
          selectedValue={timeFilter}
          onValueChange={(val) => setTimeFilter(val)}
        >
          <Picker.Item label="All Time" value="all" />
          <Picker.Item label="Current" value="current" />
          <Picker.Item label="Upcoming" value="upcoming" />
          <Picker.Item label="Previous" value="previous" />
        </Picker>

        {/* MACHINE FILTER */}
        <Picker
          selectedValue={typeFilter}
          onValueChange={(val) => setTypeFilter(val)}
        >
          <Picker.Item label="All Machines" value="all" />
          <Picker.Item label="Tractor" value="tractor" />
          <Picker.Item label="Harvester" value="harvester" />
          <Picker.Item label="Drone" value="drone" />
          <Picker.Item label="Plough" value="plough" />
        </Picker>
      </View>

      {/* BOOKINGS LIST */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.machine?.title}</Text>
            <Text style={styles.type}>{item.machine?.type}</Text>

            <Text style={styles.time}>
              {new Date(item.startTime).toLocaleString()}
            </Text>
            <Text style={styles.time}>
              → {new Date(item.endTime).toLocaleString()}
            </Text>

            <Text style={styles.price}>₹{item.finalPrice}</Text>

            <Text style={styles.status}>
              Status: {item.status.toUpperCase()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.screen,
  },

  filterRow: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.card,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },

  type: {
    fontSize: 13,
    color: COLORS.subtext,
    marginBottom: 6,
  },

  time: {
    fontSize: 12,
    color: "#444",
  },

  price: {
    marginTop: 6,
    fontWeight: "bold",
    color: COLORS.primary,
  },

  status: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "bold",
  },
});
