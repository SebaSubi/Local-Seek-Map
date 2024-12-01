import { Platform } from "react-native";

const API_URL =
  Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

export async function getServiceTypes() {
  // const url = Platform.OS === 'android' ? "http://10.0.2.2:3000/store" : "http://localhost:3000/store";

  try {
    const rawData = await fetch(`${API_URL}/service-type`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch ServiceTypes");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting serviceTypes", error);
  }
}
