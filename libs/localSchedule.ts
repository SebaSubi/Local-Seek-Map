import { Alert, Platform } from "react-native";
import { LocalSchedule } from "../schema/GeneralSchema";

// const API_URL =
//   Platform.OS === "android"
//     ? "http://10.0.2.2:3000"
//     : "http://192.168.155.114:3000";

const API_URL =
  Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

export async function createSchedule(schedule: LocalSchedule) {
  try {
    const response = await fetch(`${API_URL}/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(schedule),
    });

    if (!response.ok) {
      Alert.alert("Error", "Failed to create Schedule");
    } else {
      console.log("Schedule succesfully added to dataBase");
      Alert.alert("Exito", "El horario fue creado correctamente");
    }
  } catch (error) {
    console.log("Error: ", error);
    //Alert.alert("Error: ", error);
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

export async function getSchedulesByLocalId(id: string) {
  try {
    const response = await fetch(`${API_URL}/schedule/local/${id}`);
    if (!response.ok) {
      console.log("Error fetching schedule");
      console.log(response);
    } else {
      const json = response.json();
      return json;
    }
  } catch (error) {
    console.group(error);
  }
}

export async function deleteSchedule(id: string) {
  try {
    const response = await fetch(`${API_URL}/schedule/delete/${id}`, {
      method: "PATCH",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({ dateTo: new Date() }), // I should delete this
    });

    if (!response.ok) {
      console.log(response);
    } else {
      const json = response.json();
      return json;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function updateSchedule(id: string, schedule: LocalSchedule) {
  try {
    const response = await fetch(`${API_URL}/schedule/update/${id}`, {
      method: "PATCH",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(schedule),
    });
    if (!response.ok) {
      console.log("Error updating schedule");
      console.log(response);
    } else {
      const json = response.json();
      console.log("Updated Schedule");
      return json;
    }
  } catch (error) {}
}
