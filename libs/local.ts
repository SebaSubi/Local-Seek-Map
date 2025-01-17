import { Alert } from "react-native";
import { Local } from "../schema/GeneralSchema";
import { Platform } from "react-native";
import axios from "axios";
import { validateEmail } from "../components/Register";

// const API_URL =
//   Platform.OS === "android"
//     ? "http://10.0.2.2:3000/store"
//     : "http://192.168.155.114:3000/store";
const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/store"
    : "http://localhost:3000/store";
//   Platform.OS === "android" ? "http://192.168.0.135:3000/store" : "";
// // Platform.OS === "android" ? "http://192.168.130.1:3000/store" : "";

export async function getLocals() {
  try {
    const rawData = await fetch(API_URL);
    if (!rawData.ok) {
      throw new Error("Failed to fetch Stores");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting stores", error);
  }
}

export async function getLocalsByCategory(category = "Supermercado") {
  try {
    const rawData = await fetch(`${API_URL}/category/${category}`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch Stores by category");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting stores by category", error);
  }
}

export async function getLocalsByCategoryAndName(
  category: string,
  name: string
) {
  try {
    const rawData = await fetch(
      `${API_URL}/category-name?category=${category}&name=${name}`
    );
    if (!rawData.ok) {
      throw new Error("Error fetching stores by name and category");
    }
    const json = rawData.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}

export async function getOpenLocalsByCategoryAndName(
  category: string,
  name: string
) {
  try {
    const rawData = await fetch(
      `${API_URL}/category-open?category=${category}&name=${name}`
    );
    if (!rawData.ok) {
      throw new Error("Error fetching open stores by name and category");
    }
    const json = rawData.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}

export async function getIfLocalOpen(id: string) {
  try {
    const rawData = await fetch(`${API_URL}/openStore/${id}`);
    if (!rawData.ok) {
      throw new Error("Error fetching if store is open");
    }
    const json = rawData.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}

export async function getOpenLocalsByName(name: string) {
  try {
    const rawData = await fetch(`${API_URL}/open-name?name=${name}`);
    if (!rawData.ok) {
      throw new Error("Error fetching open stores by name");
    }
    const json = rawData.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}

export async function getLocalsByName(name: string) {
  try {
    const rawData = await fetch(`${API_URL}/search-name?name=${name}`);
    if (!rawData.ok) {
      throw new Error("Error fetching locals by name");
    }
    const json = rawData.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}

export async function getOpenLocals() {
  try {
    const rawData = await fetch(`${API_URL}/openSchedules`);
    if (!rawData.ok) {
      throw new Error("Error getting open stores");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}
export async function getDisplayLocals() {
  try {
    const rawData = await fetch(`${API_URL}/display`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch Stores");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting stores", error);
  }
}

export async function createLocal(local: Local) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(local),
    });

    console.log(JSON.stringify(local));

    if (!response.ok) {
      Alert.alert("Error", "Failed to create Local");
    } else {
      console.log("Product succesfully added to dataBase");
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

export async function getLocal(id: string) {
  const url = `${API_URL}/${id}`;
  try {
    const rawData = await fetch(url);
    if (!rawData.ok) {
      throw new Error("Failed to fetch Stores");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting stores", error);
  }
}

export async function getProductsOfALocal(id: string) {
  const url = `${API_URL}/products/${id}`;
  try {
    const rawData = await fetch(url);
    if (!rawData.ok) {
      throw new Error("Failed to fetch Stores");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting store products", error);
  }
}

export async function checkLocalName(name: string) {
  try {
    const rawData = await axios.get(`${API_URL}/check-name/${name}`);
    return rawData.request.response;
  } catch (error) {
    console.log(error);
  }
}
