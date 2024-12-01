import { Alert, Platform } from "react-native";
import { LocalServiceSchedule } from "../schema/GeneralSchema";

// const API_URL =
//   Platform.OS === "android"
//     ? "http://10.0.2.2:3000"
//     : "http://192.168.155.114:3000";

const API_URL =
  Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

export async function createSchedule(schedule: LocalServiceSchedule) {
  try {
    const response = await fetch(`${API_URL}/service-schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(schedule),
    });
    console.log(JSON.stringify(schedule));

    if (!response.ok) {
      Alert.alert("Error", "Failed to create Schedule");
    } else {
      console.log("Schedule succesfully added to dataBase");
    }
  } catch (error) {
    console.log("Error: ", error);
    Alert.alert("Error: ", error);
  }
}
