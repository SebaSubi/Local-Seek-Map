import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { useAuth } from "../context/AuthContext";
import SearchComponent from "../../components/SearchComponent";
import { Stack } from "expo-router";
import Header from "../../components/Header";

export default function Tab() {
  const { onLogout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => (
            <View style={styles.headerContainer}>
              <Pressable
                style={styles.menuButton}
                onPress={() => setMenuOpen(!menuOpen)}
              >
                <Text style={styles.menuButtonText}>
                  {menuOpen ? "X" : "☰"}
                </Text>
              </Pressable>
              <Text style={styles.headerTitle}>Home</Text>
            </View>
          ),
        }}
      />
      {menuOpen && (
        <View style={styles.menuContainer}>
          <Pressable style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </View>
      )}
      <View style={styles.searchContainer}>
        <SearchComponent />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#324e64",
    padding: 20,
  },
  menuButton: {
    marginRight: 10,
    backgroundColor: "#e1e8e8",
    borderRadius: 25,
    padding: 10,
  },
  menuButtonText: {
    fontSize: 18,
    color: "#324e64",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 25,
    alignItems: "center",
    color: "white",
    fontWeight: "bold",
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width * 0.8,
    backgroundColor: "#e1e8e8",
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  searchContainer: {
    flex: 1,
  },
});
