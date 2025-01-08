import { Platform, View } from "react-native";
import React from "react";
import InformationSlot from "./InformationSlot";
import { InstagramIcon, FacebookIcon, WebIcon, LocationIcon } from "./Logos";
import { Link, Stack } from "expo-router";
import Header from "./Header";
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
    <View className="flex flex-col justify-start items-center w-full">
      {location ? (
        <>
          <View
            className="flex w-10/12 h-1/2 overflow-hidden mb-4"
            style={{
              borderRadius: 20,
              backgroundColor: colors.primary.lightGray,
            }}
          >
            <Link
              href={
                Platform.OS === "android"
                  ? `https://www.google.com/maps/search/?api=1&query=${urlLocation}`
                  : `http://maps.apple.com/?ll=${urlCoordinates}&q=${urlLocation}&t=k`
              }
            >
              <LocalMap localCoordinates={coordinates as string} />
            </Link>
          </View>
          <Link
            href={
              Platform.OS === "android"
                ? `https://www.google.com/maps/search/?api=1&query=${urlLocation}`
                : `http://maps.apple.com/?ll=${urlCoordinates}&q=${urlLocation}&t=k`
            }
          >
            <View className="flex w-full items-center">
              <InformationSlot
                text={location}
                Icon={LocationIcon}
                IconColor="#e40033"
              />
            </View>
          </Link>
        </>
      ) : null}
      {whatsapp ? (
        <Link href={`https://wa.me/${wppNumber}`}>
          <View className="flex w-full items-center ">
            <InformationSlot text={`${whatsapp}`} />
          </View>
        </Link>
      ) : null}
      {instagram ? (
        <Link href={`instagram://user?username=${instagram}`} className="mt-3">
          <View className="flex w-full items-center">
            <InformationSlot
              text={instagram}
              Icon={InstagramIcon}
              IconColor="#fe0b81"
            />
          </View>
        </Link>
      ) : null}
      {facebook ? (
        <Link href={`https://www.facebook.com/${facebook}`} className="mt-3">
          <View className="flex w-full items-center">
            <InformationSlot
              text={facebook}
              Icon={FacebookIcon}
              IconColor="#3b5998"
            />
          </View>
        </Link>
      ) : null}
      {webpage ? (
        <Link href={webpage} className="mt-3">
          <View className="flex w-full items-center">
            <InformationSlot
              text={webpage.replace(/^https?:\/\//, "")}
              Icon={WebIcon}
              IconColor="#000000"
            />
          </View>
        </Link>
      ) : null}
    </View>
  );
}
