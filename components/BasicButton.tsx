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
      className={`flex flex-row justify-evenly items-center w-fit h-10 rounded-3xl ${style}`}
      style={{ backgroundColor: background ? background : "#f8f8f8" }}
      onPress={onPress}
    >
      {logo && <>{logo}</>}

      <Text
        className={`${logo ? null : "ml-3"} mr-3 text-sm font-light ${textStyle}`}
      >
        {text}
      </Text>
    </Pressable>
  );
}
