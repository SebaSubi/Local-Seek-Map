import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import GoBackButton from "../../../components/GoBackButton";
import BasicSearchButton from "../../../components/BasicSearchBar";
import { colors } from "../../../constants/colors";
import BasicButton from "../../../components/BasicButton";
import { ReloadIcon } from "../../../components/Logos";
import { getAdminLocals } from "../../../libs/user";
import { Local } from "../../../schema/GeneralSchema";
import EditLocalContainer from "../../../components/EditLocalContainer";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AdminLocal() {
  const [search, setSearch] = useState("");
  const [locals, setLocals] = useState<Local[]>([]);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchData();
  }, [search]);

  const fetchData = async () => {
    const fetchedLocals = await getAdminLocals(search);
    // console.log(fetchedLocals);
    if (Array.isArray(fetchedLocals)) {
      setLocals(fetchedLocals);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
        <View className="flex flex-row items-center justify-between w-full ">
          <GoBackButton iconColor="white" style="ml-1" />
          <Text className="text-white font-semibold text-xl mt-1">
            Gestionar Locales
          </Text>
          <GoBackButton iconColor="white" style="ml-1 opacity-0" />
        </View>
        <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-start">
          <BasicSearchButton
            placeholder="Buscar Local"
            onSearch={setSearch}
            background={colors.primary.lightGray}
            style="my-4"
          />
          {locals.length !== 0 ? (
            <View className="flex-1 mt-4">
              <FlatList
                data={locals}
                horizontal={false}
                numColumns={2}
                renderItem={({ item }) => <EditLocalContainer local={item} />}
                keyExtractor={(item) => item?.id!}
                onRefresh={() => fetchData()}
                // refreshing={loading}
                refreshing={false}
              />
            </View>
          ) : null}

          <View
            className="flex justify-center items-center"
            style={{
              paddingBottom: insets.bottom,
            }}
          >
            <BasicButton
              text="Recargar"
              background={colors.primary.blue}
              textStyle="text-white font-bold ml-2"
              logo={<ReloadIcon color="#fff" />}
              style="w-28 pl-2 mt-2"
              onPress={() => fetchData()}
            />
          </View>
        </View>
      </View>
    </>
  );
}
