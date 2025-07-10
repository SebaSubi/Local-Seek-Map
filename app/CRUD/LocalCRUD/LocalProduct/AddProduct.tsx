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
import { Stack, router, useRouter } from "expo-router";
import BasicTextInput from "../../../../components/BasicTextInput";
import BigTextInput from "../../../../components/BigTextInput";
import BasicButton from "../../../../components/BasicButton";
import { CreateLogo, InfoIcon } from "../../../../components/Logos";
import BasicSearchButton from "../../../../components/BasicSearchBar";
import {
  createLocalProduct,
  getProductIdsOfLocal,
  reactivateLocalProduct,
} from "../../../../libs/localProducts";
import { useLocalIdStore } from "../../../../libs/localZustang";
import GoBackButton from "../../../../components/GoBackButton";
import { getPlaceholders, isNumeric } from "../../../../libs/libs";
import BasicWarning from "../../../../components/BasicWarning";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../../../constants/colors";

type error =
  | "category"
  | "subcategory"
  | "description"
  | "product-category"
  | "product sub-category"
  | "";

export default function AddProduct() {
  const priceRef = useRef<any>(null);
  const subDescriptionRef = useRef<any>(null);
  const categoryRef = useRef<any>(null);
  const subCategoryRef = useRef<any>(null);
  const [createCategory, setCreateCategory] = useState(false);
  const [createSubCategory, setCreateSubCategory] = useState(false);
  const [productModalVisibility, setProductModalVisibility] = useState(true);
  const [productCategoryModal, setProductCategoryModal] = useState(false);
  const [localProductCategories, setLocalProductCategories] = useState<
    LocalProductCategory[]
  >([]);
  const [selectedProductCategory, setSelectedCategory] =
    useState<LocalProductCategory | null>(null);
  const [selectedProductSubCategory, setSelectedSubCategory] =
    useState<LocalProductSubCategory | null>(null);
  const [productSubCategoryModal, setProductSubCategoryModal] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product>({
    name: "",
    brand: "",
    measurement: "",
    description: "",
    dateFrom: new Date(),
    productTypeId: "",
  });
  const [localPrducts, setLocalProducts] = useState<LocalProduct[]>([]);

  const [error, setError] = useState<{
    type: error;
    text: string;
  }>({
    type: "",
    text: "",
  });

  const insets = useSafeAreaInsets();

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
    let reuseCat = "";
    const localProductCategoryId = selectedProductCategory?.id;
    const localProductSubCategoryId = selectedProductSubCategory?.id;
    const localProductDescription = subDescriptionRef.current?.getValue();

    for (const lp of localPrducts) {
      if (lp.productId === product?.id && lp.dateTo !== null) {
        console.log(lp.id);
        reactivateLocalProduct(lp.id!);
        Alert.alert("Éxito", "Producto creado exitosamente");
        return;
      } else if (lp.productId === product.id) {
        Alert.alert("Error", "Este producto ya existe en tu local!");
        return;
      }
    }

    if (!localProductCategoryId && product.type) {
      const productCategory = await createLocalProductCategory({
        name: product.type?.name,
      });
      reuseCat = productCategory?.id!;
    }

    if (localProductDescription && localProductDescription.length > 350) {
      setError({
        type: "description",
        text: "*La descripción de un producto no puede tener mas de 350 caracteres",
      });
      return;
    }

    try {
      // const uploadedImageUrl = "";
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
        productId: product.id,
        price,
        localProductDescription,
        localProductCategoryId: localProductCategoryId
          ? localProductCategoryId
          : reuseCat,
        localProductSubCategoryId,
        dateFrom: new Date(),
      };

      // console.log(newProduct);

      await createLocalProduct(newProduct);
      Alert.alert("Éxito", "Producto creado exitosamente");
      router.back();
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
    const localProductCategories = await getLocalProductCategoriesByName(
      "1",
      search
    );
    setLocalProductCategories(localProductCategories);
  }

  async function getAndSetSubCategories() {
    const localSubProductCategories =
      await getLocalProductSubCategoriesByName(search);
    setLocalProductCategories(localSubProductCategories);
  }

  async function hanldeCreateCategory() {
    const name = categoryRef.current?.getValue();
    if (!name || name.length < 2) {
      setError({
        type: "product-category",
        text: "*El nombre de la categoría no puede tener menos de 2 caracteres",
      });
    } else {
      setError({ type: "", text: "" });
      const productCategory = await createLocalProductCategory({ name });
      productCategory ? setSelectedCategory(productCategory) : null;
      setCreateCategory(false);
      setProductCategoryModal(false);
    }
  }

  async function hanldeCreateSubCategory() {
    const name = subCategoryRef.current?.getValue();
    if (!name || name.length < 2) {
      setError({
        type: "product sub-category",
        text: "*El nombre de la sub categoría no puede tener menos de 2 caracteres",
      });
    } else {
      setError({ type: "", text: "" });
      const productSubCategory = await createLocalProductSubCategory({ name });
      productSubCategory ? setSelectedSubCategory(productSubCategory) : null;
      setProductSubCategoryModal(false);
      setCreateSubCategory(false);
    }
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
    <View
      className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end"
      style={{
        paddingTop: insets.top,
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex flex-row justify-between w-full items-center mt-[-5px]">
        <GoBackButton style="ml-2" iconColor="white" />
        <Text className="text-white font-semibold text-xl w-3/4 text-center">
          {product.name}
        </Text>
        <GoBackButton style="opacity-0" />
      </View>
      <ScrollView
        className="bg-white h-full w-full rounded-3xl flex-1"
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={error.type === "category" || error.type === "subcategory"}
        >
          <View className="w-full h-full flex items-center justify-center">
            {error.type === "category" || error.type === "subcategory" ? (
              <BasicWarning
                text={error.text}
                cancelButton={true}
                onPressLeft={() => setError({ type: "", text: "" })}
              />
            ) : null}
          </View>
        </Modal>
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
              <Text className="font-light text-base mt-4">
                Seleccione el producto que desea agregar:
              </Text>
              <Pressable
                onPress={() => {
                  rounter.replace("/CRUD/LocalCRUD/LocalProduct/CreateProduct");
                  setProductModalVisibility(false);
                }}
                className="flex items-center justify-center w-52 bg-[#f8f8f8] h-10 mt-2  rounded-2xl overflow-hidden mb-2"
              >
                <Text className="font-light text-sm">
                  No encuentra el producto?
                </Text>
              </Pressable>
              <BasicSearchButton
                placeholder="Buscar Producto"
                onSearch={setSearch}
                background="#f8f8f8"
                style="mb-2"
              />
              <FlatList
                data={products}
                horizontal={false}
                numColumns={2}
                renderItem={({ item, index }) => (
                  <Pressable
                    className="flex items-center justify-start w-32 bg-[#f8f8f8] h-40 m-3 rounded-2xl overflow-hidden"
                    onPress={() => {
                      setProduct(item);
                      setProductModalVisibility(false);
                    }}
                    //TODO: Podriamos poner un onLongPress que te da mas detalles del producto.
                  >
                    <View className="w-16 h-20 flex items-center justify-center rounded-2xl overflow-hidden mt-3">
                      <Image
                        source={{
                          uri:
                            item.imgURL || getPlaceholders(item.productTypeId),
                        }}
                        style={{
                          height: "100%",
                          width: "100%",
                        }}
                        resizeMode="contain"
                      />
                    </View>
                    <Text className="font-light text-sm mt-2 text-center">
                      {item.name}
                    </Text>
                    <Text className="font-light text-sm">
                      {item.measurement}
                    </Text>
                  </Pressable>
                )}
                keyExtractor={(item) => item.id!.toString()}
              />
              <Pressable
                onPress={() => {
                  rounter.back();
                }}
                className="w-20 h-10 bg-defaultBlue rounded-2xl flex items-center justify-center my-2 absolute bottom-2 "
              >
                <Text className="text-white">Volver</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <BasicButton
          text="Seleccionar otro producto?"
          onPress={() => setProductModalVisibility(true)}
          background="#f8f8f8"
          style="mt-4 mb-2"
        />
        <Text className="font-light text-lg mb-4">
          *Los siguientes campos son opcionales
        </Text>
        <BasicTextInput
          inputType="number"
          placeholder="Precio"
          title="Precio: "
          value=""
          ref={priceRef}
        />
        <BigTextInput
          inputType="text"
          textStyle={error.type === "description" ? "text-red-800" : ""}
          placeholder="Descripción"
          title="Descripción: "
          value=""
          maxLength={350}
          ref={subDescriptionRef}
        />
        <View className="flex flex-row items-center justify-evenly w-full h-12  mt-2">
          <Pressable className="w-6 h-12 items-center justify-center opacity-0">
            <InfoIcon color="#1a253d" />
          </Pressable>
          <Pressable
            className="flex items-center justify-center w-[75%] h-12 bg-[#f8f8f8] rounded-2xl"
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
            className="w-6 h-12 items-center justify-center"
            onPress={() =>
              setError({
                type: "category",
                text: `Esto es la categoria que desea que el producto tenga dentro de su local. El producto por default trae la categoría: "${product.type?.name}", si desea que tenga otra categoria especifica de su local, agreguela aca, sino se agregara con el valor anteriormente dicho`,
              })
            }
          >
            <InfoIcon color="#1a253d" />
          </Pressable>
        </View>
        <View className="flex flex-row items-center justify-evenly w-full h-12  mt-2">
          <Pressable className="w-6 h-12 items-center justify-center opacity-0">
            <InfoIcon color="#1a253d" />
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
          <Pressable
            className="w-6 h-12 items-center justify-center"
            onPress={() =>
              setError({
                type: "subcategory",
                text: `Esta es la sub-categoria que tendra su producto. Si, por ejemplo, su producto tiene la cateogría "comida", la sub-categoría podria ser "pasta". Este valor es completamente opcional, si no desea ponerlo, deje este campo en blanco.`,
              })
            }
          >
            <InfoIcon color="#1a253d" />
          </Pressable>
        </View>
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
                text={createCategory ? "Volver" : "No encunetra la categoría?"}
                onPress={() => {
                  createCategory
                    ? setCreateCategory(false)
                    : setCreateCategory(true);
                }}
                background="#f8f8f8"
                style="mt-4 mb-2"
              />
              {createCategory ? (
                <View className="w-full h-full flex items-center justify-center">
                  <BasicTextInput
                    inputType="text"
                    placeholder="Nombre"
                    title="Nombre de Nueva Categoría: "
                    value=""
                    ref={categoryRef}
                    textStyle={
                      error.type === "product-category" ? "text-red-800" : ""
                    }
                    maxLength={40}
                  />
                  {error.type === "product-category" ? (
                    <View className="w-3/4">
                      <Text className="text-red-800">{error.text}</Text>
                    </View>
                  ) : null}
                  <BasicButton
                    logo={<CreateLogo />}
                    text="Crear Categoría"
                    onPress={() => {
                      hanldeCreateCategory();
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
                        className={`flex items-center justify-center w-52 bg-[#f8f8f8] h-10 mt-2 rounded-2xl overflow-hidden ${localProductCategories && index === localProductCategories.length - 1 ? "mb-14" : ""}`}
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
              <Pressable
                onPress={() => {
                  setProductCategoryModal(false);
                  setCreateCategory(false);
                }}
                className="w-20 h-10 bg-defaultBlue rounded-2xl flex items-center justify-center my-2 absolute bottom-2 "
              >
                <Text className="text-white">Cancelar</Text>
              </Pressable>
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
                text={
                  createSubCategory
                    ? "Volver"
                    : "No encunetra la sub categoría?"
                }
                onPress={() => {
                  createSubCategory
                    ? setCreateSubCategory(false)
                    : setCreateSubCategory(true);
                }}
                background="#f8f8f8"
                style="mt-4 mb-2"
              />
              {createSubCategory ? (
                <View className="w-full h-full flex items-center justify-center">
                  <BasicTextInput
                    inputType="text"
                    placeholder="Nombre"
                    title="Nombre de Nueva Sub Categoría: "
                    value=""
                    ref={subCategoryRef}
                    textStyle={
                      error.type === "product sub-category"
                        ? "text-red-800"
                        : ""
                    }
                    maxLength={40}
                  />
                  {error.type === "product sub-category" ? (
                    <View className="w-3/4">
                      <Text className="text-red-800">{error.text}</Text>
                    </View>
                  ) : null}
                  <BasicButton
                    logo={<CreateLogo />}
                    text="Crear Sub Categoría"
                    onPress={() => {
                      hanldeCreateSubCategory();
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
                        className={`flex items-center justify-center w-52 bg-[#f8f8f8] h-10 mt-2 rounded-2xl overflow-hidden  ${localProductCategories && index === localProductCategories.length - 1 ? "mb-14" : ""}`}
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
              <Pressable
                onPress={() => {
                  setProductSubCategoryModal(false);
                }}
                className="w-20 h-10 bg-defaultBlue rounded-2xl flex items-center justify-center my-2 absolute bottom-2 "
              >
                <Text className="text-white">Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <View className="flex flex-row justify-evenly items-end w-full">
          <View className="flex w-16 h-12 justify-center   items-start ">
            <GoBackButton style="mt-2" iconColor="white" />
          </View>
          <BasicButton
            text="Agregar Producto"
            style="mt-6"
            textStyle="text-white"
            onPress={() => handleSubmit()}
            background={colors.primary.blue}
          />
          <View className="flex w-16 justify-start  items-end ">
            <GoBackButton style="opacity-0" iconColor="white" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
