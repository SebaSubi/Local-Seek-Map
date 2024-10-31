import { Alert, Platform } from "react-native";
import { LocalHours } from "../schema/GeneralSchema";

// const API_URL =
//   Platform.OS === "android"
//     ? "http://10.0.2.2:3000"
//     : "http://192.168.155.114:3000";

const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/store"
    : "http://localhost:3000";

export async function createSchedule(schedule: LocalHours) {
  // const API_URL = Platform.OS === 'android' ? "http://10.0.2.2:3000/schedule" : "http://localhost:3000/schedule";
  const API_URL =
    Platform.OS === "android" ? "http://192.168.155.1:3000/schedule" : "";

  try {
    const response = await fetch(`${API_URL}/schedule`, {
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

export async function getScheduleByScheduleId(id: string) {
  try {
    const response = await fetch(`${API_URL}/schedule/${id}`);
    if (!response.ok) {
      console.log("Error fetching the Schedules");
    } else {
      const data = response.json();
      return data;
    }
  } catch (error) {}
}

export async function getSchedule(id: string) {
  try {
    const response = await fetch(`${API_URL}/schedule/local/${id}`);
    if (!response.ok) {
      console.log("Error fetching schedule");
    } else {
      const json = response.json();
      return json;
    }
  } catch (error) {}
}

export async function deleteSchedule(id: string) {
  try {
    const response = await fetch(`${API_URL}/schedule/${id}`, {
      method: "PATCH",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({ dateTo: new Date() }), // I should delete this
    });

    if (!response.ok) {
      console.log("Error deletiong schedule");
    } else {
      const json = response.json();
      return json;
    }
  } catch (error) {}
}

export async function updateSchedule(id: string, schedule: LocalHours) {
  try {
    const response = await fetch(`${API_URL}/schedule/${id}`, {
      method: "PUT",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(schedule),
    });
    if (!response.ok) {
      console.log("Error updating schedule");
      // console.log(response);
    } else {
      const json = response.json();
      console.log("Updated Schedule");
      return json;
    }
  } catch (error) {}
}
