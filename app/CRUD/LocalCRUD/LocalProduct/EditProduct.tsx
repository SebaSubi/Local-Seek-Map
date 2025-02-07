import { useEffect, useState } from "react";
import { LocalProduct, Product } from "../../../../schema/GeneralSchema";
import { deleteProduct, getProducts } from "../../../../libs/product";
import {} from "../../../../libs/local";
import { Stack } from "expo-router";
import { FlatList, View } from "react-native";
import EditProductContainer from "../../../../components/EditProductContainer";
import {
  deleteProductOfLocal,
  getProductsOfLocalByName,
} from "../../../../libs/localProducts";
import { useLocalIdStore } from "../../../../libs/localZustang";
import BasicSearchButton from "../../../../components/BasicSearchBar";

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
        <BasicSearchButton
          placeholder="Buscar"
          onSearch={setSearch}
          style="mt-6 "
        />

        <View className="flex items-center h-[90%] w-full bg-white rounded-3xl overflow-hidden">
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
