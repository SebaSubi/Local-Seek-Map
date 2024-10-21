import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
// import { Local } from "../../../schema/GeneralSchema";

export default function LocalPage() {
  //   const router = useRouter();
  const { id, name, image } = useLocalSearchParams();
  //   const [local, setLocal] = useState<Local | null>(null);

  async function fetchAndSetLocal() {
    // const local = await getLocal(id as string);
    // setLocal(local);
  }

  useEffect(() => {
    const fetchLocals = async () => {
      await fetchAndSetLocal();
    };
    fetchLocals();
  }, []); //podriamos agregar un boton para recargar la lista de locales y agregarlo al array de; useEffect

  return (
    <View className="flex justify-center">
      <Text className="text-5xl font-bold p-2 pl-5">{name}</Text>
      <View className="flex items-center">
        <Image
          className="h-96 w-96 justify-center align-center rounded-3xl"
          source={{
            uri: (image as string | null) ?? "https://via.placeholder.com/150",
          }}
        />
      </View>
    </View>
  );
}
