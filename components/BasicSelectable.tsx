import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function BasicSelectable({
  href,
  logo,
  text,
  style,
  params,
}: {
  href: string;
  logo?: any;
  text: string;
  style?: string;
  params?: any;
}) {
  return (
    <Link
      asChild
      href={{
        pathname: href,
        params: params,
      }}
    >
      <Pressable
        className={`flex flex-row justify-center items-center w-2/3 bg-[#f6f6f6] h-10 rounded-2xl ${style}`}
      >
        {logo ? (
          <View className="absolute left-0 ml-1 flex items-center justify-center h-7 w-7 bg-white rounded-full">
            {logo}
          </View>
        ) : null}

        <Text>{text}</Text>
      </Pressable>
    </Link>
  );
}
