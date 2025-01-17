import { View, Text, Pressable } from "react-native";

interface BasicSelectableProps {
  logo?: any;
  text: string;
  style?: string;
  background?: string;
  onPress?: () => void;
}

export default function BasicButton({
  logo,
  text,
  style,
  onPress,
  background,
}: BasicSelectableProps) {
  return (
    <Pressable
      className={`flex flex-row justify-center items-center w-fit h-10 rounded-2xl ${style}`}
      style={{ backgroundColor: background ? background : "#e1e8e8" }}
      onPress={onPress}
    >
      {logo && (
        <View className="ml-1 flex items-center justify-center h-7 w-7 bg-white rounded-full">
          {logo}
        </View>
      )}

      <Text className="ml-2 mr-2">{text}</Text>
    </Pressable>
  );
}
