import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { WarningIcon } from "./Logos";

export default function BasicWarning({
  text,
  cancelButton = true,
  buttonRight,
  buttonLeft,
  onPressRight,
  onPressLeft,
  style,
}: {
  text: string;
  cancelButton: boolean;
  buttonRight?: string;
  buttonLeft?: string;
  style?: string;
  onPressRight?: () => void;
  onPressLeft?: () => void;
}) {
  return (
    <View
      className={`flex flex-col items-center justify-center w-72 h-fit pt-12 pb-14 rounded-xl bg-white shadow-lg ${style}`}
    >
      <View className="absolute top-4">
        <WarningIcon />
      </View>
      <Text className="ml-5 mr-5 text-lg font-light text-center">{text}</Text>
      {cancelButton ? (
        <TouchableOpacity
          style={{
            borderTopWidth: 2,
            borderRightWidth: 2,
            borderTopColor: "#f8f8f8",
            borderRightColor: "#f8f8f8",
          }}
          className="flex flex-col items-center justify-center absolute bottom-0 rounded-sm w-full h-12"
          onPress={onPressLeft}
        >
          <Text>Ok</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            style={{
              borderTopWidth: 2,
              borderRightWidth: 2,
              borderTopColor: "#f8f8f8",
              borderRightColor: "#f8f8f8",
            }}
            className="flex flex-col items-center justify-center absolute bottom-0 left-0 rounded-sm w-1/2 h-12"
            onPress={onPressLeft}
          >
            <Text>{buttonLeft}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderTopWidth: 2,
              borderTopColor: "#f8f8f8",
            }}
            className="flex flex-col items-center justify-center absolute bottom-0 right-0 rounded-sm w-1/2 h-12"
            onPress={onPressRight}
          >
            <Text className="text-red-500">{buttonRight}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
