import { Alert, Platform } from "react-native";
import { Service, ServiceType } from "../schema/GeneralSchema";
import axios from "axios";

const API_URL = `${process.env.EXPO_PUBLIC_API_ROUTE}/service-type`;
// const API_URL =
//   Platform.OS === "android"
//     ? "http://10.0.2.2:3000/service-type"
//     : "http://localhost:3000/service-type";

export async function getServiceTypeNames() {
  // const url = Platform.OS === 'android' ? "http://10.0.2.2:3000/store" : "http://localhost:3000/store"
  try {
    const rawData = await fetch(`${API_URL}/names`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch ServiceTypes");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting serviceTypes", error);
  }
}

export async function getServiceTypes() {
  try {
    const rawData = await fetch(`${API_URL}`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch ServiceTypes");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting serviceTypes", error);
  }
}

export async function getAllTypesByName(name: string) {
  try {
    const rawData = await fetch(`${API_URL}/name-search?name=${name}`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch ServiceTypes by name");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting serviceTypes", error);
  }
}

export async function createServiceType(serviceType: ServiceType) {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceType),
    });

    if (!response.ok) {
      Alert.alert("Error", "Error al crear tipo de servicio");
    } else {
      // console.log("Product succesfully added to dataBase");
      return response.json();
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

const API_URL_2 = process.env.EXPO_PUBLIC_API_ROUTE;

export async function getAllServices(search: string) {
  try {
    const response = await axios.get(
      `${API_URL_2}/auth-v2/admin-services?search=${search}`
    );
    return response.data as Service[];
  } catch (error) {
    console.error("Error updating product", error);
  }
}

export async function UpdateAdminService(service: Service) {
  try {
    const response = await axios.patch(
      `${API_URL_2}/auth-v2/admin-service-update`,
      service
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product", error);
  }
}

export async function DeleteAdminService(serviceId: string) {
  try {
    const response = await axios.patch(
      `${API_URL_2}/auth-v2/admin-service-delete`,
      { serviceId }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product", error);
  }
}
