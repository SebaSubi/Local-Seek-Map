import { Alert, Platform } from "react-native";
import { LocalTypes } from "../schema/GeneralSchema";

export async function getLocalTypes() {
  const API_URL = `${process.env.EXPO_PUBLIC_API_ROUTE}/localType`;

  // const API_URL =
  //   Platform.OS === "android"
  //     ? "http://10.0.2.2:3000/localType"
  //     : "http://localhost:3000/localType";

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

export async function createLocalType(localType: LocalTypes) {
  const API_URL = `${process.env.EXPO_PUBLIC_API_ROUTE}/localType`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(localType),
    });

    if (!response.ok) {
      Alert.alert("Error", "Failed to create Local Product Category");
    } else {
      const data: LocalTypes = await response.json();
      return data;
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

export async function getlocalategoriesByName(search: string) {
  const API_URL = `${process.env.EXPO_PUBLIC_API_ROUTE}/localType/name-search?name=${search}`;

  // const API_URL =
  //   Platform.OS === "android"
  //     ? "http://10.0.2.2:3000/localType"
  //     : "http://localhost:3000/localType";

  try {
    const rawData = await fetch(API_URL);
    if (!rawData.ok) {
      throw new Error("Failed to fetch Products");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting Types", error);
  }
}
