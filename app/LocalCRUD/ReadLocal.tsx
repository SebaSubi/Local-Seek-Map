import { useEffect, useState } from "react";
import { Text, View, Pressable } from "react-native";
import { Stack } from "expo-router";
import Header from "../../components/Header";
import { Local } from "../../schema/GeneralSchema";
import { getLocals } from "../../libs/local";
import LocalContainer from "../../components/LocalContainer";

export default function ReadLocal() {
  const [locals, setLocals] = useState<Local[]>([]);

  async function fetchAndSetLocals() {
    const locals = await getLocals();
    setLocals(locals);
  }

  useEffect(() => {
    const fetchLocals = async () => {
      await fetchAndSetLocals();
      // console.log(locals);
    };
    fetchLocals();
  }, []); //podriamos agregar un boton para recargar la lista de locales y agregarlo al array de; useEffect

  return (
    <View className="flex items-center">
      <Stack.Screen
        options={{
          header: () => <Header title="Leer Local" />,
        }}
      />
      {locals?.map((local) => <LocalContainer key={local.id} local={local} />)}

      <Pressable
        className="flex items-center justify-center h-10 w-20 bg-slate-800 rounded-xl mt-2"
        onPress={async () => {
          await fetchAndSetLocals();
        }}
      >
        <Text className="text-white">Recargar</Text>
      </Pressable>
    </View>
  );
}
