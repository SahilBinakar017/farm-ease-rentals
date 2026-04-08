import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiRequest } from "../../utils/apiRequests";
import { COLORS, RADIUS, SPACING } from "@/constants/ui";
import { getToken } from "@/constants/auth";
import AppHeader from "@/components/AppHeader";

type Machine = {
  id: number;
  title: string;
  description?: string;
  type: string;
  baseRate: number;
};

export default function MachineDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMachine();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (!token) router.replace("/login");
    };
    checkAuth();
  }, []);

  const loadMachine = async () => {
    try {
      const data = await apiRequest(`/machines/${id}`);
      setMachine(data);
    } catch (err: any) {
      console.log("Failed to load machine:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMachineImage = (type: string) => {
    switch (type?.toLowerCase()) {
      case "tractor":
        return require("../../assets/machines/tractor.jpg");
      case "harvester":
        return require("../../assets/machines/harvester.jpg");
      case "drone":
        return require("../../assets/machines/drone.jpg");
      case "plough":
        return require("../../assets/machines/plough.jpg");
      default:
        return require("../../assets/machines/tractor.jpg");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 80 }} />;
  }

  if (!machine) {
    return (
      <View style={styles.center}>
        <Text>Machine not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AppHeader title="Machine Details" />
      <View style={styles.card}>
        <Image source={getMachineImage(machine.type)} style={styles.image} />

        <Text style={styles.title}>{machine.title}</Text>
        <Text style={styles.type}>{machine.type}</Text>

        <View style={styles.divider} />

        <Text style={styles.price}>₹{machine.baseRate}/hr</Text>

        {machine.description && (
          <>
            <View style={styles.divider} />
            <Text style={styles.descTitle}>Description</Text>
            <Text style={styles.desc}>{machine.description}</Text>
          </>
        )}

        <Pressable
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/booking/[id]",
              params: { id: machine.id.toString() },
            })
          }
        >
          <Text style={styles.buttonText}>BOOK NOW</Text>
        </Pressable>
      </View>
    </View>
  );
}

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
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: RADIUS.card,
    marginBottom: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },

  type: {
    fontSize: 14,
    color: COLORS.subtext,
    marginTop: 4,
    textTransform: "capitalize",
  },

  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 6,
  },

  descTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 6,
    color: COLORS.text,
  },

  desc: {
    fontSize: 14,
    color: COLORS.subtext,
    marginTop: 4,
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.button,
    alignItems: "center",
    marginTop: 16,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
