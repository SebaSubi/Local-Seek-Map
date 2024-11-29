import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { ReadLogo, SearchIcon } from "../../components/Logos";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}>
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <SearchIcon />,
        }}
      />
      <Tabs.Screen
        name="CRUD"
        options={{
          title: "AMB",
          tabBarIcon: ({ color }) => <ReadLogo />,
        }}
      />
    </Tabs>
  );
}
