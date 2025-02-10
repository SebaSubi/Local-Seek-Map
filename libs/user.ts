import axios from "axios";
import { Platform } from "react-native";

const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/auth-v2"
    : "http://localhost:3000/auth-v2";

export async function checkEmail(email: string) {
  return await axios.get(`${API_URL}/check-email/${email}`);
}

export async function checkUsername(username: string) {
  return await axios.get(`${API_URL}/check-username/${username}`);
}

export async function EditUser(user: {
  id: string;
  username: string;
  email: string;
  password: string;
}) {
  return await axios.patch(`${API_URL}/update-user`, user); // I changed all PUT to PATCH -Lucas  update: it works lmao
}

export type UserLocal = {
  id: string;
  name: string;
  location: string;
  address: string;
  whatsapp: string;
  webpage: string;
  facebook: string;
  instagram: string;
  imgURL: string;
  localTypes: {
    id: string;
    name: string;
  };
};
export async function getUserLocals(userId: string) {
  return await axios.get(`${API_URL}/user-locals`, {
    params: {
      userId: userId,
    },
  });
}
