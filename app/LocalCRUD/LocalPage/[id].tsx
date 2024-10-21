import { View, Text, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
// import { Local } from "../../../schema/GeneralSchema";

export default function LocalPage() {
  const { name, image } = useLocalSearchParams();

  return (
    <View className="flex justify-center">
      <Text className="text-5xl font-bold p-2 pl-5">{name}</Text>
      <View className="flex items-center object-cover">
        <Image
          // className="h-96 w-96 justify-center align-center rounded-3xl"
          style={{
            height: 300,
            width: 300,
            borderRadius: 20,
            resizeMode: "contain",
            backgroundColor: "gray",
            padding: 5,
          }}
          source={{
            uri: image as string,
          }}
        />
      </View>
    </View>
  );
}
