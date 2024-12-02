import { View, Text, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";
import SearchComponent from "../../components/SearchComponent";

export default function Tab() {
  const { onLogout } = useAuth();

  return (
    <View className="h-full">
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
