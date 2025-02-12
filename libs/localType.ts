import { Platform } from "react-native";

export async function getLocalTypes() {
  const API_URL =
    Platform.OS === "android"
      ? "http://10.0.2.2:3000/localType"
      : `${process.env.EXPO_PUBLIC_API_ROUTE}/localType`;
  // const API_URL =
  //   Platform.OS === "android" ? "http://192.168.0.135:3000/productType" : "";
  // // Platform.OS === "android" ? "http://192.168.130.1:3000/productType" : "";

  try {
    const rawData = await fetch(API_URL);
    if (!rawData.ok) {
      throw new Error("Failed to fetch Types");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting Types", error);
  }
}
