/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, Platform, View } from "react-native";
import {
  Alert,
  Image,
  Button,
  ScrollView,
  Pressable,
  Modal,
  Text,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import {
  LocalProduct,
  LocalProductCategory,
  LocalProductSubCategory,
} from "../../../../schema/GeneralSchema";
import {
  createLocalProductCategory,
  createLocalProductSubCategory,
  getLocalProductCategoriesByName,
  getLocalProductSubCategoriesByName,
} from "../../../../libs/product";
import BasicTextInput from "../../../../components/BasicTextInput";
import BigTextInput from "../../../../components/BigTextInput";
import BasicButton from "../../../../components/BasicButton";
import { CreateLogo } from "../../../../components/Logos";
import {
  getProductsOfLocalByName,
  updateLocalProduct,
} from "../../../../libs/localProducts";
import BasicSearchButton from "../../../../components/BasicSearchBar";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { uploadImageToCloudinaryProducts } from "../../../../libs/cloudinary";
import GoBackButton from "../../../../components/GoBackButton";
import { isNumeric } from "../../../../libs/libs";

type error =
  | "price"
  | "description"
  | "required"
  | "product-category"
  | "product sub-category"
  | "";

export default function EditProductPage() {
  const { id } = useLocalSearchParams();
  const priceRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>({
    getValue: () => "",
    setValue: (value: string) => {},
  });
  const descriptionRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>({
    getValue: () => "",
    setValue: (value: string) => {},
  });

  const categoryRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>({ getValue: () => "", setValue: () => {} });

  const subCategoryRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>({ getValue: () => "", setValue: () => {} });

  const [product, setProduct] = useState<LocalProduct | null>(null);
  const [localProductCategories, setLocalProductCategories] = useState<
    LocalProductCategory[]
  >([]);

  const [selectedProductCategory, setSelectedProductCategory] =
    useState<LocalProductCategory>();
  const [selectedProductSubCategory, setSelectedProductSubCategory] =
    useState<LocalProductSubCategory>();
  const [productSubCategoryModal, setProductSubCategoryModal] = useState(false);
  const [productCategoryModal, setProductCategoryModal] = useState(false);
  const [createCategory, setCreateCategory] = useState(false);
  const [createSubCategory, setCreateSubCategory] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [error, setError] = useState<{ type: error; message: string }>({
    type: "",
    message: "",
  });

  const insets = useSafeAreaInsets();

  //errorHandlers
  const [priceError, setPriceError] = useState(false);

  // Función para seleccionar imagen
  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Error", "Se necesitan permisos para acceder a la galería.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      // mediaTypes: ImagePicker.MediaTypeOptions.Images,
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  // const handleSubmit = async () => {
  //   let price: any = priceRef.current?.getValue();
  //   const localProductDescription = descriptionRef.current?.getValue();
  //   let localProductCategoryId;
  //   let localProductSubCategoryId;

  //   console.log("Descripción capturada:", localProductDescription);

  //   if (descriptionRef.current) {
  //     console.log("Descripción capturada:", descriptionRef.current.getValue());
  //   } else {
  //     console.log("El ref aún no está disponible.");
  //   }

  //   selectedProductCategory
  //     ? (localProductCategoryId = selectedProductCategory.id)
  //     : (localProductCategoryId = null);
  //   selectedProductSubCategory
  //     ? (localProductSubCategoryId = selectedProductSubCategory.id)
  //     : (localProductSubCategoryId = null);

  //   console.log("localProductDescription:", localProductDescription);
  //   console.log("localProductCategoryId:", localProductCategoryId);
  //   console.log("localProductSubCategoryId:", localProductSubCategoryId);
  //   console.log("price:", price);
  //   console.log("image:", image);

  //   try {
  //     // const uploadedImageUrl = "";
  //     // // await uploadImageToCloudinaryProducts(image);
  //     // // if (!uploadedImageUrl) {
  //     // //   Alert.alert("Error", "No se pudo cargar la imagen");
  //     // //   return;
  //     // // }

  //     if (!image) {
  //       Alert.alert(
  //         "Error",
  //         "Por favor, seleccione una imagen para el producto."
  //       );
  //       return;
  //     }

  //     console.log("Imagen antes de subir:", image);

  //     const uploadedImageUrl = await uploadImageToCloudinaryProducts(image);

  //     console.log("URL de imagen subida:", uploadedImageUrl);

  //     if (!uploadedImageUrl) {
  //       Alert.alert("Error", "No se pudo cargar la imagen");
  //       return;
  //     }

  //     if (price === "") {
  //       price = null;
  //     } else {
  //       price = parseInt(price);
  //     } // This is horrible i know

  //     const newProduct: LocalProduct = {
  //       price,
  //       localProductDescription,
  //       localProductCategoryId,
  //       localProductSubCategoryId,
  //       imgURL: uploadedImageUrl,
  //       dateFrom: new Date(),
  //     };

  //     console.log("Nuevo producto:", newProduct);

  //     const createdProduct = await updateLocalProduct(id as string, newProduct);
  //     console.log("Producto actualizado:", createdProduct);
  //     // await createProductOfLocal(createdProduct?.id!, localId);
  //     Alert.alert("Éxito", "Producto actualizado exitosamente");
  //     // price.current.setValue("");
  //     setImage(null);
  //   } catch (error) {
  //     Alert.alert("Error");
  //     console.log(error);
  //   }
  // };

  const handleSubmit = async () => {
    let price: any = priceRef.current?.getValue();
    const localProductDescription = descriptionRef.current?.getValue();
    let localProductCategoryId;
    let localProductSubCategoryId;

    // console.log("Descripción capturada:", localProductDescription);

    // if (descriptionRef.current) {
    //   console.log("Descripción capturada:", descriptionRef.current.getValue());
    // } else {
    //   console.log("El ref aún no está disponible.");
    // }

    selectedProductCategory
      ? (localProductCategoryId = selectedProductCategory.id)
      : (localProductCategoryId = null);
    selectedProductSubCategory
      ? (localProductSubCategoryId = selectedProductSubCategory.id)
      : (localProductSubCategoryId = null);

    // console.log("localProductDescription:", localProductDescription);
    // console.log("localProductCategoryId:", localProductCategoryId);
    // console.log("localProductSubCategoryId:", localProductSubCategoryId);
    // console.log("price:", price);
    // console.log("image:", image);

    try {
      let uploadedImageUrl = null;
      if (image) {
        const uploadedImageUrl = await uploadImageToCloudinaryProducts(image);
        if (!uploadedImageUrl) {
          Alert.alert("Error", "No se pudo cargar la imagen");
          setPriceError(true);
        }
      }

      // if (price === "") {
      //   price = null;
      // } else {
      //   price = parseFloat(price);
      // }

      // if (!isNumeric(price) && price !== null) {
      //   Alert.alert("Error", "El precio solo puede tener numeros");
      //   setPriceError(true);
      //   return;
      // }

      if (!/^\d+(,\d+)?$/.test(price)) {
        setError({
          type: "price",
          message: "El precio solo puede contener números y una coma",
        });
        return;
      }

      const newProduct: LocalProduct = {
        price,
        localProductDescription,
        localProductCategoryId,
        localProductSubCategoryId,
        imgURL: uploadedImageUrl,
        dateFrom: new Date(),
      };

      await updateLocalProduct(id as string, newProduct);

      Alert.alert("Éxito", "Producto actualizado exitosamente");

      // Recargar el producto para reflejar cambios en el frontend
      fetchAndSetProduct();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el producto");
      console.log(error);
    }
  };

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

  // Función para obtener los tipos de producto
  const fetchAndSetProduct = async () => {
    try {
      const product = await getProductsOfLocalByName(id as string, search);
      setProduct(product);
    } catch (error) {
      console.error("Error fetching product", error);
      Alert.alert("Error", "Fallo al cargar el producto, intentalo mas tarde");
    }
  };

  // console.log(product);

  useEffect(() => {
    fetchAndSetProduct();
  }, []);

  useEffect(() => {
    if (product) {
      priceRef.current?.setValue(product.price?.toString() || "");
      descriptionRef.current?.setValue(product.localProductDescription || "");
      descriptionRef.current?.setValue(product.localProductDescription || "");
      setSelectedProductCategory(product.localProductCategory!);
      setSelectedProductSubCategory(product.localProductSubCategory!);
      setImage(product.imgURL ?? null);
    }
  }, [product]);
  async function hanldeCreateCategory() {
    const name = categoryRef.current?.getValue();
    if (!name || name.length < 2) {
      setError({
        type: "product-category",
        message:
          "*El nombre de la categoría no puede tener menos de 2 caracteres",
      });
    } else {
      setError({ type: "", message: "" });
      const productCategory = await createLocalProductCategory({ name });
      productCategory ? setSelectedProductCategory(productCategory) : null;
      setCreateCategory(false);
      setProductCategoryModal(false);
    }
  }

  async function hanldeCreateSubCategory() {
    const name = subCategoryRef.current?.getValue();
    if (!name || name.length < 2) {
      setError({
        type: "product sub-category",
        message:
          "*El nombre de la sub categoría no puede tener menos de 2 caracteres",
      });
    } else {
      setError({ type: "", message: "" });
      const productSubCategory = await createLocalProductSubCategory({ name });
      productSubCategory
        ? setSelectedProductSubCategory(productSubCategory)
        : null;
      setProductSubCategoryModal(false);
      setCreateSubCategory(false);
    }
  }

  const defaultImage = "https://via.placeholder.com/150";

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView
        className="flex items-center justify-start h-full w-full bg-[#1a253d]"
        style={{
          paddingTop: Platform.OS === "android" ? 24 : 0,
          paddingBottom: insets.bottom,
        }}
      >
        <View className="flex flex-row justify-between w-full items-center">
          <GoBackButton style="ml-2" iconColor="white" />
          <Text className="text-white font-semibold text-xl mt-1 w-3/4 text-center">
            {`Actualizar Producto`}
          </Text>
          <GoBackButton style="opacity-0" />
        </View>
        <View className="bg-white w-full h-[88%] rounded-3xl overflow-hidden">
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
            className=" bg-white w-full rounded-3xl overflow-hidden"
          >
            <BasicTextInput
              inputType="text"
              placeholder="Precio"
              title="Precio"
              textStyle={error.type === "price" ? "text-red-800" : ""}
              ref={priceRef}
              value=""
            />
            {error.type === "price" ? (
              <View className="w-3/4">
                <Text className="text-red-800">{error.message}</Text>
              </View>
            ) : null}
            <BigTextInput
              inputType="text"
              placeholder="Descripción"
              title="Descripción: "
              ref={descriptionRef}
              value=""
              maxLength={350}
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
            <View style={{ marginTop: 20 }}>
              <Button title="Seleccionar Imagen" onPress={handleImagePicker} />
            </View>
            {image && (
              <Image
                source={{ uri: image || defaultImage }}
                style={{ width: 100, height: 100, marginTop: 10 }}
              />
            )}
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
                    text={
                      createCategory ? "Volver" : "No encunetra la categoría?"
                    }
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
                          error.type === "product-category"
                            ? "text-red-800"
                            : ""
                        }
                        maxLength={40}
                      />
                      {error.type === "product-category" ? (
                        <View className="w-3/4">
                          <Text className="text-red-800">{error.message}</Text>
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
                              setSelectedProductCategory(item);
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
                          <Text className="text-red-800">{error.message}</Text>
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
                              setSelectedProductSubCategory(item);
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
          </ScrollView>
        </View>
        <View
          style={{
            marginTop: 10,
            marginBottom: 20,
            alignItems: "center",
            width: "80%",
          }}
        >
          <BasicButton
            logo={<CreateLogo />}
            text="Actualizar Producto"
            onPress={handleSubmit}
            background="#ffffff"
          />
        </View>
      </SafeAreaView>
    </>
  );
}
