import { View, Text, StyleSheet, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Tab() {
  const { onLogout } = useAuth();

  return (
    <View style={styles.container}>
      <Text>Tab [Home|Settings]</Text>
      <Pressable onPress={onLogout}>
        <Text>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
