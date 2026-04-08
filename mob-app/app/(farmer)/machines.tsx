import { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Image } from "react-native";
import { useRouter } from "expo-router";
import { apiRequest } from "../../utils/apiRequests";
import { Picker } from "@react-native-picker/picker";
import { COLORS, RADIUS, SPACING } from "@/constants/ui";
import { getToken, removeToken } from "@/constants/auth";
import AppHeader from "@/components/AppHeader";

type Machine = {
  id: number;
  title: string;
  type: string;
  baseRate: number;
};

export default function MachinesScreen() {
  const router = useRouter();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMachines();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (!token) router.replace("/login");
    };
    checkAuth();
  }, []);

  const fetchMachines = async () => {
    try {
      const data = await apiRequest("/machines");
      setMachines(data);
    } catch (err: any) {
      console.log("Failed to load machines:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const [filter, setFilter] = useState("all");
  let filteredMachines =
    filter === "all"
      ? machines
      : machines.filter((m) => m.type.toLowerCase() === filter);

  const [sort, setSort] = useState("relevance");
  if (sort === "priceLow") {
    filteredMachines.sort((a, b) => a.baseRate - b.baseRate);
  }

  if (sort === "priceHigh") {
    filteredMachines.sort((a, b) => b.baseRate - a.baseRate);
  }

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

  const handleLogout = async () => {
    await removeToken();
    router.replace("/login");
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader title="Machine" />
      {/* FILTER + SORT BAR */}
      <View style={styles.filterRow}>
        <Picker
          selectedValue={filter}
          style={styles.dropdown}
          onValueChange={(value) => setFilter(value)}
        >
          <Picker.Item label="All Machines" value="all" />
          <Picker.Item label="Tractor" value="tractor" />
          <Picker.Item label="Harvester" value="harvester" />
          <Picker.Item label="Drone" value="drone" />
          <Picker.Item label="Plough" value="plough" />
        </Picker>

        <Picker
          selectedValue={sort}
          style={styles.dropdown}
          onValueChange={(value) => setSort(value)}
        >
          <Picker.Item label="Relevance" value="relevance" />
          <Picker.Item label="Price Low → High" value="priceLow" />
          <Picker.Item label="Price High → Low" value="priceHigh" />
        </Picker>
      </View>

      <FlatList
        data={filteredMachines}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/machine/[id]",
                  params: { id: item.id.toString() },
                })
              }
            >
              <Image source={getMachineImage(item.type)} style={styles.image} />

              <View style={styles.cardContent}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.type}>{item.type}</Text>
              </View>
            </Pressable>

            <View style={styles.bottomRow}>
              <Text style={styles.price}>₹{item.baseRate}/hr</Text>

              <Pressable
                style={styles.bookButton}
                onPress={() =>
                  router.push({
                    pathname: "/booking/[id]",
                    params: { id: item.id.toString() },
                  })
                }
              >
                <Text style={styles.bookText}>BOOK</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.screen,
    backgroundColor: COLORS.background,
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#ffffff",

    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 10,

    elevation: 3,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  dropdown: {
    width: "48%",
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.card,
    marginBottom: 16,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 180,
  },

  cardContent: {
    padding: 14,
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
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  perHour: {
    fontSize: 14,
    color: "#777",
  },

  bookButton: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 30,
  },

  bookText: {
    color: "white",
    fontWeight: "bold",
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
});
