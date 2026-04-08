import { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiRequest } from "@/utils/apiRequests";
import AppHeader from "@/components/AppHeader";

export default function EditMachine() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [machine, setMachine] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    loadMachine();
  }, []);

  const loadMachine = async () => {
    const data = await apiRequest(`/machines/${id}`);
    setMachine(data);
  };

  const handleUpdate = async () => {
    await apiRequest(`/machines/${id}`, "PUT", machine);
    alert("Updated");
    router.back();
  };

  const handleDelete = async () => {
    await apiRequest(`/machines/${id}`, "DELETE");
    router.replace("/(owner)/owner-machines");
  };

  if (!machine) return null;

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Edit Machine" />

      <TextInput
        value={machine.title}
        onChangeText={(v) => setMachine({ ...machine, title: v })}
      />

      <Pressable onPress={handleUpdate}>
        <Text>Update</Text>
      </Pressable>

      <Pressable onPress={() => setDeleteModal(true)}>
        <Text>Delete</Text>
      </Pressable>

      {/* MODAL */}
      <Modal visible={deleteModal} transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text>Delete machine?</Text>

            <Pressable onPress={handleDelete}>
              <Text>Yes</Text>
            </Pressable>

            <Pressable onPress={() => setDeleteModal(false)}>
              <Text>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
});
