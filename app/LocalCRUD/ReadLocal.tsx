import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Local } from "../../schema/GeneralSchema";
import { getLocals } from "../../libs/local";

export default function ReadLocal() {
  const [locals, setLocals] = useState<Local[]>([]);

  useEffect(() => {
    const fetchLocals = async () => {
      const locals = await getLocals();
      setLocals(locals);
    };
    fetchLocals();
  }, []);

  return (
    <View>
      {locals.map((local) => (
        <View
          key={local.id}
          className="flex flex-col items-center justify-center"
        >
          <View className="flex flex-row items-center justify-center h-8 w-2/3 bg-slate-300 rounded-2xl">
            <Text className="mt-1 ml-1 font-bold">{local.name}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
