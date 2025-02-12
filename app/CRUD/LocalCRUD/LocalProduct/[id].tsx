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
import { SafeAreaView } from "react-native-safe-area-context";
import { uploadImageToCloudinaryProducts } from "../../../../libs/cloudinary";

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
    LocalProductCategory[] | LocalProductSubCategory[]
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

  //errorHandlers

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
    console.log("image:", image);

    try {
      if (!image) {
        Alert.alert(
          "Error",
          "Por favor, seleccione una imagen para el producto."
        );
        return;
      }

      const uploadedImageUrl = await uploadImageToCloudinaryProducts(image);
      if (!uploadedImageUrl) {
        Alert.alert("Error", "No se pudo cargar la imagen");
        return;
      }

      if (price === "") {
        price = null;
      } else {
        price = parseInt(price);
      } // This is horrible i know

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
      search,
      id as string
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
    const productCategory = await createLocalProductCategory({ name });
    // console.log(productCategory);
    productCategory ? setSelectedProductCategory(productCategory) : null;
    setCreateCategory(false);
  }

  async function hanldeCreateSubCategory() {
    const name = subCategoryRef.current?.getValue();
    const productSubCategory = await createLocalProductSubCategory({ name });
    console.log(productSubCategory);
    productSubCategory
      ? setSelectedProductSubCategory(productSubCategory)
      : null;
    setCreateSubCategory(false);
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
        }}
      >
        <View className="bg-white w-full h-[90%] rounded-3xl overflow-hidden">
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
              ref={priceRef}
              value=""
            />
            <BigTextInput
              inputType="text"
              placeholder="Descripción"
              title="Descripción: "
              ref={descriptionRef}
              value=""
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
                </View>
              </View>
            </Modal>
          </ScrollView>
        </View>
        <View style={{ marginTop: 20, alignItems: "center", width: "80%" }}>
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
