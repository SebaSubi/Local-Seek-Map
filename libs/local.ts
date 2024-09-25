import { Alert } from "react-native";
import { Local } from "../schema/GeneralSchema";

export async function getLocals() {
  const url = "http://localhost:3000/store";

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

export async function createLocal(local: Local) {
  try {
    const response = await fetch("http://localhost:3000/store", {
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
    Alert.alert("Error: ", error);
  }
}

export async function getLocal(id: string) {
  const url = `http://localhost:3000/store/${id}`;
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

//esto es una prueba de como escribir en este teclado jeje, esta bueno porque no tiene tanto recorrido de los dedos y no es tan livianito cuando apretas as teclas.
//banco banco banco banco banco banco banco banco banco banco banco banco. No me acostumboro al cmd de apple, es de gays.
