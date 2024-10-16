import { Pressable, Text, View } from "react-native";
import { WarningIcon } from "./Logos";

export default function BasicWarning({
  text,
  buttonRight,
  buttonLeft,
  onPressRight,
  onPressLeft,
  style,
}: {
  text: string;
  buttonRight: string;
  buttonLeft: string;
  style?: string;
  onPressRight?: () => void;
  onPressLeft?: () => void;
}) {
  return (
    <View
      className={`flex flex-col items-center justify-center w-3/4 h-1/2 rounded-xl bg-[#e1e8e8] shadow-lg ${style}`}
    >
      <View className="absolute top-4">
        <WarningIcon />
      </View>
      <Text className="ml-5 mr-5 text-lg text-center">{text}</Text>
      <Pressable
        style={{
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderTopColor: "white",
          borderRightColor: "white",
        }}
        className="flex flex-col items-center justify-center absolute bottom-0 left-0 rounded-sm w-1/2 h-12"
        onPress={onPressLeft}
      >
        <Text>{buttonLeft}</Text>
      </Pressable>
      <Pressable
        style={{
          borderTopWidth: 1,
          borderTopColor: "white",
        }}
        className="flex flex-col items-center justify-center absolute bottom-0 right-0 rounded-sm w-1/2 h-12"
        onPress={onPressRight}
      >
        <Text className="text-red-500">{buttonRight}</Text>
      </Pressable>
    </View>
  );
}
