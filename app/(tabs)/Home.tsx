import { View, Text, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";
import SearchComponent from "../../components/SearchComponent";
import { Stack } from "expo-router";
import Header from "../../components/Header";

export default function Tab() {
  const { onLogout } = useAuth();

  return (
    <View className="h-full">
      <Stack.Screen
        options={{
          header: () => <Header title="Principal" />,
        }}
      />
      <View className="h-4/6">
        <SearchComponent searchType={undefined} />
      </View>
      <Pressable
        className="flex items-center justify-center"
        onPress={onLogout}
      >
        <Text className="text-xl">Log Out</Text>
      </Pressable>
    </View>
  );
}
