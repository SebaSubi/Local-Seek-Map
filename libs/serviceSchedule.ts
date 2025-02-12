import { Alert, Platform } from "react-native";
import { LocalServiceSchedule } from "../schema/GeneralSchema";

// const API_URL =
//   Platform.OS === "android"
//     ? "http://10.0.2.2:3000"
//     : "http://192.168.155.114:3000";

const API_URL = process.env.EXPO_PUBLIC_API_ROUTE;
// Platform.OS === "android"
//   ? "http://10.0.2.2:3000"
//   :

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
      Alert.alert("Success", "Schedule created successfully!");
    }
  } catch (error) {
    console.log("Error: ", error);
    // Alert.alert("Error: ", error);
  }
}

export async function getScheduleByServiceId(id: string) {
  try {
    const response = await fetch(`${API_URL}/service-schedule/service/${id}`);
    if (!response.ok) {
      console.log("Error fetching the Schedules");
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log("Error fetching schedules: ", error);
    Alert.alert("Error", "An error occurred while fetching schedules.");
  }
}
