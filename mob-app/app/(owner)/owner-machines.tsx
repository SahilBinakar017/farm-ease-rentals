import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Modal,
} from "react-native";
import { Image } from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { apiRequest } from "@/utils/apiRequests";
import AppHeader from "@/components/AppHeader";
import { COLORS, SPACING, RADIUS } from "@/constants/ui";

export default function OwnerMachines() {
  const router = useRouter();

  const [machines, setMachines] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("none");

  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    const data = await apiRequest("/machines/owner");
    setMachines(data);
  };

  //  FILTER
  let filtered =
    filter === "all"
      ? machines
      : machines.filter((m) => m.type.toLowerCase() === filter);

  //  SORT
  if (sort === "low") {
    filtered.sort((a, b) => a.baseRate - b.baseRate);
  }
  if (sort === "high") {
    filtered.sort((a, b) => b.baseRate - a.baseRate);
  }

  const handleDelete = async () => {
    if (!deleteId) return;
    await apiRequest(`/machines/${deleteId}`, "DELETE");
    setDeleteId(null);
    fetchMachines();
  };

  const getImage = (type: string) => {
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

  return (
    <View style={styles.screen}>
      <AppHeader title="My Machines" />

      {/* FILTER + SORT */}
      <View style={styles.filterRow}>
        <Picker selectedValue={filter} onValueChange={setFilter}>
          <Picker.Item label="All" value="all" />
          <Picker.Item label="Tractor" value="tractor" />
          <Picker.Item label="Harvester" value="harvester" />
          <Picker.Item label="Drone" value="drone" />
          <Picker.Item label="Plough" value="plough" />
        </Picker>

        <Picker selectedValue={sort} onValueChange={setSort}>
          <Picker.Item label="Sort" value="none" />
          <Picker.Item label="Low → High" value="low" />
          <Picker.Item label="High → Low" value="high" />
        </Picker>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={getImage(item.type)} style={styles.image} />

            <Text style={styles.title}>{item.title}</Text>
            <Text>₹{item.baseRate}/hr</Text>

            <View style={styles.row}>
              <Pressable
                style={styles.edit}
                onPress={() =>
                  router.push({
                    pathname: "/machine-edit/[id]",
                    params: { id: item.id.toString() },
                  })
                }
              >
                <Text style={styles.btnText}>Edit</Text>
              </Pressable>

              <Pressable
                style={styles.delete}
                onPress={() => setDeleteId(item.id)}
              >
                <Text style={styles.btnText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {/*  CUSTOM DELETE MODAL */}
      <Modal visible={!!deleteId} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalText}>Delete this machine?</Text>

            <View style={styles.row}>
              <Pressable style={styles.confirm} onPress={handleDelete}>
                <Text style={styles.btnText}>Yes</Text>
              </Pressable>

              <Pressable
                style={styles.cancel}
                onPress={() => setDeleteId(null)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    borderRadius: RADIUS.card,
    marginBottom: 16,
    paddingEnd: 12,
    marginTop: 4,
    overflow: "hidden",
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 160,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 12,
    paddingTop: 10,
    color: COLORS.text,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },

  edit: {
    backgroundColor: "#2563eb",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  delete: {
    backgroundColor: "#ef4444",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  /*  MODAL */
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modal: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },

  modalText: {
    fontSize: 16,
    marginBottom: 15,
    color: COLORS.text,
  },

  confirm: {
    backgroundColor: "#ef4444",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },

  cancel: {
    backgroundColor: "#6b7280",
    padding: 10,
    borderRadius: 8,
  },
});
