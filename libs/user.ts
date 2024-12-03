import axios from "axios";
import { Platform } from "react-native";

const API_URL =
    Platform.OS === "android"
        ? "http://10.0.2.2:3000/auth-v2"
        : "http://localhost:3000/auth-v2";

export async function checkEmail(email: string) {
    return await axios.get(`${API_URL}/check-email/${email}`)
}

export async function checkUsername(username: string) {
    return await axios.get(`${API_URL}/check-username/${username}`)
}