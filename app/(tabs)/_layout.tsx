import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { ReadLogo, SearchIcon } from "../../components/Logos";
import { Role, useAuth } from "../context/AuthContext";
import Header from "../../components/Header";

export default function TabLayout() {
  const { authState } = useAuth();
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}>
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          title: "Search",
          headerShown: true,
          tabBarIcon: ({ color }) => <SearchIcon />,
        }}
      />
      <Tabs.Screen
        redirect={authState?.role === Role.USER} //we have to use the role that we DON'T want to be able to access this.
        name="CRUD"
        options={{
          title: "AMB",
          tabBarIcon: ({ color }) => <ReadLogo />,
        }}
      />
    </Tabs>
  );
}
