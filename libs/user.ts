import axios from "axios";
import { Platform } from "react-native";

// const API_URL = `${process.env.EXPO_PUBLIC_API_ROUTE}/auth-v2`;
const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/auth-v2"
    : "http://localhost:3000/auth-v2";
// Platform.OS === "android"
//   ? "http://10.0.2.2:3000/auth-v2"
//   :

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
export async function getUserLocals(userEmail: string, userId?: string) {
  // console.log("We are in the API");  Esto hay que decomentar después, solo que nose como arreglar el auth en este momento
  // console.log(userId);
  // return await axios.get(`${API_URL}/user-locals`, {
  //   params: {
  //     userId: userId,
  //   },
  // });

  try {
    const rawData = await fetch(
      `http://localhost:3000/local-user/locals/${userEmail}`
    );
    if (!rawData.ok) {
      throw new Error("Failed to get local user stores");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting user stores", error);
  }
}

export async function deleteUser(userId: string) {
  return await axios.patch(`${API_URL}/delete-user`, {
    params: {
      userId: userId,
    },
  });
}

export async function requestStoreOwner(
  userEmail: string,
  optionalEmail: string | null,
  userId: string
) {
  // axios.defaults.headers.head;
  return await axios.post(
    `${API_URL}/request-store-owner`,
    {
      emails: [userEmail, optionalEmail],
      userId: userId,
    },
    {
      headers: {
        "Request-Store-Owner":
          "d6b1d6f4e0c3a6b3f9264a53d9bb1e4fae3a7d21477f0e9a98f4c3219bb17964",
      },
    }
  );
}

export async function getStoreOwnerRequests(userId: string) {
  return await axios.get(`${API_URL}/store-owner-requests`, {
    params: {
      userId: userId,
    },
  });
}
