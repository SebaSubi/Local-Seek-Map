import { View } from "react-native";
import React from "react";
import InformationSlot from "./InformationSlot";
import { InstagramIcon, FacebookIcon, WebIcon, LocationIcon } from "./Logos";

export default function LocalInformation({
  whatsapp,
  instagram,
  facebook,
  webpage,
  location,
}: {
  whatsapp?: number | null;
  instagram?: string | null;
  facebook?: string | null;
  webpage?: string | null;
  location?: string | null;
}) {
  return (
    <View className="flex flex-col justify-center items-center w-full">
      {location ? (
        <View className="flex w-full items-center m-[5px]">
          <InformationSlot
            text={location}
            Icon={LocationIcon}
            IconColor="#e40033"
          />
        </View>
      ) : null}
      {whatsapp ? (
        <View className="flex w-full items-center m-[5px]">
          <InformationSlot text={`${whatsapp}`} />
        </View>
      ) : null}
      {instagram ? (
        <View className="flex w-full items-center m-[5px]">
          <InformationSlot
            text={instagram}
            Icon={InstagramIcon}
            IconColor="#fe0b81"
          />
        </View>
      ) : null}
      {facebook ? (
        <View className="flex w-full items-center m-[5px]">
          <InformationSlot
            text={facebook}
            Icon={FacebookIcon}
            IconColor="#3b5998"
          />
        </View>
      ) : null}
      {webpage ? (
        <View className="flex w-full items-center m-[5px]">
          <InformationSlot
            text={webpage.replace(/^https?:\/\//, "")}
            Icon={WebIcon}
            IconColor="#000000"
          />
        </View>
      ) : null}
    </View>
  );
}
