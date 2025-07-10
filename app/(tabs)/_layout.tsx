import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { ReadLogo, SearchIcon, PersonCircleIcon } from "../../components/Logos";
import { Role, useAuth } from "../context/AuthContext";
import Header from "../../components/Header";
import User from "./User";

export default function TabLayout() {
  const { authState } = useAuth();
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}>
      <Tabs.Screen
        name="Home"
        options={{
          title: "Inicio",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          title: "Buscar",
          headerShown: true,
          tabBarIcon: ({ color }) => <SearchIcon color={color} />,
        }}
      />
      <Tabs.Screen
        redirect={authState?.user?.role === Role.USER} //we have to use the role that we DON'T want to be able to access this.
        name="CRUD"
        options={{
          title: "AMB",
          tabBarIcon: ({ color }) => <ReadLogo />,
        }}
      />
      <Tabs.Screen
        // redirect={authState?.role === Role.USER}  //everyone should be able to access this, on this part you can login or
        name="User"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <PersonCircleIcon color={color} size={28} />
          ),
        }}
      />
    </Tabs>
  );
}
