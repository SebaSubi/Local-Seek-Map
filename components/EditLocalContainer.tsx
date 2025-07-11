import { View, Text, Image, Pressable, ViewComponent } from "react-native";
import React, { useEffect, useState } from "react";
import { Local, LocalDisplay, LocalTypes } from "../schema/GeneralSchema";
import { Link } from "expo-router";
import { colors } from "../constants/colors";
import { getIfLocalOpen } from "../libs/local";
import { useFonts } from "expo-font";
import BasicButton from "./BasicButton";
import { Edit, UpdateLogo } from "./Logos";
import { useLocalIdStore } from "../libs/localZustang";

export default function EditLocalContainer({
  local,
  setModal,
}: {
  local: Local;
  setModal?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setLocalType] = useState<string>("");
  const setLocal = useLocalIdStore((state) => state.setLocal); //this is for sustand

  useEffect(() => {
    const fetchLocals = async () => {
      if (local) {
        const open = await getIfLocalOpen(local.id!);
        setIsOpen(open);
      }
    };
    fetchLocals();
  }, [local.id]);
  return (
    <Link
      style={{ width: "45%" }}
      href={{
        pathname: "CRUD/LocalCRUD",
        // params: {
        //   id: local.id,
        //   name: local.name,
        //   localCoordinates: local.location,
        //   image: local.imgURL
        //     ? local.imgURL
        //     : "https://via.placeholder.com/150", //FIXME: add a placeholderImage
        //   localType: local.localTypes?.name,
        // },
      }}
      asChild
    >
      <Pressable
        className="flex flex-col items-center  mt-3 w-[45%] bg-[#f8f8f8] h-64 rounded-3xl ml-3"
        key={local.id}
        onPress={() => {
          setLocal(local);
          setModal && setModal(false);
          // console.log("aaaaaaaaaaaaaaaaaaaaaaaa");
        }}
      >
        <View className="flex flex-row w-full pt-2 justify-center">
          <Text
            className={`font-bold text-lg text-[${colors.secondary.darkGray}]`}
          >
            Editar Local
          </Text>
          <View className="pt-1 pl-1">
            <Edit size={20} color={colors.secondary.darkGray} />
          </View>
        </View>
        <View className="w-[70%] h-[47%] flex items-center justify-center rounded-3xl overflow-hidden">
          <Image
            style={{
              height: "100%",
              width: "100%",
              borderRadius: 4,
              resizeMode: "contain",
            }}
            source={{
              uri: local.imgURL ?? "https://via.placeholder.com/150",
            }}
          />
        </View>
        <View className="w-full mt-1 flex flex-col">
          <Text className="text-lg font-semibold ml-2">
            {local.name!.length > 16 ? local.name?.slice(0, 16) : local.name}
          </Text>
          <Text className="text-sm font-thin ml-2">
            {local.localTypes?.name}
          </Text>
          <Text
            className={`text-base font-medium ml-2  ${isOpen ? "text-[#b3d74d]" : "text-[#ff6c3d]"}`}
          >
            {isOpen ? "Abierto" : "Cerrado"}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
