import { View, Text, Pressable } from "react-native";
import { InfoIcon, LogOutIcon } from "./Logos";

interface HeaderProps {
  title: string;
  props?: any;
}

export default function Header({ title, props }: HeaderProps) {
  return (
    <View className="flex flex-row items-end justify-between bg-[#324e64] rounded-bl-3xl rounded-br-3xl h-24 p-2">
      <Pressable className="ml-2">
        <LogOutIcon />
      </Pressable>
      <Text className="text-white font-bold text-lg" {...props}>
        {title}
      </Text>
      <Pressable className="mr-2">
        <InfoIcon />
      </Pressable>
    </View>
  );
}
