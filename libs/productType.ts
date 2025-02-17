import { Alert, Platform } from "react-native";
import { ProductType } from "../schema/GeneralSchema";

// const API_URL = `${process.env.EXPO_PUBLIC_API_ROUTE}/productType`;

const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/productType"
    : "http://localhost:3000//productType";
// Platform.OS === "android"
//   ? "http://10.0.2.2:3000/productType"

export async function getProductTypes() {
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

export async function getProductTypesOfLocal(localId: string) {
  try {
    const rawData = await fetch(`${API_URL}/local-product-types/${localId}`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch Product Types of local");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting Types", error);
  }
}

export async function getProductTypesByName(name: string) {
  try {
    const rawData = await fetch(`${API_URL}/name-search?name=${name}`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch Types by name");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting Types", error);
  }
}

export async function createProductType(productType: ProductType) {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productType),
    });

    if (!response.ok) {
      Alert.alert("Error", "Failed to create product Type");
    } else {
      return response.json();
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}
