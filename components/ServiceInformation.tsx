import { Platform, Text, View } from "react-native";
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

export default function ServiceInformation({
  reservationURL,
  instagram,
  facebook,
  webpage,
  location,
  coordinates,
  reservationNumber,
}: {
  reservationURL?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  webpage?: string | null;
  location?: string | null;
  coordinates?: string | null;
  reservationNumber?: string | null;
}) {
  //URL schemas for different apps require specific caracters, here we replace the original caracters for the ones accepted by the URL
  const urlLocation = location?.replaceAll(" ", "+");
  const urlCoordinates = coordinates?.replaceAll(", ", "%2C");
  const wppNumber = reservationURL?.replaceAll("+", "");

  return (
    <View className="flex flex-col justify-start items-center w-full h-full">
      {location ? (
        <>
          <View
            className="flex w-full h-[40%] overflow-hidden mb-4"
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
          {reservationURL ? (
            <Link href={`https://wa.me/${wppNumber}`}>
              <View className="flex w-full items-start ">
                <View className="flex flex-row items center">
                  <Text className="text-2xl font-bold text-[#1a253d] ml-2 mt-3">
                    URL de Reservas
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
                    {reservationURL}
                  </Text>
                  <View className="ml-1">
                    <ArrowUpRightBox size={10} />
                  </View>
                </View>
              </View>
            </Link>
          ) : null}
          {reservationNumber ? (
            <Link href={`https://wa.me/${wppNumber}`}>
              <View className="flex w-full items-start ">
                <View className="flex flex-row items center">
                  <Text className="text-2xl font-bold text-[#1a253d] ml-2 mt-3">
                    Numero de Reserva
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
                    {reservationNumber}
                  </Text>
                  <View className="ml-1">
                    <ArrowUpRightBox size={10} />
                  </View>
                </View>
              </View>
            </Link>
          ) : null}
          {instagram ? (
            <Link href={`instagram://user?username=${instagram}`}>
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
    </View>
  );
}

{
  /* <InformationSlot text={location} Icon={LocationIcon} IconColor="#e40033" />; */
}
