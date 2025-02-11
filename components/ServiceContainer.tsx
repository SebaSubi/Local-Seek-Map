import { View, Text, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../constants/colors";
import { Local, Product, Service, ServiceType } from "../schema/GeneralSchema";
import { Link } from "expo-router";
import { getIfServiceOpen } from "../libs/localService";

export default function ServiceContainer({ service }: { service: Service }) {
  if (!service || !service.name) return;

  return (
    <Link
      href={{
        pathname: "/CRUD/ServiceCRUD/ServicePage/[id]",
        params: {
          id: service.id,
          name: service.name,
          category: service.serviceType?.name,
          imgURL: service.imgURL ?? "https://via.placeholder.com/150",
        },
      }}
      asChild
    >
      <Pressable
        className="flex flex-col items-center  mt-3 w-[45%] bg-[#f8f8f8] h-52 rounded-3xl ml-3"
        key={service.id}
      >
        <View className="w-[70%] h-[47%] flex items-center justify-center  mt-3">
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
          <Text
            className="text-lg font-semibold ml-2"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {service.name}
          </Text>
          <Text
            className="text-sm font-thin ml-2"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Categoría: {service.serviceType?.name}
          </Text>

          <Text className="text-base font-thin ml-2">Mas Info -{">"}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

// export default function ServiceContainer({ service }: { service: Service }) {
//   if (!service || !service.name) return;
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     const fetchLocals = async () => {
//       const open = await getIfServiceOpen(service.id!);
//       setIsOpen(open);
//     };

//     fetchLocals();
//   }, [service.id]);

//   return (

//       <Pressable
//         className="flex flex-col items-center  mt-3 w-[45%] bg-[#f8f8f8] h-64 rounded-3xl ml-3"
//         key={service.id}
//       >
//         <View className="w-[70%] h-[47%] flex items-center justify-center rounded-3xl overflow-hidden mt-6">
//           <Image
//             style={{
//               height: "100%",
//               width: "100%",
//               borderRadius: 4,
//               resizeMode: "contain",
//             }}
//             source={{
//               uri: service.imgURL ?? "https://via.placeholder.com/150",
//             }}
//           />
//         </View>
//         <View className="w-full mt-1 flex flex-col">
//           <Text
//             className="text-lg font-semibold ml-2"
//             numberOfLines={1}
//             ellipsizeMode="tail"
//           >
//             {service.name}
//           </Text>
//           <Text
//             className="text-sm font-thin ml-2"
//             numberOfLines={1}
//             ellipsizeMode="tail"
//           >
//             {service.serviceType?.name}
//           </Text>
//           <Text
//             className={`text-base font-medium ml-2  ${isOpen ? "text-[#b3d74d]" : "text-[#ff6c3d]"}`}
//             numberOfLines={1}
//             ellipsizeMode="tail"
//           >
//             {isOpen ? "Abierto" : "Cerrado"}
//           </Text>
//           <Text className="text-base font-thin ml-2">Mas Info -{">"}</Text>
//         </View>
//       </Pressable>
//     </Link>
//   );
// }
