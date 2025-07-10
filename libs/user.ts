import axios from "axios";
import { Platform, Role } from "react-native";
import { DysplayUser, Local } from "../schema/GeneralSchema";

const API_URL = `${process.env.EXPO_PUBLIC_API_ROUTE}/auth-v2`;
// const API_URL =
//   Platform.OS === "android"
//     ? "http://10.0.2.2:3000/auth-v2"
//     : "http://localhost:3000/auth-v2";

export async function checkEmail(email: string) {
  try {
    const response = await axios.get(`${API_URL}/check-email/${email}`);
    return response.data; // Assuming the API returns a boolean or some data indicating the email's validity
  } catch (error) {
    console.log("Error checking email:", error);
  }
}

export async function checkUsername(username: string) {
  try {
    const response = await axios.get(`${API_URL}/check-username/${username}`);
    return response.data; // Assuming the API returns a boolean or some data indicating the email's validity
  } catch (error) {
    console.log("Error checking email:", error);
  }
}

export async function EditUser(user: {
  id: string;
  username: string;
  email: string;
  password: string;
}) {
  return await axios.patch(`${API_URL}/update-user`, user); // I changed all PUT to PATCH -Lucas  update: it works lmao
}

export async function EditUserAdmin(user: {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
}) {
  return await axios.patch(`${API_URL}/update-user-admin`, user); // I changed all PUT to PATCH -Lucas  update: it works lmao
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
  // console.log("here");
  try {
    const Locals = await axios.get(`${API_URL}/user-locals`, {
      params: {
        userId: userId,
      },
    });
    return Locals.data as Local[];
  } catch (error) {
    console.error("Error fetching user locals:", error);
  }
}

export async function deleteUser(userId: string) {
  return await axios.patch(`${API_URL}/delete-user`, { userId });
  // return await axios.patch(`${API_URL}/delete-user`, {
  //   params: {
  //     userId: userId,
  //   },
  // });
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

export async function getAllUsersBySearch(search: string = "") {
  try {
    const request = await axios.get(`${API_URL}/all-users?search=${search}`);
    return request.data as DysplayUser[];
  } catch (error) {
    console.error("Error fetching users by search:", error);
  }
}

export async function getAdminLocals(search: string = "") {
  // console.log("here");
  try {
    const Locals = await axios.get(`${API_URL}/admin-locals?search=${search}`);
    return Locals.data as Local[];
  } catch (error) {
    console.error("Error fetching admin locals:", error);
  }
}
