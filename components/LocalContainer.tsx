import { View, Text, Image, Pressable, ViewComponent } from "react-native";
import React, { useEffect, useState } from "react";
import { Local, LocalDisplay, LocalTypes } from "../schema/GeneralSchema";
import { Link } from "expo-router";
import { colors } from "../constants/colors";
import { getIfLocalOpen } from "../libs/local";
import { useFonts } from "expo-font";

export default function LocalContainer({ local }: { local: Local }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchLocals = async () => {
      if (local?.id) {
        const open = await getIfLocalOpen(local.id);
        setIsOpen(open);
      }
    };
    fetchLocals();
  }, [local.id]);
  return (
    <Link
      href={{
        pathname: "CRUD/LocalCRUD/LocalPage/[id]",
        params: {
          id: local.id,
          name: local.name,
          localCoordinates: local.location,
          image: local.imgURL ?? "https://via.placeholder.com/150",
          localType: local.localTypes?.name,
        },
      }}
      asChild
    >
      <Pressable
        className="flex flex-col items-center  mt-3 w-[45%] bg-[#f8f8f8] h-64 rounded-3xl ml-3"
        key={local.id}
      >
        {/* <View className="flex flex-col items-center h-64 w-full bg-[#f8f8f8] rounded-3xl"></View> */}
        <View className="w-[70%] h-[47%] flex items-center justify-center rounded-3xl overflow-hidden mt-6">
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
          <Text className="text-lg font-semibold ml-2">{local.name}</Text>
          <Text className="text-sm font-thin ml-2">
            {local.localTypes?.name}
          </Text>
          <Text
            className={`text-base font-medium ml-2  ${isOpen ? "text-[#b3d74d]" : "text-[#ff6c3d]"}`}
          >
            {isOpen ? "Abierto" : "Cerrado"}
          </Text>
          <Text className="text-base font-thin ml-2">Ver productos -{">"}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

//   return (
//     <Link
//       href={{
//         pathname: "CRUD/LocalCRUD/LocalPage/[id]",
//         params: {
//           id: local.id,
//           name: local.name,
//           localCoordinates: local.location,
//           image: local.imgURL ?? "https://via.placeholder.com/150",
//         },
//       }}
//       asChild
//     >
//       <Pressable
//         className="flex flex-col items-center justify-center mt-2 w-full"
//         key={local.id}
//       >
//         <View className="flex flex-row items-center h-28 w-11/12 bg-[#f8f8f8] rounded-2xl">
//           <View
//             className={`h-24 w-24 bg-[${colors.primary.lightGray}] rounded-lg ml-2 flex items-center justify-center overflow-hidden`}
//           >
//             <View className="h-full w-full">
//               <Image
//                 style={{
//                   height: "100%",
//                   width: "100%",
//                   borderRadius: 4,
//                   resizeMode: "contain",
//                 }}
//                 source={{
//                   uri: local.imgURL ?? "https://via.placeholder.com/150",
//                 }}
//               ></Image>
//             </View>
//           </View>
//           <View className="flex flex-col ml-2 pb-3">
//             <Text className="mt-1 font-bold text-xl">{local.name}</Text>
//             <Text className="text-lg">
//               Categoria:{" "}
//               {local.localTypes
//                 ? local.localTypes.toString()
//                 : "CategoryPlaceHolder"}
//             </Text>
//             <Text
//               className={`${isOpen ? "text-green-700 " : "text-red-500 "}font-bold text-lg`}
//             >
//               {isOpen ? "Abierto" : "Cerrado"}
//             </Text>
//           </View>
//         </View>
//       </Pressable>
//     </Link>
//   );
// }
