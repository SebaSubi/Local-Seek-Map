import { Stack } from "expo-router";
import { Platform, View } from "react-native";
import { useEffect, useState } from "react";
import ReadWS from "../CRUD/ServiceCRUD/ReadWS";
import ReadLocal from "../CRUD/LocalCRUD/ReadLocal";
import React from "react";
import BasicButton from "../../components/BasicButton";
import { LocalIcon, ProductIcon, ServiceIcon } from "../../components/Logos";
import ReadProductScreen from "../CRUD/ProductCRUD/ReadProduct";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function Search() {
  const [viewType, setViewType] = useState<"locals" | "products" | "services">(
    "locals"
  );

  return (
    <SafeAreaView
      className="flex-1 bg-defaultBlue"
      style={{
        paddingTop: Platform.OS === "android" ? 18 : 0,
        // paddingBottom: Platform.OS === "android" ? 28 : 0,
        paddingBottom: Platform.OS === "android" ? 99 : 0,
      }}
    >
      <StatusBar style="light" backgroundColor="#1a253d" />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex flex-row items-center justify-center bg-[#1a253d] z-10">
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
    </SafeAreaView>
  );
}
