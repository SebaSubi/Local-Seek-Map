import { View, Text } from "react-native";

interface HeaderProps {
  title: string;
  props?: any;
}

export default function Header({ title, props }: HeaderProps) {
  return (
    <View className="flex items-center justify-end bg-[#324e64] rounded-bl-3xl rounded-br-3xl h-24 p-2">
      <Text className="text-white font-bold" {...props}>
        {title}
      </Text>
    </View>
  );
}
