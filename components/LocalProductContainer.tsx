// import React from "react";
// import { View, Text, Image, StyleSheet, Pressable } from "react-native";
// import { LocalProduct, LocalProductCategory } from "../schema/GeneralSchema";
// import { Link } from "expo-router";
// import { getPlaceholders } from "../libs/libs";

// export default function LocalProductContainer({
//   localProduct,
//   menuItem,
// }: {
//   localProduct: LocalProduct;
//   menuItem?: boolean;
// }) {
//   return (
//     <Link
//       href={{
//         pathname: "CRUD/LocalCRUD/LocalProduct/ReadLocalProduct",
//         params: {
//           id: localProduct.product?.id,
//           name: localProduct.product?.name,
//           description: localProduct.localProductDescription,
//           brand: localProduct.product?.brand,
//           image:
//             localProduct.imgURL ??
//             localProduct.product?.imgURL ??
//             "https://via.placeholder.com/150",
//           categoryName:
//             localProduct.localProductCategory?.name ??
//             localProduct.product?.type?.name,
//           size: localProduct.product?.measurement,
//           price: localProduct.price,
//         },
//       }}
//       asChild
//     >
//       <Pressable
//         className={`flex flex-col items-center mt-3 w-[45%] bg-[#f8f8f8] ${menuItem ? "h-64" : "h-72"} rounded-3xl ml-3 overflow-hidden`}
//         key={localProduct.product?.id}
//       >
//         {/* <View className="mt-3">
//           <Text style={styles.categoryText}>{productCategory}</Text>
//         </View> */}
//         <View className="w-[70%] h-[48%] flex items-center justify-center rounded-3xl overflow-hidden mt-6 bg-white">
//           <Image
//             source={{
//               uri: localProduct.product?.imgURL
//                 ? localProduct.product?.imgURL
//                 : getPlaceholders(localProduct.product?.type!.name as string),
//             }}
//             style={{
//               height: "100%",
//               width: "100%",
//               // borderRadius: 20,
//               resizeMode: "contain",
//             }}
//           />
//         </View>
//         <View className="w-full mt-1 flex flex-col">
//           <Text
//             className="text-lg font-semibold ml-2"
//             numberOfLines={1}
//             ellipsizeMode="tail"
//           >
//             {localProduct.product?.name}
//           </Text>
//           <Text
//             className="text-sm font-thin ml-2"
//             numberOfLines={1}
//             ellipsizeMode="tail"
//           >
//             Categoría: {localProduct.product?.type?.name}
//           </Text>
//           <Text
//             className={`text-sm ml-2 font-thin`}
//             numberOfLines={1}
//             ellipsizeMode="tail"
//           >
//             {localProduct.product?.brand
//               ? `Marca: ${localProduct.product?.brand}`
//               : "---"}
//           </Text>
//           <Text className="text-sm font-thin ml-2">
//             Cantidad: {localProduct.product?.measurement}
//           </Text>
//           {menuItem ? null : (
//             <Text className="text-sm font-thin ml-2">Disponible en -{">"}</Text>
//           )}
//           {/* <Text style={styles.text}>Precio: ${product.price !== undefined ? product.price.toFixed(2) : 'N/A'}</Text> */}
//           {/* <Text style={styles.text}>Descripción: {product.description}</Text> */}
//         </View>
//       </Pressable>
//     </Link>
//   );
// }

// const styles = StyleSheet.create({
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   text: {
//     fontSize: 16,
//     color: "#132E4A",
//     fontWeight: "bold",
//   },
//   categoryText: {
//     fontSize: 18,
//     color: "#666",
//     fontWeight: "bold",
//   },
// });

import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { LocalProduct } from "../schema/GeneralSchema";
import { Link } from "expo-router";
import { getPlaceholders } from "../libs/libs";

export default function LocalProductContainer({
  localProduct,
  menuItem,
}: {
  localProduct: LocalProduct;
  menuItem?: boolean;
}) {
  return (
    <Link
      href={{
        pathname: "CRUD/LocalCRUD/LocalProduct/ReadLocalProduct",
        params: {
          id: localProduct.id,
          name: localProduct.product?.name,
          description: localProduct.localProductDescription,
          brand: localProduct.product?.brand,
          image:
            localProduct.imgURL ??
            localProduct.product?.imgURL ??
            "https://via.placeholder.com/150",
          categoryName:
            localProduct.localProductCategory?.name ??
            localProduct.product?.type?.name,
          size: localProduct.product?.measurement,
          price: localProduct.price,
        },
      }}
      asChild
    >
      <Pressable
        className={`flex flex-col items-center mt-3 w-[45%] bg-[#f8f8f8] ${menuItem ? "h-64" : "h-72"} rounded-3xl ml-3 overflow-hidden`}
        key={localProduct.id}
      >
        <View className="w-[70%] h-[48%] flex items-center justify-center rounded-3xl overflow-hidden mt-6 bg-white">
          <Image
            source={{
              uri: localProduct.imgURL
                ? localProduct.imgURL
                : localProduct.product?.imgURL
                  ? localProduct.product.imgURL
                  : getPlaceholders(
                      localProduct.product?.type?.name ?? "default"
                    ),
            }}
            style={{
              height: "100%",
              width: "100%",
              resizeMode: "contain",
            }}
          />
        </View>
        <View className="w-full mt-1 flex flex-col">
          <Text
            className="text-lg font-semibold ml-2"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {localProduct.product?.name}
          </Text>
          <Text
            className="text-sm font-thin ml-2"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Categoría:{" "}
            {localProduct.localProductCategory?.name ??
              localProduct.product?.type?.name}
          </Text>
          <Text
            className="text-sm font-thin ml-2"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {localProduct.product?.brand
              ? `Marca: ${localProduct.product.brand}`
              : "---"}
          </Text>
          <Text className="text-sm font-thin ml-2">
            Cantidad: {localProduct.product?.measurement}
          </Text>
          <Text className="text-sm font-thin ml-2">
            Precio:{" "}
            {localProduct.price !== null && localProduct.price !== undefined
              ? `$${localProduct.price.toFixed(2)}`
              : "N/A"}
          </Text>
          {menuItem ? null : (
            <Text className="text-sm font-thin ml-2">Disponible en -{">"}</Text>
          )}
        </View>
      </Pressable>
    </Link>
  );
}
