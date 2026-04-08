import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { apiRequest } from "@/constants/request";
import { saveToken, getToken, removeToken } from "@/constants/auth";
import { COLORS, SPACING, RADIUS } from "@/constants/ui";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //  ROLE REDIRECT FUNCTION
  const redirectUser = (role: string) => {
    if (role === "farmer") {
      router.replace("../(farmer)/machines");
    } else if (role === "owner") {
      router.replace("../(owner)/owner-machines");
    }
  };

  //  LOGIN HANDLER
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      const res = await apiRequest("/auth/login", "POST", {
        email,
        password,
      });

      //  SAVE TOKEN
      await saveToken(res.token);

      //  SAVE USER
      await AsyncStorage.setItem("user", JSON.stringify(res.user));

      //  REDIRECT
      redirectUser(res.user.role);
    } catch (err: any) {
      alert(err?.message || "Login failed");
    }
  };

  //  AUTO LOGIN (ON APP OPEN)
  useEffect(() => {
    const checkLogin = async () => {
      const token = await getToken();

      if (token) {
        const userData = await AsyncStorage.getItem("user");

        if (userData) {
          const user = JSON.parse(userData);
          redirectUser(user.role);
        }
      }
    };

    checkLogin();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Smart Farm</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

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

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/register")}>
          <Text style={styles.link}>Don’t have an account? Register</Text>
        </Pressable>
      </View>
    </View>
  );
}

//  STYLES
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
    color: COLORS.text,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.subtext,
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.button,
    padding: 12,
    marginBottom: 15,
    color: COLORS.text,
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.button,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  link: {
    marginTop: 15,
    textAlign: "center",
    color: COLORS.primary,
  },
});
