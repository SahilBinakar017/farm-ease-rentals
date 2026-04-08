import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiRequest } from "../../utils/apiRequests";
import { COLORS, RADIUS, SPACING } from "@/constants/ui";
import { getToken } from "@/constants/auth";
import AppHeader from "@/components/AppHeader";

export default function BookingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState<number | null>(null);
  const [endHour, setEndHour] = useState<number | null>(null);

  const [availableStart, setAvailableStart] = useState<number[]>([]);
  const [availableEnd, setAvailableEnd] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [bill, setBill] = useState<any>(null);

  const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6AM–9PM

  //  AUTH CHECK
  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (!token) {
        router.replace("/login");
      }
    };
    checkAuth();
  }, []);

  //  START TIME LOGIC
  useEffect(() => {
    const now = new Date();
    let hour = now.getHours() + 2;

    if (now.getMinutes() > 0) hour += 1;

    const minHour = Math.max(hour, 6);

    setAvailableStart(hours.filter((h) => h >= minHour && h <= 21));
  }, []);

  //  END TIME LOGIC
  useEffect(() => {
    if (!startHour) return;

    let nextHour = startHour + 1;

    if (nextHour > 21) {
      setAvailableEnd(hours); // next day
    } else {
      setAvailableEnd(hours.filter((h) => h >= nextHour && h <= 21));
    }
  }, [startHour]);

  const formatHour = (h: number) => `${String(h).padStart(2, "0")}:00`;

  //  BOOKING FUNCTION
  const handleBooking = async () => {
    if (!date || !startHour || !endHour) {
      alert("Please select date and time");
      return;
    }

    if (!id) {
      alert("Machine ID missing");
      return;
    }

    setLoading(true);

    try {
      const start = new Date(`${date}T${formatHour(startHour)}`);
      const end = new Date(`${date}T${formatHour(endHour)}`);

      if (end <= start) {
        end.setDate(end.getDate() + 1);
      }

      console.log(" SENDING:", {
        machineId: id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });

      const data = await apiRequest("/bookings", "POST", {
        machineId: id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });

      console.log(" RESPONSE:", data);

      setBill(data.booking);
    } catch (err: any) {
      console.log(" ERROR:", err);
      alert(err?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <AppHeader title="Booking" />

      <View style={styles.card}>
        <Text style={styles.title}>Book Machine</Text>

        {/* DATE */}
        <Text style={styles.label}>Select Date</Text>
        <View style={styles.inputBox}>
          <Picker selectedValue={date} onValueChange={setDate}>
            <Picker.Item label="Select Date" value="" />
            {[...Array(10)].map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() + i);
              const val = d.toISOString().split("T")[0];
              return <Picker.Item key={val} label={val} value={val} />;
            })}
          </Picker>
        </View>

        {/* START TIME */}
        <Text style={styles.label}>Start Time</Text>
        <View style={styles.inputBox}>
          <Picker selectedValue={startHour} onValueChange={setStartHour}>
            <Picker.Item label="Select Start Time" value={null} />
            {availableStart.map((h) => (
              <Picker.Item key={h} label={formatHour(h)} value={h} />
            ))}
          </Picker>
        </View>

        {/* END TIME */}
        <Text style={styles.label}>End Time</Text>
        <View style={styles.inputBox}>
          <Picker
            selectedValue={endHour}
            onValueChange={setEndHour}
            enabled={!!startHour}
          >
            <Picker.Item label="Select End Time" value={null} />
            {availableEnd.map((h) => (
              <Picker.Item key={h} label={formatHour(h)} value={h} />
            ))}
          </Picker>
        </View>

        {/* BUTTON */}
        <Pressable style={styles.button} onPress={handleBooking}>
          <Text style={styles.buttonText}>BOOK NOW</Text>
        </Pressable>

        {loading && <ActivityIndicator style={{ marginTop: 15 }} />}
      </View>

      {/*  BILL MODAL */}
      <Modal visible={!!bill} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Booking Summary</Text>

            <Text>Start: {new Date(bill?.startTime).toLocaleString()}</Text>
            <Text>End: {new Date(bill?.endTime).toLocaleString()}</Text>

            <Text>Base: ₹{bill?.basePrice}</Text>
            <Text>Dynamic: ₹{bill?.dynamicPrice}</Text>
            <Text>GST: ₹{bill?.gst}</Text>

            <Text style={styles.total}>Total: ₹{bill?.finalPrice}</Text>

            {/*  CONFIRM */}
            <Pressable
              style={styles.confirmBtn}
              onPress={() => {
                setBill(null);
                router.replace("/booking-success");
              }}
            >
              <Text style={styles.confirmText}>Confirm Booking</Text>
            </Pressable>

            {/* CANCEL */}
            <Pressable style={styles.cancelBtn} onPress={() => setBill(null)}>
              <Text style={{ color: "#fff" }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 🎨 STYLES
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.screen,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.card,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
  },

  label: {
    marginTop: 10,
    fontWeight: "bold",
    color: COLORS.text,
  },

  inputBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.button,
    marginBottom: 10,
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: RADIUS.button,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modal: {
    margin: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  total: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 16,
    color: COLORS.primary,
  },

  confirmBtn: {
    marginTop: 10,
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  confirmText: {
    color: "#fff",
    fontWeight: "bold",
  },

  cancelBtn: {
    marginTop: 10,
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
