import { Alert } from "react-native";
import { LocalHours } from "../schema/GeneralSchema";

export async function createSchedule(schedule: LocalHours) {
  try {
    const response = await fetch("http://localhost:3000/schedule", {
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
    const response = await fetch(`http://localhost:3000/schedule/${id}`);
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
    const response = await fetch(`http://localhost:3000/schedule/local/${id}`);
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
    const response = await fetch(`http://localhost:3000/schedule/${id}`, {
      method: "PATCH",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({ dateTo: new Date() }),
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
    const response = await fetch(`http://localhost:3000/schedule/${id}`, {
      method: "PUT",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(schedule),
    });
    if (!response.ok) {
      console.log("Error updating schedule");
    } else {
      const json = response.json();
      return json;
    }
  } catch (error) {}
}
