import { View, Text, Pressable } from "react-native";
import { InfoIcon, LogOutIcon } from "./Logos";
import { useAuth } from "../app/context/AuthContext";

interface HeaderProps {
  title: string;
  props?: any;
}

export default function Header({ title, props }: HeaderProps) {
  const { onLogout } = useAuth();
  return (
    <View className="flex flex-row items-end justify-between  bg-[#1a253d] rounded-b-3xl h-24 p-2">
      <Pressable className="ml-2" onPress={onLogout}>
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

//bg-[#324e64]
