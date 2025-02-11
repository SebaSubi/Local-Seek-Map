import { Platform, Text, View, Linking, ScrollView } from "react-native";
import React from "react";
import {
  InstagramIcon,
  FacebookIcon,
  WebIcon,
  LocationIcon,
  ArrowUpRightBox,
  WhatsAppIcon,
} from "./Logos";
import { Link } from "expo-router";
import LocalMap from "./LocalMap";
import { colors } from "../constants/colors";

export default function LocalInformation({
  whatsapp,
  instagram,
  facebook,
  webpage,
  location,
  coordinates,
}: {
  whatsapp?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  webpage?: string | null;
  location?: string | null;
  coordinates?: string | null;
}) {
  //URL schemas for different apps require specific caracters, here we replace the original caracters for the ones accepted by the URL
  const urlLocation = location?.replaceAll(" ", "+");
  const urlCoordinates = coordinates?.replaceAll(", ", "%2C");
  const wppNumber = whatsapp?.replaceAll("+", "");

  return (
    <ScrollView
      className="flex flex-col w-full h-full"
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {location ? (
        <>
          <View
            className="flex w-full h-72 overflow-hidden mb-4"
            style={{
              borderRadius: 20,
              backgroundColor: colors.primary.lightGray,
            }}
          >
            <LocalMap localCoordinates={coordinates as string} />
          </View>
          <Link
            href={
              Platform.OS === "android"
                ? `https://www.google.com/maps/search/?api=1&query=${urlLocation}`
                : `http://maps.apple.com/?ll=${urlCoordinates}&q=${urlLocation}&t=k`
            }
          >
            <View className="flex w-full items-start ">
              <View className="flex flex-row items center">
                <Text className="text-2xl font-bold text-[#1a253d] ml-2 mt-3">
                  Ubicación
                </Text>
                <View className="ml-1 mt-4">
                  <ArrowUpRightBox size={10} />
                </View>
              </View>
              <View className="flex flex-row items-center">
                <View className="ml-2">
                  <LocationIcon size={20} />
                </View>
                <Text className="flex-wrap w-[90%] text-base font-bold text-[#1a253d] ml-2 mt-1">
                  {location}
                </Text>
              </View>
            </View>
          </Link>
          {/* {instagram ? (
            <Link
              href={`instagram://user?username=${instagram}`}
              className="mt-3"
            >
              <View className="flex w-full items-start">
                <View className="flex flex-row items center">
                  <Text className="text-2xl font-bold text-[#1a253d] ml-2 mt-3">
                    Instagram
                  </Text>
                  <View className="ml-1 mt-4">
                    <ArrowUpRightBox size={10} />
                  </View>
                </View>
                <View className="flex flex-row items-center">
                  <View className="ml-2">
                    <InstagramIcon size={20} />
                  </View>
                  <Text className="text-base font-bold text-[#1a253d] ml-2 mt-1">
                    {instagram}
                  </Text>
                </View>
              </View>
            </Link>
          ) : null} */}
          {instagram ? (
            <Link
              href={`https://www.instagram.com/${instagram}`}
              onPress={() => {
                const instagramURL = `instagram://user?username=${instagram}`;
                const webURL = `https://www.instagram.com/${instagram}`;

                // Verifica si la app de Instagram está instalada
                Linking.canOpenURL(instagramURL)
                  .then((supported) => {
                    if (supported) {
                      Linking.openURL(instagramURL); // Abre la app si está instalada
                    } else {
                      Linking.openURL(webURL); // Si no, abre en el navegador
                    }
                  })
                  .catch((err) =>
                    console.error("Error al abrir Instagram:", err)
                  );
              }}
            >
              <View className="flex w-full items-start">
                <View className="flex flex-row items center">
                  <Text className="text-2xl font-bold text-[#1a253d] ml-2 mt-3">
                    Instagram
                  </Text>
                  <View className="ml-1 mt-4">
                    <ArrowUpRightBox size={10} />
                  </View>
                </View>
                <View className="flex flex-row items-center">
                  <View className="ml-2">
                    <InstagramIcon size={20} />
                  </View>
                  <Text className="text-base font-bold text-[#1a253d] ml-2 mt-1">
                    {instagram}
                  </Text>
                </View>
              </View>
            </Link>
          ) : null}
          {whatsapp ? (
            <Link href={`https://wa.me/${wppNumber}`}>
              <View className="flex w-full items-start ">
                <View className="flex flex-row items center">
                  <Text className="text-2xl font-bold text-[#1a253d] ml-2 mt-3">
                    WhatsApp
                  </Text>
                  <View className="ml-1 mt-4">
                    <ArrowUpRightBox size={10} />
                  </View>
                </View>
                <View className="flex flex-row items-center">
                  <View className="ml-2">
                    <WhatsAppIcon size={20} />
                  </View>
                  <Text className="text-base font-bold text-[#1a253d] ml-2 mt-1">
                    {whatsapp}
                  </Text>
                  <View className="ml-1">
                    <ArrowUpRightBox size={10} />
                  </View>
                </View>
              </View>
            </Link>
          ) : null}
          {facebook ? (
            <Link
              href={`https://www.facebook.com/${facebook}`}
              className="mt-3"
            >
              <View className="flex w-full items-start">
                <View className="flex flex-row items center">
                  <Text className="text-2xl font-bold text-[#1a253d] ml-2 mt-3">
                    FaceBook
                  </Text>
                  <View className="ml-1 mt-4">
                    <ArrowUpRightBox size={10} />
                  </View>
                </View>
                <View className="flex flex-row items-center">
                  <View className="ml-2">
                    <FacebookIcon size={20} />
                  </View>
                  <Text className="text-base font-bold text-[#1a253d] ml-2 mt-1">
                    {instagram}
                  </Text>
                </View>
              </View>
            </Link>
          ) : null}
          {webpage ? (
            <Link href={webpage} className="mt-3 w-full">
              <View className="flex w-full items-start">
                <View className="flex flex-row items center">
                  <Text className="text-2xl font-bold text-[#1a253d] ml-2 mt-3">
                    Pagina Web
                  </Text>
                  <View className="ml-1 mt-4">
                    <ArrowUpRightBox size={10} />
                  </View>
                </View>
                <View className="flex flex-row items-center w-full">
                  <View className="ml-2">
                    <WebIcon size={20} />
                  </View>
                  <Text className="flex-wrap text-base font-bold text-[#1a253d] ml-2 mr-4 mt-1">
                    {webpage}
                  </Text>
                </View>
              </View>
            </Link>
          ) : null}
        </>
      ) : null}
    </ScrollView>
  );
}

{
  /* <InformationSlot text={location} Icon={LocationIcon} IconColor="#e40033" />; */
}
