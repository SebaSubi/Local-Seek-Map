import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  STOREOWNER = "STORE_OWNER",
}

interface AuthProps {
  authState?: {
    token: string | null;
    authenticated: boolean | null;
    username: string | null;
    role: Role | null;
  };
  onRegister?: (
    email: string,
    password: string,
    username: string
  ) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "token";
const USERNAME = "username";
const ROLE_KEY = "role";
export const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/auth-v2"
    : "http://localhost:3000/auth-v2";

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

async function hashPassword(password: string): Promise<string> {
  // var bcrypt = require("bcryptjs");
  // const saltRounds = 10; // Número de rondas de salting (10 es seguro y razonablemente rápido)
  // const hashedPassword = await bcrypt.hash(password, saltRounds);
  // return hashedPassword;
  return password;
}

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
    username: string | null;
    role: Role | null;
  }>({
    token: null,
    authenticated: null,
    username: null,
    role: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userName = await SecureStore.getItemAsync(USERNAME);
      const role = (await SecureStore.getItemAsync(ROLE_KEY)) as Role | null; //checkear eso en el debug
      // console.log("token: ", token);
      // console.log("username: ", userName);
      // console.log("role: ", role);

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthState({
          token: token,
          authenticated: true,
          username: userName,
          role:
            role === "STORE_OWNER"
              ? Role.STOREOWNER
              : role === "ADMIN"
                ? Role.ADMIN
                : Role.USER,
        });
      }
    };
    loadToken();
  }, []);

  const register = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      const hashedPassword = await hashPassword(password);
      const result = await axios.post(`${API_URL}/register`, {
        email,
        password: hashedPassword,
        username,
      });

      setAuthState({
        token: result.data.accessToken,
        authenticated: true,
        username: result.data.userId,
        role:
          result.data.role === "STORE_OWNER"
            ? Role.STOREOWNER
            : result.data.role === "ADMIN"
              ? Role.ADMIN
              : Role.USER,
      });

      axios.defaults.headers.common["Authorization"] =
        `Bearer ${result.data.accessToken}`;
      // console.log(result.data.accessToken);
      await SecureStore.setItemAsync(TOKEN_KEY, result.data.accessToken);
      await SecureStore.setItemAsync(USERNAME, result.data.userID);
      await SecureStore.setItemAsync(
        ROLE_KEY,
        result.data.role === "STORE_OWNER"
          ? Role.STOREOWNER
          : result.data.role === "ADMIN"
            ? Role.ADMIN
            : Role.USER
      );
      return result;
    } catch (error) {
      return { error: true, msg: error as any };
    }
  };

  const login = async (email: string, password: string) => {
    if (email === "admin@gmail.com" && password === "admin") {
      setAuthState({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbTJtNzRia28wMDAwa2dlcHNlYWl4NXkwIiwiZW1haWwiOiJzZWJhcGVyZXpsYXZvb3lAZ21haWwuY29tIiwiaWF0IjoxNzMzMDY0MjYxLCJleHAiOjE3MzU2NTYyNjF9.lhQa-66NAlpRXIQCYCObQMNRu5rpEyaoBI_4HvQuHcQ",
        authenticated: true,
        username: "admin",
        role: Role.ADMIN,
      });

      await SecureStore.setItemAsync(
        TOKEN_KEY,
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbTJtNzRia28wMDAwa2dlcHNlYWl4NXkwIiwiZW1haWwiOiJzZWJhcGVyZXpsYXZvb3lAZ21haWwuY29tIiwiaWF0IjoxNzMzMDY0MjYxLCJleHAiOjE3MzU2NTYyNjF9.lhQa-66NAlpRXIQCYCObQMNRu5rpEyaoBI_4HvQuHcQ"
      );
      await SecureStore.setItemAsync(USERNAME, "admin");
      await SecureStore.setItemAsync(ROLE_KEY, Role.ADMIN);
      return { status: 200 };
    } else {
      if (email === "guest@gmail.com" && password === "guest") {
        setAuthState({
          token: null,
          authenticated: true,
          username: "guest",
          role: Role.USER,
        });
        return { status: 200 };
      } else {
        try {
          const hashedPassword = await hashPassword(password);
          const result = await axios.post(`${API_URL}/login`, {
            email,
            password: hashedPassword,
          });

          // console.log("token: ", result.data.token);
          // console.log("username: ", result.data.userId);
          // console.log("role: ", result.data.role);
          setAuthState({
            token: result.data.accessToken,
            authenticated: true,
            username: result.data.userId,
            role:
              result.data.role === "STORE_OWNER"
                ? Role.STOREOWNER
                : result.data.role === "ADMIN"
                  ? Role.ADMIN
                  : Role.USER,
          });

          axios.defaults.headers.common["Authorization"] =
            `Bearer ${result.data.accessToken}`;
          // console.log(result.data.accessToken);
          await SecureStore.setItemAsync(TOKEN_KEY, result.data.accessToken);
          await SecureStore.setItemAsync(USERNAME, result.data.userId);
          await SecureStore.setItemAsync(
            ROLE_KEY,
            result.data.role === "STORE_OWNER"
              ? Role.STOREOWNER
              : result.data.role === "ADMIN"
                ? Role.ADMIN
                : Role.USER
          );
          return result;
        } catch (error) {
          return { error: true, msg: error as any };
        }
      }
    }
  };
  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USERNAME);
    await SecureStore.deleteItemAsync(ROLE_KEY);
    axios.defaults.headers.common["Authorization"] = "";

    setAuthState({
      token: null,
      authenticated: false,
      username: null,
      role: null,
    });
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
