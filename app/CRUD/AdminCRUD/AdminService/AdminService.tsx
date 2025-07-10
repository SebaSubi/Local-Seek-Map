import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import GoBackButton from "../../../../components/GoBackButton";
import BasicSearchButton from "../../../../components/BasicSearchBar";
import { colors } from "../../../../constants/colors";
import BasicButton from "../../../../components/BasicButton";
import { ReloadIcon } from "../../../../components/Logos";
import { Service } from "../../../../schema/GeneralSchema";
import { getAllServices } from "../../../../libs/serviceType";
import ServiceContainer from "../../../../components/ServiceContainer";

export default function AdminService() {
  const [search, setSearch] = useState("");
  const [services, setServices] = useState<Service[]>([]);

  const fetchLocalsData = async () => {
    setServices((await getAllServices(search)) ?? []);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      await fetchLocalsData();
    };
    fetchUsers();
    // console.log(services);
  }, [search]);
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
            Gestionar Servicios
          </Text>
          <GoBackButton iconColor="white" style="ml-1 opacity-0" />
        </View>
        <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-start">
          <BasicSearchButton
            placeholder="Buscar Servicio"
            onSearch={setSearch}
            background={colors.primary.lightGray}
            style="my-4"
          />
          {services.length !== 0 ? (
            <View className="w-full h-4/5 mt-4">
              <FlatList
                data={services}
                horizontal={false}
                numColumns={2}
                renderItem={({ item }) => (
                  <ServiceContainer
                    service={item}
                    pathname="/CRUD/AdminCRUD/AdminService/EditAdminService"
                  />
                )}
                keyExtractor={(item) => item?.id!}
                onRefresh={() => fetchLocalsData()}
                // refreshing={loading}
                refreshing={false}
              />
            </View>
          ) : null}

          <View className="flex justify-center items-center">
            <BasicButton
              text="Recargar"
              background={colors.primary.blue}
              textStyle="text-white font-bold ml-2"
              logo={<ReloadIcon color="#fff" />}
              style="w-28 pl-2 mt-2"
              onPress={() => fetchLocalsData()}
            />
          </View>
        </View>
      </View>
    </>
  );
}
