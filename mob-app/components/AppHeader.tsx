import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { removeToken } from "@/constants/auth";
import { COLORS, SPACING, RADIUS } from "@/constants/ui";

type Props = {
  title: string;
};

export default function AppHeader({ title }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    await removeToken();
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.screen,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: COLORS.background,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },

  logoutBtn: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.button,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
});
