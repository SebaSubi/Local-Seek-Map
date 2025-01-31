import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import {
  Alert,
  Image,
  Button,
  ScrollView,
  Pressable,
  Modal,
  StyleSheet,
  Text,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import {
  LocalProduct,
  LocalProductCategory,
  LocalProductSubCategory,
  Product,
  ProductType,
} from "../../../../schema/GeneralSchema";
import { uploadImageToCloudinaryProducts } from "../../../../libs/cloudinary";
import {
  createProduct,
  getLocalProductCategoriesByName,
  getLocalProductSubCategoriesByName,
  getProductById,
} from "../../../../libs/product";
import { getProductTypes } from "../../../../libs/productType";
import Header from "../../../../components/Header";
import BasicTextInput from "../../../../components/BasicTextInput";
import BigTextInput from "../../../../components/BigTextInput";
import BasicButton from "../../../../components/BasicButton";
import { CreateLogo } from "../../../../components/Logos";
import { useLocalIdStore } from "../../../../libs/scheduleZustang";
import {
  getProductOfLocal,
  updateLocalProduct,
} from "../../../../libs/localProducts";

export default function EditProductPage() {
  const { id } = useLocalSearchParams();
  const priceRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>({
    getValue: () => "",
    setValue: (value: string) => {},
  });
  const brandRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>({ getValue: () => "", setValue: () => {} });
  const measurementRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>({ getValue: () => "", setValue: () => {} });
  const descriptionRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>({ getValue: () => "", setValue: () => {} });
  const [product, setProduct] = useState<LocalProduct | null>(null);
  const [LocalProductCategories, setLocalProductCategories] = useState<
    LocalProductCategory[] | LocalProductSubCategory[]
  >([]);
  const [selectedProductCategory, setSelectedProductCategory] =
    useState<LocalProductCategory>();
  const [selectedProductSubCategory, setSelectedProductSubCategory] =
    useState<LocalProductCategory>();
  const [productSubCategoryModal, setProductSubCategoryModal] = useState(false);
  const [productCategoryModal, setProductCategoryModal] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [typeModalVisibility, setTypeModalVisibility] = useState(false);
  const [search, setSearch] = useState<string>("");

  //errorHandlers
  const [nameError, setNameError] = useState("");
  const [brandError, setbrandError] = useState("");
  const [measurementError, setMeasurementError] = useState("");

  const localId = useLocalIdStore((state) => state.localId);

  // Función para seleccionar imagen
  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Error", "Se necesitan permisos para acceder a la galería.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    let price: any = priceRef.current?.getValue();
    const localProductDecription = descriptionRef.current?.getValue();

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
        price = parseInt(price);
      } // This is horrible i know

      const newProduct: LocalProduct = {
        price,
        localProductDecription,
        imgURL: uploadedImageUrl,
        dateFrom: new Date(),
      };

      const createdProduct = await updateLocalProduct(id as string, newProduct);
      // await createProductOfLocal(createdProduct?.id!, localId);
      Alert.alert("Éxito", "Producto creado exitosamente");
      // nameRef.current.setValue("");
      // brandRef.current.setValue("");
      // measurementRef.current.setValue("");
      // descriptionRef.current.setValue("");
      setImage(null);
    } catch (error) {
      Alert.alert("Error");
      console.log(error);
    }
  };

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

  // Función para obtener los tipos de producto
  const fetchAndSetProduct = async () => {
    try {
      const product = await getProductOfLocal(id as string);
      setProduct(product);
    } catch (error) {
      console.error("Error fetching product", error);
      Alert.alert("Error", "Fallo al cargar el producto, intentalo mas tarde");
    }
  };

  useEffect(() => {
    fetchAndSetProduct();
  }, []);

  useEffect(() => {
    if (product) {
      priceRef.current?.setValue(product.price?.toString() || "");
      brandRef.current?.setValue(product.product?.brand || "");
      setSelectedProductCategory(product.localProductCategory!);
      setSelectedProductSubCategory(product.localProductSubCategory!);
    }
  }, [product]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex items-center justify-start h-full w-full bg-[#1a253d]">
        <View className="bg-white w-full h-[90%] rounded-3xl overflow-hidden">
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
            className=" bg-white w-full rounded-3xl overflow-hidden"
          >
            {nameError === "" ? null : (
              <View className="w-full flex items-start ml-28">
                <Text className="text-red-800">{nameError}</Text>
              </View>
            )}
            <BasicTextInput
              inputType="text"
              placeholder="Nombre"
              title="Precio"
              value=""
              ref={priceRef}
            />
            <BigTextInput
              inputType="text"
              placeholder="Descripción"
              title="Descripción: "
              value=""
              ref={descriptionRef}
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
                source={{ uri: image }}
                style={{ width: 100, height: 100, marginTop: 10 }}
              />
            )}
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
