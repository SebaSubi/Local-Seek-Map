import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Product, ProductType } from "../schema/GeneralSchema";
import { Link } from "expo-router";
import { getPlaceholders } from "../libs/libs";

export default function ProductContainer({
  product,
  menuItem,
}: {
  product: Product;
  menuItem?: boolean;
}) {
  return (
    <Link
      href={{
        pathname: "CRUD/ProductCRUD/ProductPage/[id]",
        params: {
          id: product.id,
          name: product.name,
          description: product.description,
          brand: product.brand,
          image: product.imgURL ?? "https://via.placeholder.com/150",
          categoryName: product.type?.name,
          size: product.measurement,
        },
      }}
      asChild
    >
      <Pressable
        className={`flex flex-col items-center mt-3 w-[45%] bg-[#f8f8f8] ${menuItem ? "h-64" : "h-72"} rounded-3xl ml-3 overflow-hidden`}
        key={product.id}
      >
        {/* <View className="mt-3">
          <Text style={styles.categoryText}>{productCategory}</Text>
        </View> */}
        <View className="w-[70%] h-[48%] flex items-center justify-center rounded-3xl overflow-hidden mt-6 bg-white">
          <Image
            source={{
              uri: product.imgURL
                ? product.imgURL
                : getPlaceholders(product.type!.name),
            }}
            style={{
              height: "100%",
              width: "100%",
              // borderRadius: 20,
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
            {product.name}
          </Text>
          <Text
            className="text-sm font-thin ml-2"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Categoría: {product.type?.name}
          </Text>
          <Text
            className={`text-sm ml-2 font-thin`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {product.brand ? `Marca: ${product.brand}` : "---"}
          </Text>
          <Text className="text-sm font-thin ml-2">
            Cantidad: {product.measurement}
          </Text>
          {menuItem ? null : (
            <Text className="text-sm font-thin ml-2">Disponible en -{">"}</Text>
          )}
          {/* <Text style={styles.text}>Precio: ${product.price !== undefined ? product.price.toFixed(2) : 'N/A'}</Text> */}
          {/* <Text style={styles.text}>Descripción: {product.description}</Text> */}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: "#132E4A",
    fontWeight: "bold",
  },
  categoryText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "bold",
  },
});

// {
//               uri: product.imgURL || "https://via.placeholder.com/150",
//             }

// import React, { useState, useEffect } from "react";
// import { View, Text, Image, StyleSheet, Pressable } from "react-native";
// import { Product } from "../schema/GeneralSchema";
// import { Link } from "expo-router";
// import { getPlaceholders } from "../libs/libs";

// export default function ProductContainer({
//   product,
//   menuItem,
// }: {
//   product: Product;
//   menuItem?: boolean;
// }) {
//   const [updatedProduct, setUpdatedProduct] = useState<Product>(product);

//   useEffect(() => {
//     setUpdatedProduct(product);
//   }, [product]);

//   return (
//     <Link
//       href={{
//         pathname: "CRUD/ProductCRUD/ProductPage/[id]",
//         params: {
//           id: updatedProduct.id,
//           name: updatedProduct.name,
//           description: updatedProduct.description,
//           brand: updatedProduct.brand,
//           image: updatedProduct.imgURL ?? "https://via.placeholder.com/150",
//           categoryName: updatedProduct.type?.name,
//           size: updatedProduct.measurement,
//         },
//       }}
//       asChild
//     >
//       <Pressable
//         className={`flex flex-col items-center mt-3 w-[45%] bg-[#f8f8f8] ${
//           menuItem ? "h-64" : "h-72"
//         } rounded-3xl ml-3 overflow-hidden`}
//         key={`${updatedProduct.id}-${updatedProduct.imgURL}`} // Forzar re-render
//       >
//         <View className="w-[70%] h-[48%] flex items-center justify-center rounded-3xl overflow-hidden mt-6 bg-white">
//           <Image
//             source={{
//               uri: updatedProduct.imgURL
//                 ? `${updatedProduct.imgURL}?t=${new Date().getTime()}` // Evitar caché
//                 : getPlaceholders(updatedProduct.type!.name),
//             }}
//             style={{
//               height: "100%",
//               width: "100%",
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
//             {updatedProduct.name}
//           </Text>
//           <Text
//             className="text-sm font-thin ml-2"
//             numberOfLines={1}
//             ellipsizeMode="tail"
//           >
//             Categoría: {updatedProduct.type?.name}
//           </Text>
//           <Text
//             className="text-sm ml-2 font-thin"
//             numberOfLines={1}
//             ellipsizeMode="tail"
//           >
//             {updatedProduct.brand ? `Marca: ${updatedProduct.brand}` : "---"}
//           </Text>
//           <Text className="text-sm font-thin ml-2">
//             Cantidad: {updatedProduct.measurement}
//           </Text>
//           {!menuItem && (
//             <Text className="text-sm font-thin ml-2">Disponible en -{">"}</Text>
//           )}
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
