import { Alert } from "react-native";
import { Local, LocalProduct } from "../schema/GeneralSchema";
import { Platform } from "react-native";
import axios from "axios";
import { validateEmail } from "../components/Register";

const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/store"
    : "http://localhost:3000/store";
// const API_URL = `${process.env.EXPO_PUBLIC_API_ROUTE}/store`;
//   Platform.OS === "android" ? "http://192.168.0.135:3000/store" : "";
// // Platform.OS === "android" ? "http://192.168.130.1:3000/store" : "";

//this is used in the SearchComponent
export async function getLocals() {
  // console.log(API_URL);
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
//this method is used in LocalPage
export async function addPopularityToLocal(localId: string) {
  try {
    const response = await fetch(`${API_URL}/add-popularity/${localId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("Failed to add popularity to local");
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

//FIXME:this is not used
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

//this method is used in ReadLocal
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

//this is also used at ReadLocal
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

//this is used in LocalContainer and EditLocalContainer
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

//this is used in ReadLocal
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

//this is used in ReadLocal
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

//FIXME: this is not used
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

//FIXME: this is not used
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

//TODO: this is used in a lot of places, but it should use jwt security
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

//this method is used in LocalStats and in localPage
export async function getLocalById(id: string) {
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

//this method is used in CreateLocal and NewUpdateLocal
export async function checkLocalName(name: string) {
  try {
    const rawData = await axios.get(`${API_URL}/check-name/${name}`);
    return rawData.request.response;
  } catch (error) {
    console.log(error);
  }
}

//this is used in NewCreateLocal
//TODO: remake this with security
export async function updateLocal(id: string, local: Local) {
  try {
    const response = await fetch(`${API_URL}/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(local),
    });

    console.log("Response Status:", response.status);
    console.log("Response Headers:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error Response Body:", errorText);
      Alert.alert("Error", `Failed to update local: ${response.status}`);
      return;
    } else {
      Alert.alert("Local actualizado con éxito");
    }

    // Handle empty response
    const data = response.status !== 204 ? await response.json() : null;
    return data;
  } catch (error) {
    console.log("Error: ", error);
    Alert.alert("Error", "Something went wrong");
  }
}

//this is used in DeleteLocal, but its weird
//TODO: Check this
export async function deleteLocal(id: string) {
  try {
    const response = await fetch(`${API_URL}/removeLocal/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Error deleting product");
      const errorResponse = await response.json();
      console.error(errorResponse);
      throw new Error("Error al eliminar el producto");
    }
    // const data = response.status !== 204 ? await response.json() : null;

    // return data;
  } catch (error) {
    console.error("Error en deleteProduct:", error);
  }
}
//TODO: remake this
// const API_URL_2 = process.env.EXPO_PUBLIC_API_ROUTE;
const API_URL_2 =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/store"
    : "http://localhost:3000/store";

//this method is used in CreateLocal
export async function createLocalAndAddOwner(local: Local, userId: string) {
  try {
    const payload = {
      store: local,
      userId: userId,
    };
    const response = await axios.post(
      `${API_URL_2}/auth-v2/store_owner/craete-and-add-store`,
      payload
    );

    // console.log(JSON.stringify(local));

    if (!response.status) {
      Alert.alert("Error", "Failed to create Local");
    } else {
      console.log("Product succesfully added to dataBase");
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

//this method is used in LocalDeleteModal
export async function deleteLocalv2(localId: string, userId: string) {
  try {
    const payload = { userId: userId, storeId: localId };
    const response = await axios.patch(
      `${API_URL_2}/auth-v2/store_owner/delete-store`,
      payload
    );
    if (!response.status) {
      Alert.alert("Error", "Failed to delete Local");
    } else {
      console.log("Local succesfully deleted from dataBase");
      return response;
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

//----------------------------------------------------------------Local User----------------------------------------------------------------
// const API_URL_LU = `${process.env.EXPO_PUBLIC_API_ROUTE}/local-user`
const API_URL_LU =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/local-user"
    : "http://localhost:3000/local-user";

//this si used in DeleteLocal
export async function getLocalsOfUser(userEmail: string) {
  const url = `${API_URL_LU}/locals/${userEmail}`;
  try {
    const rawData = await fetch(url);
    if (!rawData.ok) {
      throw new Error("Failed to fetch store services");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting store services", error);
  }
}

//----------------------------------------------------------------Local Services----------------------------------------------------------------
