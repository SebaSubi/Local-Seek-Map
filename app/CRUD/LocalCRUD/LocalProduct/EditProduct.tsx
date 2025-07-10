import { useEffect, useState } from "react";
import { LocalProduct, Product } from "../../../../schema/GeneralSchema";
import { deleteProduct, getProducts } from "../../../../libs/product";
import {} from "../../../../libs/local";
import { Stack } from "expo-router";
import { FlatList, Text, View } from "react-native";
import EditProductContainer from "../../../../components/EditProductContainer";
import {
  deleteProductOfLocal,
  getProductsOfLocalByName,
} from "../../../../libs/localProducts";
import { useLocalIdStore } from "../../../../libs/localZustang";
import BasicSearchButton from "../../../../components/BasicSearchBar";
import GoBackButton from "../../../../components/GoBackButton";

export default function EditProduct() {
  const [products, setProduct] = useState<LocalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const local = useLocalIdStore((state) => state.local);

  async function getAndSetProducts() {
    setLoading(true);
    const products = await getProductsOfLocalByName(local.id!, search);
    setProduct(products);
    setLoading(false);
  }
  const handleDelete = (id: string) => {
    setLoading(true);
    deleteProductOfLocal(id);
    getAndSetProducts();
  };

  useEffect(() => {
    getAndSetProducts();
  }, [search]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className=" flex justify-start flex-col h-full w-full bg-[#1a253d]">
        {/* <GoBackButton iconColor="white" style="ml-1" /> */}
        <View className="absolute top-8 left-0 right-0 rounded-full bg-[#1a253d] mt-8 ml-2 z-30 w-12 flex items-center justify-center">
          <GoBackButton iconColor="white" style="ml-1" />
        </View>
        <BasicSearchButton
          placeholder="Buscar"
          onSearch={setSearch}
          style="mt-16 mb-3"
        />
        {/* <GoBackButton iconColor="white" style="ml-1 opacity-0" /> */}

        <View className="flex items-center h-[90%] w-full bg-white rounded-3xl overflow-hidden">
          <Text className="ml-2 mr-2 text-sm font-light">
            *Deslizar para la derecha para actualizar, hacía la izquierda para
            borrar
          </Text>
          <FlatList
            data={products}
            renderItem={({ item }) => (
              <EditProductContainer product={item} onDelete={handleDelete} />
            )}
            keyExtractor={(item) => item.product!.id!}
            onRefresh={() => getAndSetProducts()}
            refreshing={loading}
            className="mt-2"
          />
        </View>
      </View>
    </>
  );
}
