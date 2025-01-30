import { useEffect, useState } from "react";
import { LocalProduct, Product } from "../../../../schema/GeneralSchema";
import { deleteProduct, getProducts } from "../../../../libs/product";
import {} from "../../../../libs/local";
import { useLocalIdStore } from "../../../../libs/scheduleZustang";
import { Stack } from "expo-router";
import { FlatList, View } from "react-native";
import EditProductContainer from "../../../../components/EditProductContainer";
import {
  deleteProductOfLocal,
  getProductsOfLocal,
} from "../../../../libs/localProducts";

export default function EditProduct() {
  const [products, setProduct] = useState<LocalProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const localId = useLocalIdStore((state) => state.localId);

  async function getAndSetProducts() {
    setLoading(true);
    const products = await getProductsOfLocal(localId);
    setProduct(products);
    setLoading(false);
  }

  useEffect(() => {
    getAndSetProducts();
  }, []);

  const handleDelete = (id: string) => {
    console.log("deleted product");
    deleteProductOfLocal(id);
    getAndSetProducts();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex items-center justify-start h-full w-full bg-[#1a253d]">
        <View className="flex items-center h-[90%] w-full bg-white rounded-3xl overflow-hidden">
          <FlatList
            data={products}
            renderItem={({ item }) => (
              <EditProductContainer product={item} onDelete={handleDelete} />
            )}
            keyExtractor={(item) => item.product.id!}
            onRefresh={() => getAndSetProducts()}
            refreshing={loading}
            className="mt-16"
          />
        </View>
      </View>
    </>
  );
}
