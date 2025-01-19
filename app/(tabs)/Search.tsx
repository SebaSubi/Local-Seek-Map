import { Stack } from "expo-router";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/Header";
import BasicSearchButton from "../../components/BasicSearchBar";
import { useEffect, useState } from "react";
import {
  getDisplayLocals,
  getLocalsByCategory,
  getLocalsByName,
  getOpenLocals,
} from "../../libs/local";
import {
  getDisplayServices,
  getDisplayServicesByName,
  getOpenServices,
  getServicesByCategory,
} from "../../libs/localService";
import { getLocalTypes } from "../../libs/localType";
import { getServiceTypes } from "../../libs/serviceType";
import ServiceContainer from "../../components/ServiceContainer";
import LocalContainer from "../../components/LocalContainer";
import ReadWS from "../CRUD/ServiceCRUD/ReadWS";
import ReadLocal from "../CRUD/LocalCRUD/ReadLocal";
import React from "react";
import BasicButton from "../../components/BasicButton";
import { LocalIcon, ProductIcon, ServiceIcon } from "../../components/Logos";
import ReadProductScreen from "../CRUD/ProductCRUD/ReadProduct";

const avaliableItems = ["Locales", "Servicios", "Productos"];

export default function Search() {
  const [viewType, setViewType] = useState<"locals" | "products" | "services">(
    "locals",
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex flex-row items-center justify-center bg-[#1a253d] pt-[15%] z-10">
        <BasicButton
          text="Locales"
          style=" w-28 mr-2"
          logo={<LocalIcon />}
          onPress={() => setViewType("locals")}
          background={viewType === "locals" ? "#ff6c3d" : "#ffffff"}
        />
        <BasicButton
          text="Servicios"
          style="w-28 mr-2"
          logo={<ServiceIcon />}
          onPress={() => setViewType("services")}
          background={viewType === "services" ? "#ff6c3d" : "#ffffff"}
        />
        <BasicButton
          text="Productos"
          style="w-28"
          logo={<ProductIcon />}
          onPress={() => setViewType("products")}
          background={viewType === "products" ? "#ff6c3d" : "#ffffff"}
        />
      </View>
      <View
        className="w-full h-full mt-[-13%]"
        style={{ display: viewType === "locals" ? "flex" : "none" }}
      >
        <ReadLocal />
      </View>
      <View
        className="w-full h-full mt-[-13%]"
        style={{ display: viewType === "services" ? "flex" : "none" }}
      >
        <ReadWS />
      </View>
      <View
        className="w-full h-full mt-[-13%]"
        style={{ display: viewType === "products" ? "flex" : "none" }}
      >
        <ReadProductScreen />
      </View>
    </>
  );
}
