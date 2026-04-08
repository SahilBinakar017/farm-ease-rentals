import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { apiRequest } from "@/constants/request";
import { useRouter } from "expo-router";
import { COLORS, SPACING, RADIUS } from "@/constants/ui";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("farmer");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await apiRequest("/auth/register", "POST", {
        name,
        email,
        password,
        role,
      });

      alert("Registration successful");
      router.replace("/login");
    } catch (err: any) {
      alert(err?.message || "Registration failed");
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          placeholder="Name"
          placeholderTextColor={COLORS.subtext}
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor={COLORS.subtext}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={COLORS.subtext}
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        {/*  ROLE DROPDOWN */}
        <Text style={styles.label}>Select Role</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={role}
            onValueChange={(value) => setRole(value)}
          >
            <Picker.Item label="Farmer" value="farmer" />
            <Picker.Item label="Owner" value="owner" />
          </Picker>
        </View>

        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>REGISTER</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/login")}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    padding: SPACING.screen,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.card,
    elevation: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: COLORS.text,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.button,
    padding: 12,
    marginBottom: 12,
    color: COLORS.text,
    backgroundColor: "#fff",
  },

  label: {
    marginTop: 5,
    marginBottom: 5,
    fontWeight: "bold",
    color: COLORS.text,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.button,
    marginBottom: 15,
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: RADIUS.button,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  link: {
    marginTop: 15,
    textAlign: "center",
    color: COLORS.primary,
  },
});
