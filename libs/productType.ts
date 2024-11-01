import { Platform } from "react-native";

export async function getProductTypes() {
  // const API_URL = Platform.OS === 'android' ? "http://10.0.2.2:3000/productType" : "http://localhost:3000/productType";
  const API_URL =
    Platform.OS === "android" ? "http://192.168.155.1:3000/productType" : "";

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