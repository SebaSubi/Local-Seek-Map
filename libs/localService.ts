// import { Alert } from "react-native";
// import { Service } from "../schema/GeneralSchema";
import { Alert, Platform } from "react-native";
import {
  LocalService,
  LocalServiceCategory,
  LocalServiceSchedule,
  Service,
} from "../schema/GeneralSchema";

const API_URL = process.env.EXPO_PUBLIC_API_ROUTE;

// const API_URL =
//   Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

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

export async function getServicesByName(name: string) {
  try {
    const rawData = await fetch(`${API_URL}/service/service-name?name=${name}`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch Services by name");
    }
    const json = await rawData.json();
    // console.log(json);
    return json;
  } catch (error) {
    console.log("Error getting Services by name", error);
  }
}

export async function getLocalsByServiceId(serviceId: string) {
  try {
    const rawData = await fetch(
      `${API_URL}/service/locals-by-service/${serviceId}`
    );
    if (!rawData.ok) {
      throw new Error("Failed to fetch locals by service Id");
    }
    const json = await rawData.json();
    // console.log(json);
    return json;
  } catch (error) {
    console.log("Error getting locals by service Id", error);
  }
}

export async function getSimilarServices(category: string) {
  try {
    const rawData = await fetch(`${API_URL}/service/similar/${category}`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch similar services");
    }
    const json = await rawData.json();
    // console.log(json);
    return json;
  } catch (error) {
    console.log("Error getting similar services", error);
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

export async function getServicesByLocalIdAndName(
  localId: string,
  name: string
) {
  try {
    const rawData = await fetch(
      `${API_URL}/local-service/local-service-name/${localId}?name=${name}`
    );
    if (!rawData.ok) {
      throw new Error("Failed to fetch ServicesById");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting ServicesById", error);
  }
}

export async function getServicesByLocalIdNameAndCat(
  localId: string,
  category: string,
  name: string
) {
  try {
    const rawData = await fetch(
      `${API_URL}/local-service/local-service-cat-name/${localId}/${category}?name=${name}`
    );
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

export async function getIfServiceOpen(id: string) {
  try {
    const rawData = await fetch(`${API_URL}/service/open-service/${id}`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch open if service open");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting open if service open", error);
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

export async function getOpenServicesByNameAndCategory(
  name: string,
  category: string
) {
  try {
    const rawData = await fetch(
      `${API_URL}/service/category-open?category=${category}&name=${name}`
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
      `${API_URL}/service/name-category/${category}?name=${name}`
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

export async function createLocalService(data: LocalService) {
  try {
    const response = await fetch(`${API_URL}/local-service/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      Alert.alert("Error", "Error creando servicio");
    } else {
      Alert.alert("Éxito", "servicio creado con éxito");

      return response.json();
    }
  } catch (error) {
    console.log("Error: ", error);
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

    if (!response.ok) {
      Alert.alert("Error", "Failed to create Service");
    } else {
      Alert.alert("Éxito", "servicio creado con éxito");

      return response.json();
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

export async function updateService(id: string, data: LocalService) {
  console.log(data);
  try {
    const response = await fetch(`${API_URL}/local-service/update/${id}`, {
      method: "PATCH", // I changed all PUT to PATCH -Lucas  TODO: check if it worked
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
    const response = await fetch(`${API_URL}/local-service/delete/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      Alert.alert("Error", "Failed to delete service");
    } else {
      console.log("Service succesfully deleted");
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
    const response = await fetch(`${API_URL}/service-schedule/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(JSON.stringify(data));

    if (!response.ok) {
      Alert.alert("Error", "No se a podido crear el horario");
    } else {
      Alert.alert("Éxito", "El horario fue creado con éxito!");
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
      method: "PATCH", // I changed all PUT to PATCH -Lucas  TODO: check if it worked
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(schedule),
    });
    if (!response.ok) {
      console.log("Error updating  service schedule");
    } else {
      const json = response.json();
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

//------------------------------------ Local Service Categories ------------------------------------//

export async function getCategoriesOfLocal(localId: string) {
  // This is not working
  try {
    const rawData = await fetch(
      `${API_URL}/local-service-category/local-cats/${localId}`
    );
    if (!rawData.ok) {
      throw new Error("Failed to fetch schedule by scheduleId");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting schedule by scheduleId", error);
  }
}

export async function getLocalServiceCatsByName(name: string) {
  // This is not working
  try {
    const rawData = await fetch(
      `${API_URL}/local-service-category/service-cat-name?name=${name}`
    );
    if (!rawData.ok) {
      throw new Error("Failed to fetch schedule by scheduleId");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting schedule by scheduleId", error);
  }
}

export async function createLocalServiceCategory(data: LocalServiceCategory) {
  try {
    const response = await fetch(`${API_URL}/local-service-category/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(JSON.stringify(data));

    if (!response.ok) {
      Alert.alert("Error", "No se a podido crear la cateogria");
    } else {
      Alert.alert("Éxito", "El la categoría fue creada con éxito!");
      console.log("");
      return response.json();
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}
