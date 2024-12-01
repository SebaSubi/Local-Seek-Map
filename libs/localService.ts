// import { Alert } from "react-native";
// import { Service } from "../schema/GeneralSchema";
import { Alert, Platform } from "react-native";
import { LocalServiceSchedule, Service } from "../schema/GeneralSchema";

const API_URL =
  Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

export async function getServices() {
  // const url = Platform.OS === 'android' ? "http://10.0.2.2:3000/store" : "http://localhost:3000/store";

  try {
    const rawData = await fetch(`${API_URL}/display`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch Services");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting Services", error);
  }
}

export async function getServicesByLocalId(id: string) {
  try {
    const rawData = await fetch(`${API_URL}/service/localId/${id}`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch ServicesById");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting ServicesById", error);
  }
}

export async function createService(data: Service) {
  try {
    const response = await fetch(`${API_URL}/service/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(JSON.stringify(data));

    if (!response.ok) {
      Alert.alert("Error", "Failed to create Service");
    } else {
      console.log("Service succesfully added to dataBase");
    }
  } catch (error) {
    console.log("Error: ", error);
    Alert.alert("Error: ", error);
  }
}

//------------------------------------Service Schedule------------------------------------//

export async function getScheduleByLocalServiceId(id: string) {
  try {
    const rawData = await fetch(`${API_URL}/service-schedule/service/${id}`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch schedule by localServiceId");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting localServiceId", error);
  }
}

export async function getServiceScheduleByScheduleId(id: string) {
  try {
    const rawData = await fetch(`${API_URL}/service-schedule/${id}`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch schedule by scheduleId");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting schedule by scheduleId", error);
  }
}

export async function createlocalServiceSchedule(data: LocalServiceSchedule) {
  try {
    const response = await fetch(`${API_URL}/service-schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(JSON.stringify(data));

    if (!response.ok) {
      Alert.alert("Error", "Failed to create localServiceSchedule");
    } else {
      console.log("Service succesfully added to localServiceSchedule");
    }
  } catch (error) {
    console.log("Error: ", error);
    Alert.alert("Error: ", error);
  }
}

export async function updateServiceSchedule(
  id: string,
  schedule: LocalServiceSchedule,
) {
  try {
    const response = await fetch(`${API_URL}/service-schedule/update/${id}`, {
      method: "PUT",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(schedule),
    });
    if (!response.ok) {
      console.log("Error updating  service schedule");
      // console.log(response);
    } else {
      const json = response.json();
      console.log("Updated service schedule");
      return json;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deleteServiceSchedule(id: string) {
  try {
    const response = await fetch(`${API_URL}/service-schedule/delete/${id}`, {
      method: "PATCH",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({ dateTo: new Date() }), // I should delete this
    });

    if (!response.ok) {
      console.log("Error deletiong service schedule");
    } else {
      const json = response.json();
      return json;
    }
  } catch (error) {
    console.log(error);
  }
}
