// import { Alert } from "react-native";
// import { Service } from "../schema/GeneralSchema";
import { Platform } from 'react-native';

const API_URL = Platform.OS === 'android' ? "http://10.0.2.2:3000/store" : "http://localhost:3000/store";

export async function getDisplayServices() {
    // const url = Platform.OS === 'android' ? "http://10.0.2.2:3000/store" : "http://localhost:3000/store";

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