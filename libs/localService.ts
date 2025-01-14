// import { Alert } from "react-native";
// import { Service } from "../schema/GeneralSchema";
import { Alert, Platform } from "react-native";
import { LocalServiceSchedule, Service } from "../schema/GeneralSchema";

const API_URL =
  Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

export async function getServices() {
  // const url = Platform.OS === 'android' ? "http://10.0.2.2:3000/store" : "http://localhost:3000/store";

  try {
    const rawData = await fetch(`${API_URL}/service`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch Services");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting Services", error);
  }
}

export async function getDisplayServices() {
  // const url = Platform.OS === 'android' ? "http://10.0.2.2:3000/store" : "http://localhost:3000/store";

  try {
    const rawData = await fetch(`${API_URL}/service/display`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch Services");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting Services", error);
  }
}

export async function getDisplayServicesByName(name: string) {
  try {
    const rawData = await fetch(`${API_URL}/service/name-search?name=${name}`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch Services by name");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting Services by name", error);
  }
}

export async function getServicesById(id: string) {
  try {
    const rawData = await fetch(`${API_URL}/service/id/${id}`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch Service");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting Service", error);
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

export async function getOpenServices() {
  try {
    const rawData = await fetch(`${API_URL}/service/open-services`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch open services");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting open services", error);
  }
}

export async function getOpenServicesByName(name: string) {
  try {
    const rawData = await fetch(
      `${API_URL}/service/open-services-name?name=${name}`
    );
    if (!rawData.ok) {
      throw new Error("Failed to fetch open services");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting open services", error);
  }
}

export async function getServicesByCategory(category: string) {
  try {
    const rawData = await fetch(
      `${API_URL}/service/category-search/${category}`
    );
    if (!rawData.ok) {
      throw new Error("Failed to fetch services by category");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting services by category", error);
  }
}

export async function getServicesByCategoryAndName(
  category: string,
  name: string
) {
  // category.replaceAll('%20', ' ');
  //nestJS automatically changes the spaces to %20 so this isnt necessary in the end
  try {
    const rawData = await fetch(
      `${API_URL}/service/category-name?category=${category}&name=${name}`
    );
    if (!rawData.ok) {
      throw new Error("Failed to fetch services by category and name");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting services by category and name", error);
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
  }
}

export async function updateService(id: string, data: Service) {
  console.log(`${API_URL}/service/update/${id}`);
  try {
    const response = await fetch(`${API_URL}/service/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(JSON.stringify(data));

    if (!response.ok) {
      Alert.alert("Error", "Failed to update Service");
    } else {
      console.log("Service succesfully updated and added to dataBase");
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

export async function deleteService(id: string) {
  try {
    const response = await fetch(`${API_URL}/service/delete/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      Alert.alert("Error", "Failed to create Service");
    } else {
      console.log("Service succesfully added to dataBase");
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

export async function getDisplayServiceByLocalId(localServiceId: string) {
  try {
    const rawData = await fetch(`${API_URL}/service/display/${localServiceId}`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch schedule by localServiceId");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting display Services", error);
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
  }
}

export async function updateServiceSchedule(
  id: string,
  schedule: LocalServiceSchedule
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
