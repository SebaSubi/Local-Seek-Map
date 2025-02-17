import { Alert, Platform } from "react-native";
import { ServiceType } from "../schema/GeneralSchema";

// const API_URL = `${process.env.EXPO_PUBLIC_API_ROUTE}/service-type`;
const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/service-type"
    : "http://localhost:3000/service-type";
// Platform.OS === "android"
//   ? "http://10.0.2.2:3000/service-type"
//   :

export async function getServiceTypeNames() {
  // const url = Platform.OS === 'android' ? "http://10.0.2.2:3000/store" : "http://localhost:3000/store"
  try {
    const rawData = await fetch(`${API_URL}/names`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch ServiceTypes");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting serviceTypes", error);
  }
}

export async function getServiceTypes() {
  try {
    const rawData = await fetch(`${API_URL}`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch ServiceTypes");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting serviceTypes", error);
  }
}

export async function getAllTypesByName(name: string) {
  try {
    const rawData = await fetch(`${API_URL}/name-search?name=${name}`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch ServiceTypes by name");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting serviceTypes", error);
  }
}

export async function createServiceType(serviceType: ServiceType) {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceType),
    });

    if (!response.ok) {
      Alert.alert("Error", "Error al crear tipo de servicio");
    } else {
      // console.log("Product succesfully added to dataBase");
      return response.json();
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}
