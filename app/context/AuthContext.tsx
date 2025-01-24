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

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: Role;
}
interface AuthProps {
  authState?: {
    token: string | null;
    authenticated: boolean | null;
    user: AuthUser | null;
  };
  onRegister?: (
    email: string,
    password: string,
    username: string,
  ) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "token";
const USER_ID = "userid";
const USERNAME = "userinfo";
const PASSWORD = "userpass";
const EMAIL = "useremail";
const ROLE = "role";

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

function getRole(role: string): Role {
  switch (role) {
    case "STORE_OWNER":
      return Role.STOREOWNER;

    case "ADMIN":
      return Role.ADMIN;

    default:
      return Role.USER;
  }
}

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
    user: AuthUser | null;
  }>({
    token: null,
    authenticated: null,
    user: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userId = await SecureStore.getItemAsync(USER_ID);
      const username = await SecureStore.getItemAsync(USERNAME);
      const email = await SecureStore.getItemAsync(EMAIL);
      const password = await SecureStore.getItemAsync(PASSWORD);
      const role = (await SecureStore.getItemAsync(ROLE)) as Role | null;
      // console.log("token: ", token);
      // console.log("username: ", userName);
      // console.log("role: ", role);

      if (token && userId && username && email && password && role) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthState({
          token: token,
          authenticated: true,
          user: {
            id: userId,
            email: email,
            username: username,
            password: password,
            role: getRole(role),
          },
        });
      }
    };
    loadToken();
  }, []);

  const register = async (
    email: string,
    password: string,
    username: string,
  ) => {
    try {
      const hashedPassword = await hashPassword(password);
      const result = await axios.post(`${API_URL}/register`, {
        email,
        password: hashedPassword,
        username,
      });

      if (result?.data.accessToken) {
        const user = {
          id: result.data.userId,
          email: email,
          username: result.data.username,
          password: password,
          role: getRole(result.data.role),
        };

        setAuthState({
          token: result.data.accessToken,
          authenticated: true,
          user: user,
        });

        axios.defaults.headers.common["Authorization"] =
          `Bearer ${result.data.accessToken}`;
        // console.log(result.data.accessToken);
        await Promise.all([
          SecureStore.setItemAsync(TOKEN_KEY, result.data.accessToken),
          SecureStore.setItemAsync(USER_ID, user.id),
          SecureStore.setItemAsync(USERNAME, user.username),
          SecureStore.setItemAsync(EMAIL, email),
          SecureStore.setItemAsync(PASSWORD, password),
          SecureStore.setItemAsync(ROLE, user.role),
        ]);
      }

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
        user: {
          id: "Max Verstappen",
          username: "Admin",
          email: "admin@gmail.com",
          password: "admin",
          role: Role.ADMIN,
        },
      });

      await Promise.all([
        SecureStore.setItemAsync(
          TOKEN_KEY,
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbTV2NnJ5ejQwMDAwN21lNGZqdms3OTBiIiwiZW1haWwiOiJzZWJhcGVyZXpsYXZvb3lAZ21haWwuY29tIiwiaWF0IjoxNzM3NTYwNTg5LCJleHAiOjE3NDAxNTI1ODl9.su-5Y-ygDxSRgrJwxwXcfZ8RLvNYqiuWW8soHQbrDjc"
        ),
        SecureStore.setItemAsync(USER_ID, "Max Verstappen"),
        SecureStore.setItemAsync(USERNAME, "Admin"),
        SecureStore.setItemAsync(EMAIL, "admin@gmail.com"),
        SecureStore.setItemAsync(PASSWORD, "admin"),
        SecureStore.setItemAsync(ROLE, Role.ADMIN),
      ]);
      return { status: 200 };
    } else {
      if (email === "guest@gmail.com" && password === "guest") {
        setAuthState({
          token: null,
          authenticated: true,
          user: {
            id: "1",
            email: "guest@gmail.com",
            username: "guest",
            password: "guest",
            role: Role.USER,
          },
        });
        return { status: 200 };
      } else {
        try {
          const hashedPassword = await hashPassword(password);
          const result = await axios.post(`${API_URL}/login`, {
            email,
            password: hashedPassword,
          });

          // console.log("RESULT: ", result);
          // console.log("token: ", result.data.token);
          // console.log("username: ", result.data.userId);
          // console.log("role: ", result.data.role);
          if (result?.data.accessToken) {
            const user = {
              id: result.data.userId,
              email: email,
              username: result.data.username,
              password: password,
              role: getRole(result.data.role),
            };

            setAuthState({
              token: result.data.accessToken,
              authenticated: true,
              user: user,
            });

            axios.defaults.headers.common["Authorization"] =
              `Bearer ${result.data.accessToken}`;
            // console.log(result.data.accessToken);
            await Promise.all([
              SecureStore.setItemAsync(TOKEN_KEY, result.data.accessToken),
              SecureStore.setItemAsync(USER_ID, user.id),
              SecureStore.setItemAsync(USERNAME, user.username),
              SecureStore.setItemAsync(EMAIL, email),
              SecureStore.setItemAsync(PASSWORD, password),
              SecureStore.setItemAsync(ROLE, user.role),
            ]);
          }

          return result;
        } catch (error) {
          return { error: true, msg: error as any };
        }
      }
    }
  };
  const logout = async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_ID),
      SecureStore.deleteItemAsync(EMAIL),
      SecureStore.deleteItemAsync(USERNAME),
      SecureStore.deleteItemAsync(PASSWORD),
      SecureStore.deleteItemAsync(ROLE),
    ]);
    axios.defaults.headers.common["Authorization"] = "";

    setAuthState({
      token: null,
      authenticated: false,
      user: null,
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
