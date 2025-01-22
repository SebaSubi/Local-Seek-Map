import { View, Text, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../constants/colors";
import { Local, Product, Service, ServiceType } from "../schema/GeneralSchema";
import { Link } from "expo-router";
import { getIfServiceOpen } from "../libs/localService";

export default function ServiceContainer({
  service,
  categories,
}: {
  service: Service;
  categories: ServiceType[];
}) {
  if (!service || !service.name) return;
  const [isOpen, setIsOpen] = useState(false);
  const [type, setLocalType] = useState<string>("");

  useEffect(() => {
    const fetchLocals = async () => {
      const open = await getIfServiceOpen(service.id!);
      setIsOpen(open);
    };
    const assignCategory = categories?.filter(
      (category) => category.id === service.serviceTypeId
    );
    fetchLocals();
    setLocalType(assignCategory ? assignCategory[0].name : "");
  }, [service.id]);

  return (
    <Link
      href={{
        pathname: "/CRUD/ServiceCRUD/ServicePage/[id]",
        params: {
          id: service.id,
          localId: service.localId,
          localCoordinates: service.local?.location,
          name: service.name,
          imgURL: service.imgURL ?? "https://via.placeholder.com/150",
        },
      }}
      asChild
    >
      <Pressable
        className="flex flex-col items-center  mt-3 w-[45%] bg-[#f8f8f8] h-64 rounded-3xl ml-3"
        key={service.id}
      >
        <View className="w-[70%] h-[47%] flex items-center justify-center rounded-3xl overflow-hidden mt-6">
          <Image
            style={{
              height: "100%",
              width: "100%",
              borderRadius: 4,
              resizeMode: "contain",
            }}
            source={{
              uri: service.imgURL ?? "https://via.placeholder.com/150",
            }}
          />
        </View>
        <View className="w-full mt-1 flex flex-col">
          <Text className="text-lg font-semibold ml-2">{service.name}</Text>
          <Text className="text-sm font-thin ml-2">{type}</Text>
          <Text
            className={`text-base font-medium ml-2  ${isOpen ? "text-[#b3d74d]" : "text-[#ff6c3d]"}`}
          >
            {isOpen ? "Abierto" : "Cerrado"}
          </Text>
          <Text className="text-base font-thin ml-2">Mas Info -{">"}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

// <View className="flex flex-row items-center h-28 w-11/12 bg-slate-300 rounded-2xl border m-1">
//   <View
//     className={`h-5/6 w-24 bg-[${colors.primary.lightGray}] rounded-lg ml-2 flex items-center justify-center `}
//   >
//     <Image
//       style={{
//         height: "90%",
//         width: "90%",
//         borderRadius: 4,
//         resizeMode: "cover",
//       }}
//       source={
//         service.image
//           ? { uri: service.image }
//           : require("../assets/ServicePlaceholder.png")
//       }
//     />
//   </View>
//   <View className="flex flex-col pl-2">
//     <Text className="text-lg font-bold mb-1">{service.name}</Text>
//     <View
//       className={`flex flex-row items-center rounded-lg  border  bg-gray-300 w-fit p-1`}
//     >
//       <Image
//         style={{
//           height: 50,
//           width: 50,
//           borderRadius: 6,
//           resizeMode: "cover",
//         }}
//         source={
//           service.local?.imgURL
//             ? { uri: "https://via.placeholder.com/150" }
//             : require("../assets/LocalServicePlaceholder.png")
//         }
//       />
//       <Text className="text-lg font-bold ml-2">{service.local!.name}</Text>
//     </View>
//   </View>
// </View>;
