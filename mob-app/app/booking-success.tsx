import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import AppHeader from "@/components/AppHeader";
import { COLORS, SPACING, RADIUS } from "@/constants/ui";

export default function BookingSuccess() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader title="Success" />

      <View style={styles.container}>
        <Text style={styles.emoji}>🎉</Text>

        <Text style={styles.title}>Booking Confirmed!</Text>

        <Text style={styles.subtitle}>
          Your machine has been booked successfully.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.replace("/(tabs)/machines")}
        >
          <Text style={styles.buttonText}>Back to Machines</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.screen,
  },

  emoji: {
    fontSize: 50,
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.subtext,
    marginVertical: 10,
    textAlign: "center",
  },

  button: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: RADIUS.button,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
