/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  View,
  Alert,
  Image,
  ScrollView,
  Pressable,
  Modal,
  StyleSheet,
  Text,
  FlatList,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import {
  LocalProduct,
  LocalProductCategory,
  LocalProductSubCategory,
  Product,
} from "../../../../schema/GeneralSchema";
import {
  createLocalProductCategory,
  createLocalProductSubCategory,
  getLocalProductCategoriesByName,
  getLocalProductSubCategoriesByName,
  searchProductsByName,
} from "../../../../libs/product";
import { Stack, useRouter } from "expo-router";
import BasicTextInput from "../../../../components/BasicTextInput";
import BigTextInput from "../../../../components/BigTextInput";
import BasicButton from "../../../../components/BasicButton";
import { CreateLogo } from "../../../../components/Logos";
import BasicSearchButton from "../../../../components/BasicSearchBar";
import {
  createLocalProduct,
  getProductIdsOfLocal,
  getProductOfLocal,
  reactivateLocalProduct,
} from "../../../../libs/localProducts";
import { useLocalIdStore } from "../../../../libs/localZustang";

export default function AddProduct() {
  const priceRef = useRef<any>(null);
  const subDescriptionRef = useRef<any>(null);
  const categoryRef = useRef<any>(null);
  const subCategoryRef = useRef<any>(null);
  const [createCategory, setCreateCategory] = useState(false);
  const [createSubCategory, setCreateSubCategory] = useState(false);
  const [productModalVisibility, setProductModalVisibility] = useState(true);
  const [productCategoryModal, setProductCategoryModal] = useState(false);
  const [localProductCategories, setLocalProductCategories] = useState();
  const [selectedProductCategory, setSelectedCategory] =
    useState<LocalProductCategory | null>(null);
  const [selectedProductSubCategory, setSelectedSubCategory] =
    useState<LocalProductSubCategory | null>(null);
  const [productSubCategoryModal, setProductSubCategoryModal] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [localPrducts, setLocalProducts] = useState<LocalProduct[]>([]);

  const local = useLocalIdStore((state) => state.local);

  async function fetchAndSetLocalProducts() {
    const localProd = await getProductIdsOfLocal(local.id!);
    setLocalProducts(localProd);
  }

  useEffect(() => {
    fetchAndSetLocalProducts();
  }, []);

  const rounter = useRouter();

  const handleSubmit = async () => {
    let price = priceRef.current?.getValue();
    const localProductCategoryId = selectedProductCategory?.id;
    const localProductSubCategoryId = selectedProductSubCategory?.id;
    const localProductDecription = subDescriptionRef.current?.getValue();

    for (const lp of localPrducts) {
      if (lp.productId === productId && lp.dateTo !== null) {
        console.log(lp.id);
        reactivateLocalProduct(lp.id!);
        Alert.alert("Éxito", "Producto creado exitosamente");
        return;
      } else if (lp.productId === productId) {
        Alert.alert("Error", "Este producto ya existe en tu local!");
        return;
      }
    }

    try {
      const uploadedImageUrl = "";
      // await uploadImageToCloudinaryProducts(image);
      // if (!uploadedImageUrl) {
      //   Alert.alert("Error", "No se pudo cargar la imagen");
      //   return;
      // }

      if (price === "") {
        price = null;
      } else {
        price = parseFloat(price);
      }

      const newProduct: LocalProduct = {
        localId: local.id,
        productId,
        price,
        localProductDecription,
        localProductCategoryId,
        localProductSubCategoryId,
        dateFrom: new Date(),
      };

      await createLocalProduct(newProduct);
      Alert.alert("Éxito", "Producto creado exitosamente");
      // nameRef.current.setValue("");
      // brandRef.current.setValue("");
      // measurementRef.current.setValue("");
      // descriptionRef.current.setValue("");
      // setImage(null);
    } catch (error) {
      Alert.alert("Error");
      console.log(error);
    }
  };

  async function getAndSetProducts() {
    // console.log("here");
    const products = await searchProductsByName(search);
    setProducts(products);
    // console.log(products);
  }

  async function getAndSetCategories() {
    const localProductCategories =
      await getLocalProductCategoriesByName(search);
    setLocalProductCategories(localProductCategories);
  }

  async function getAndSetSubCategories() {
    const localSubProductCategories =
      await getLocalProductSubCategoriesByName(search);
    setLocalProductCategories(localSubProductCategories);
  }

  async function hanldeCreateCategory() {
    const name = categoryRef.current?.getValue();
    const productCategory = await createLocalProductCategory({ name });
    console.log(productCategory);
    productCategory ? setSelectedCategory(productCategory) : null;
    setCreateCategory(false);
  }

  async function hanldeCreateSubCategory() {
    const name = subCategoryRef.current?.getValue();
    const productSubCategory = await createLocalProductSubCategory({ name });
    console.log(productSubCategory);
    productSubCategory ? setSelectedSubCategory(productSubCategory) : null;
    setCreateSubCategory(false);
  }

  useEffect(() => {
    if (productModalVisibility) {
      getAndSetProducts();
    } else if (productCategoryModal) {
      getAndSetCategories();
    } else {
      getAndSetSubCategories();
    }
  }, [search]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="bg-[#1a253d] w-full h-full flex items-center">
        <View className=" h-[90%] w-full ">
          <Modal
            animationType="slide"
            transparent={true}
            visible={productModalVisibility}
            onRequestClose={() => setProductModalVisibility(false)}
          >
            <View
              className="flex items-center justify-center w-full h-full "
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <View className="flex items-center justify-start w-[85%] h-[75%] bg-white rounded-3xl">
                <Text className="font-thin text-base mt-4">
                  Seleccione el producto que desea agregar:
                </Text>
                <Pressable
                  onPress={() => {
                    rounter.replace(
                      "/CRUD/LocalCRUD/LocalProduct/CreateProduct"
                    );
                    setProductModalVisibility(false);
                  }}
                  className="flex items-center justify-center w-52 bg-[#f8f8f8] h-10 mt-2 mb-[-10px] rounded-2xl overflow-hidden"
                >
                  <Text className="font-light text-sm">
                    No encuentra el producto?
                  </Text>
                </Pressable>
                <BasicSearchButton
                  placeholder="Buscar Producto"
                  onSearch={setSearch}
                  background="#f8f8f8"
                />
                <FlatList
                  data={products}
                  horizontal={false}
                  numColumns={2}
                  renderItem={({ item, index }) => (
                    <Pressable
                      className="flex items-center justify-start w-32 bg-[#f8f8f8] h-40 m-3 rounded-2xl overflow-hidden"
                      onPress={() => {
                        setProductId(item.id!);
                        setProductModalVisibility(false);
                      }}
                    >
                      <View className="w-16 h-[48%] flex items-center justify-center rounded-2xl overflow-hidden mt-3 ">
                        <Image
                          source={{
                            uri:
                              item.imgURL || "https://via.placeholder.com/150",
                          }}
                          style={{
                            height: "100%",
                            width: "100%",
                            // borderRadius: 20,
                            resizeMode: "contain",
                          }}
                        />
                      </View>
                      <Text className="font-light text-sm mt-2">
                        {item.name}
                      </Text>
                      <Text className="font-light text-sm">
                        {item.measurement}
                      </Text>
                    </Pressable>
                  )}
                  keyExtractor={(item) => item.id!.toString()}
                />
              </View>
            </View>
          </Modal>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
            className=" bg-white w-full rounded-3xl overflow-hidden"
          >
            <>
              <Text className="font-light text-lg mb-4">
                *Los siguientes campos son opcionales
              </Text>
              <BasicTextInput
                inputType="text"
                placeholder="Precio"
                title="Precio: "
                value=""
                ref={priceRef}
              />

              <BigTextInput
                inputType="text"
                placeholder="Descripción"
                title="Descripción: "
                value=""
                ref={subDescriptionRef}
              />
              <Pressable
                className="flex items-center justify-center w-[75%] h-12 bg-[#f8f8f8] mt-2 rounded-2xl"
                onPress={() => {
                  getAndSetCategories();
                  setProductCategoryModal(true);
                }}
              >
                <Text>
                  {selectedProductCategory
                    ? selectedProductCategory.name
                    : "Seleccionar Categoria (Ej: comida)"}
                </Text>
              </Pressable>
              <Pressable
                className="flex items-center justify-center w-[75%] h-12 bg-[#f8f8f8] mt-2 rounded-2xl"
                onPress={() => {
                  getAndSetSubCategories();
                  setProductSubCategoryModal(true);
                }}
              >
                <Text>
                  {selectedProductSubCategory
                    ? selectedProductSubCategory.name
                    : "Seleccionar Sub Categoria (Ej: Pastas)"}
                </Text>
              </Pressable>
              <Modal
                animationType="slide"
                transparent={true}
                visible={productCategoryModal}
                onRequestClose={() => setProductCategoryModal(false)}
              >
                <View
                  className="flex items-center justify-center w-full h-full "
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                  <View className="flex items-center justify-start w-[85%] h-[75%] bg-white rounded-3xl">
                    <BasicButton
                      text="No encunetra la categoría?"
                      onPress={() => setCreateCategory(true)}
                      background="#f8f8f8"
                      style="mt-4"
                    />
                    {createCategory ? (
                      <View className="w-full h-full flex items-center justify-center">
                        <BasicTextInput
                          inputType="text"
                          placeholder="Nombre"
                          title="Nombre de Nueva Categoría: "
                          value=""
                          ref={categoryRef}
                        />
                        <BasicButton
                          logo={<CreateLogo />}
                          text="Crear Categoría"
                          onPress={() => {
                            setCreateCategory(false);
                            hanldeCreateCategory();
                            setProductCategoryModal(false);
                          }}
                          background="#f8f8f8"
                          style="mt-4"
                        />
                      </View>
                    ) : (
                      <>
                        <BasicSearchButton
                          placeholder="Buscar Categoria"
                          onSearch={setSearch}
                          background="#f8f8f8"
                        />
                        <FlatList
                          data={localProductCategories}
                          renderItem={({ item, index }) => (
                            <Pressable
                              className="flex items-center justify-center w-52 bg-[#f8f8f8] h-10 mt-2 rounded-2xl overflow-hidden"
                              onPress={() => {
                                setSelectedCategory(item);
                                setProductCategoryModal(false);
                              }}
                            >
                              <Text>{item.name}</Text>
                            </Pressable>
                          )}
                          keyExtractor={(item) => item.id!.toString()}
                        />
                      </>
                    )}
                  </View>
                </View>
              </Modal>
              <Modal
                animationType="slide"
                transparent={true}
                visible={productSubCategoryModal}
                onRequestClose={() => setProductSubCategoryModal(false)}
              >
                <View
                  className="flex items-center justify-center w-full h-full "
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                  <View className="flex items-center justify-start w-[85%] h-[75%] bg-white rounded-3xl">
                    <BasicButton
                      text="No encunetra la sub categoría?"
                      onPress={() => setCreateSubCategory(true)}
                      background="#f8f8f8"
                      style="mt-4"
                    />
                    {createSubCategory ? (
                      <View className="w-full h-full flex items-center justify-center">
                        <BasicTextInput
                          inputType="text"
                          placeholder="Nombre"
                          title="Nombre de Nueva Sub Categoría: "
                          value=""
                          ref={subCategoryRef}
                        />
                        <BasicButton
                          logo={<CreateLogo />}
                          text="Crear Sub Categoría"
                          onPress={() => {
                            setCreateSubCategory(false);
                            hanldeCreateSubCategory();
                            setProductSubCategoryModal(false);
                          }}
                          background="#f8f8f8"
                          style="mt-4"
                        />
                      </View>
                    ) : (
                      <>
                        <BasicSearchButton
                          placeholder="Buscar Categoria"
                          onSearch={setSearch}
                          background="#f8f8f8"
                        />
                        <FlatList
                          data={localProductCategories}
                          renderItem={({ item, index }) => (
                            <Pressable
                              className="flex items-center justify-center w-52 bg-[#f8f8f8] h-10 mt-2 rounded-2xl overflow-hidden"
                              onPress={() => {
                                setSelectedSubCategory(item);
                                setProductSubCategoryModal(false);
                              }}
                            >
                              <Text>{item.name}</Text>
                            </Pressable>
                          )}
                          keyExtractor={(item) => item.id!.toString()}
                        />
                      </>
                    )}
                  </View>
                </View>
              </Modal>
            </>
          </ScrollView>
        </View>
        <View style={{ marginTop: 20, alignItems: "center", width: "80%" }}>
          <BasicButton
            logo={<CreateLogo />}
            text="Agregar Producto"
            onPress={handleSubmit}
            background="#ffffff"
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    maxHeight: 400,
  },
  scrollView: {
    width: "100%",
    maxHeight: 300, // Limita la altura del contenido dentro del ScrollView
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  modalOptionText: {
    textAlign: "center",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#e1e8e8",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  typeButton: {
    marginTop: 20,
    paddingVertical: 15, // Aumenta el padding vertical
    paddingHorizontal: 20, // Aumenta el padding horizontal
    backgroundColor: "#e1e8e8",
    borderRadius: 5,
    minWidth: 200, // Establece un ancho mínimo para que el botón sea más grande
    alignItems: "center",
    justifyContent: "center",
  },
  typeButtonText: {
    fontSize: 16, // Aumenta el tamaño de la fuente
    // fontWeight: "bold",
    textAlign: "center",
  },
});
