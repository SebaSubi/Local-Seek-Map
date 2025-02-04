import { Image, Pressable, Text, View } from "react-native";
import { Local } from "../schema/GeneralSchema";
import { DeleteLogo } from "./Logos";

export default function DeleteLocalCard({
  local,
  onDelete,
}: {
  local: Local;
  onDelete: (id: string, name: string) => void;
}) {
  return (
    <>
      <Pressable
        className="flex flex-col items-center  mt-3 w-[45%] bg-[#f8f8f8] h-64 rounded-3xl ml-3"
        key={local.id}
        onPress={() => onDelete(local.id!, local.name!)}
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
          <Text className="text-sm font-thin ml-2 mb-2">
            {local.localTypes?.name}
          </Text>
        </View>
        <View className="flex-1 items-center justify-center w-full h-full bg-[#ff6c3d] rounded-b-3xl">
          <DeleteLogo color="white" size={28} />
        </View>
      </Pressable>
    </>
  );
}

// import { View, Text, StyleSheet, Pressable, Image } from "react-native";
// import React from "react";

// const SmallLocalCard = ({
//   name,
//   imgURL,
//   category,
//   location,
//   onPress,
// }: {
//   name: string;
//   imgURL: string;
//   category: string;
//   location?: string;
//   onPress: () => void;
// }) => {
//   const defaultImage = "https://via.placeholder.com/150";

//   return (
//     <View>
//       <Pressable onPress={onPress} style={styles.localContainer}>
//         <Image
//           source={{ uri: imgURL ?? defaultImage }}
//           style={styles.localImage}
//           resizeMode="center"
//           resizeMethod="auto"
//         />
//         <Text style={styles.localName}>{name}</Text>
//         <Text style={styles.localCategory}>{category}</Text>
//         {location && <Text style={styles.localLocation}>{location}</Text>}
//       </Pressable>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   localContainer: {
//     flex: 1,
//     margin: 10,
//     alignItems: "center",
//     backgroundColor: "#f8f8f8",
//     borderRadius: 10,
//     padding: 10,
//     borderColor: "#324e64",
//     borderWidth: 2,
//     width: 125,
//   },
//   localCategory: {
//     textAlign: "center",
//     color: "#324e64",
//   },
//   localLocation: {
//     textAlign: "center",
//     color: "#7a7a7a",
//     fontSize: 12,
//   },
//   localImage: {
//     width: 80,
//     height: 80,
//     marginBottom: 10,
//   },
//   localName: {
//     textAlign: "center",
//     fontWeight: "bold",
//   },
// });

// export default SmallLocalCard;
