import { useEffect, useState } from "react";
import { LocalProduct, Product } from "../../../../schema/GeneralSchema";
import { deleteProduct, getProducts } from "../../../../libs/product";
import {} from "../../../../libs/local";
import { Stack } from "expo-router";
import { FlatList, Modal, Text, View } from "react-native";
import EditProductContainer from "../../../../components/EditProductContainer";
import {
  deleteProductOfLocal,
  getProductsOfLocalByName,
} from "../../../../libs/localProducts";
import { useLocalIdStore } from "../../../../libs/localZustang";
import BasicSearchButton from "../../../../components/BasicSearchBar";
import BasicWarning from "../../../../components/BasicWarning";

export default function EditProduct() {
  const [products, setProduct] = useState<LocalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [warning, setWarning] = useState(false);
  const [productId, setProductId] = useState<string | null | undefined>("");

  const local = useLocalIdStore((state) => state.local);

  async function getAndSetProducts() {
    setLoading(true);
    const products = await getProductsOfLocalByName(local.id!, search);
    setProduct(products);
    setLoading(false);
  }

  function handleDelete(id: string) {
    deleteProductOfLocal(id);
    getAndSetProducts();
    setWarning(false);
  }

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
          style="mt-16 mb-3"
        />

        <View className="flex items-center h-[90%] w-full bg-white rounded-3xl overflow-hidden">
          <Text className="ml-2 mr-2 text-sm font-light">
            *Deslizar para la derecha para actualizar, hacía la izquierda para
            borrar
          </Text>
          <FlatList
            data={products}
            renderItem={({ item }) => (
              <EditProductContainer
                product={item}
                onDelete={() => {
                  setWarning(true);
                  setProductId(item.id);
                }}
              />
            )}
            keyExtractor={(item) => item.product!.id!}
            onRefresh={() => getAndSetProducts()}
            refreshing={loading}
            className="mt-2"
          />
        </View>
        {warning && (
          // <View className="w-full h-full flex items-center justify-center">
          <Modal
            animationType="slide"
            transparent={true}
            visible={warning}
            onRequestClose={() => setWarning(false)}
          >
            <View
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <BasicWarning
                text="Una vez que elimine el producto no se podrá volver para atrás."
                cancelButton={false}
                buttonLeft="Cancelar"
                buttonRight="Eliminar"
                onPressRight={() => {
                  handleDelete(productId!);
                }}
                onPressLeft={() => setWarning(false)}
              />
            </View>
          </Modal>
        )}
      </View>
    </>
  );
}
