import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function BasicSelectable({
  href,
  logo,
  text,
  style,
  background,
  params,
}: {
  href: string;
  logo?: any;
  text: string;
  style?: string;
  background?: string;
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
        className={`flex flex-row justify-center items-center h-10 rounded-3xl ${style ? style : " w-2/3 "}`}
        style={{ backgroundColor: background ? background : "#fff" }}
      >
        {logo ? (
          <View className="ml-1 flex items-center justify-center h-7 w-7 bg-white rounded-full">
            {logo}
          </View>
        ) : null}

        <Text className="ml-3 mr-3 text-sm font-light">{text}</Text>
      </Pressable>
    </Link>
  );
}
