import { View } from "react-native";
import React from "react";
import InformationSlot from "./InformationSlot";
import { InstagramIcon, FacebookIcon, WebIcon, LocationIcon } from "./Logos";

export default function LocalInformation() {
  return (
    <View className="flex flex-col justify-center items-center w-full">
      <View className="flex w-full items-center m-1">
        <InformationSlot
          text="Location"
          Icon={LocationIcon}
          IconColor="#e40033"
        />
      </View>
      <View className="flex w-full items-center m-[5px]">
        <InformationSlot text="WhatsApp" />
      </View>
      <View className="flex w-full items-center m-[5px]">
        <InformationSlot
          text="Instagram"
          Icon={InstagramIcon}
          IconColor="#fe0b81"
        />
      </View>
      <View className="flex w-full items-center m-[5px]">
        <InformationSlot
          text="Facebook"
          Icon={FacebookIcon}
          IconColor="#3b5998"
        />
      </View>
      <View className="flex w-full items-center m-[5px]">
        <InformationSlot text="Webpage" Icon={WebIcon} IconColor="#000000" />
      </View>
    </View>
  );
}
