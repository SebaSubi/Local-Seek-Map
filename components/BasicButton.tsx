import { View, Text, Pressable } from "react-native";

interface BasicSelectableProps {
  logo?: any;
  text: string;
  style?: string;
  background?: string;
  onPress?: () => void;
  textStyle?: string;
}

export default function BasicButton({
  logo,
  text,
  style,
  onPress,
  background,
  textStyle,
}: BasicSelectableProps) {
  return (
    <Pressable
      className={`flex flex-row justify-evenly items-center w-fit h-11 rounded-3xl ${style}`}
      style={{ backgroundColor: background ? background : "#f8f8f8" }}
      onPress={onPress}
    >
      {logo && (
        <View className="ml-1 flex items-center justify-center h-7 w-7 bg-white rounded-full">
          {logo}
        </View>
      )}

      <Text className={`ml-3 mr-3 ${textStyle}`}>{text}</Text>
    </Pressable>
  );
}
