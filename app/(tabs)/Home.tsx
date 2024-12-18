import { View, Text, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";
import SearchComponent from "../../components/SearchComponent";
import { Stack } from "expo-router";
import Header from "../../components/Header";

export default function Tab() {
  const { onLogout } = useAuth();

  return (
    <View className="h-full flex">
      <Stack.Screen
        options={{
          header: () => <Header title="Home" />,
        }}
      />
      <View className="flex-1">
        <SearchComponent searchType={undefined} />
      </View>
      <Pressable
        className="h-10 bg-red-500 flex items-center justify-center"
        onPress={onLogout}
      >
        <Text className="text-xl text-white">Log Out</Text>
      </Pressable>
    </View>
  );
}
