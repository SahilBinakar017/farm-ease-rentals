import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { getToken } from "../constants/auth";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();

      if (token) {
        router.replace("/(tabs)/machines");
      } else {
        router.replace("/login");
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
