import { View, Text, Pressable } from "react-native";

interface BasicSelectableProps {
  logo?: any;
  text: string;
  style?: string;
  onPress?: () => void;
}

export default function BasicButton({
  logo,
  text,
  style,
  onPress,
}: BasicSelectableProps) {
  return (
    <Pressable
      className={`flex flex-row justify-center items-center w-2/3 bg-[#e1e8e8] h-10 rounded-2xl ${style}`}
      onPress={onPress}
    >
      {logo && (
        <View className="absolute left-0 ml-1 flex items-center justify-center h-7 w-7 bg-white rounded-full">
          {logo}
        </View>
      )}

      <Text>{text}</Text>
    </Pressable>
  );
}
