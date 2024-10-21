import { View, Text, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { colors } from "../../../constants/colors";
import { EmptyHeartIcon } from "../../../components/Logos";

export default function LocalPage() {
  const { name, image } = useLocalSearchParams();

  return (
    <View className="flex justify-center">
      <View className="flex flex-row justify-between">
        <Text className="text-5xl font-bold p-2 pl-5">{name}</Text>
        <View className="pr-5 p-2">
          <EmptyHeartIcon color={colors.primary.orange} size={36} />
        </View>
      </View>
      <View className="flex items-center object-cover">
        <View
          style={{
            borderRadius: 20,
            backgroundColor: colors.primary.bone,
          }}
        >
          <Image
            style={{
              height: 300,
              width: 300,
              borderRadius: 20,
              resizeMode: "contain",
              margin: 10,
            }}
            source={{
              uri: image as string,
            }}
          />
        </View>
        <View className="flex flex-row"></View>
      </View>
    </View>
  );
}
