import React from "react";
import { useEffect, useRef, useState } from "react";
import { Product, ProductType } from "../../../../schema/GeneralSchema";
// import * as ImagePicker from "expo-image-picker";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { createProduct } from "../../../../libs/product";
import {
  createProductType,
  getProductTypes,
  getProductTypesByName,
} from "../../../../libs/productType";
import { Stack, useRouter } from "expo-router";
import BasicSearchButton from "../../../../components/BasicSearchBar";
import BasicTextInput from "../../../../components/BasicTextInput";
import BigTextInput from "../../../../components/BigTextInput";
import BasicButton from "../../../../components/BasicButton";
import { CreateLogo } from "../../../../components/Logos";
import { colors } from "../../../../constants/colors";
import GoBackButton from "../../../../components/GoBackButton";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { uploadImageToCloudinaryProducts } from "../../../../libs/cloudinary";

type error = "name" | "brand" | "measurement" | "description" | "required" | "";

export default function CreateProduct() {
  const nameRef = useRef<any>(null);
  const brandRef = useRef<any>(null);
  const measurementRef = useRef<any>(null);
  const descriptionRef = useRef<any>(null);
  const typeRef = useRef<any>();
  const [serviceTypes, setServiceTypes] = useState<ProductType[]>([]);
  const [selectedType, setSelectedType] = useState<ProductType | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [typeModalVisibility, setTypeModalVisibility] = useState(false);
  const [createType, setCreateType] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [error, setError] = useState<{ type: error; message: string }>({
    type: "",
    message: "",
  });
  const router = useRouter();

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
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getProductTypesByName(search);
      if (data) {
        setServiceTypes(data);
      } else {
        console.warn("No se encontró 'allCategories' en la respuesta");
        setServiceTypes([]);
      }
    } catch (err) {
      console.error("Error fetching categories", err);
      Alert.alert("Error", "Fallo al cargar las categorías");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    setError({ type: "", message: "" });
    const name = nameRef.current?.getValue();
    const brand = brandRef.current?.getValue();
    const measurement = measurementRef.current?.getValue();
    const description = descriptionRef.current?.getValue();
    const productTypeId = selectedType?.id;

    if (!name || !brand || !measurement || !productTypeId) {
      setError({
        type: "required",
        message: "*Por favor complete todos los campos obligatorios",
      });
      return;
    }
    if (name.length < 2) {
      setError({
        type: "name",
        message: "*El nombre del producto debe tener mas de 2 caracteres",
      });
      return;
    } else if (name.includes(",") || name.includes(".")) {
      setError({
        type: "name",
        message:
          "*El nombre del producto no debe tener ni puntos '.' ni comas ','",
      });
      return;
    } else if (brand.length < 2) {
      setError({
        type: "brand",
        message: "*La marca del producto debe tener mas de 2 caracteres",
      });
      return;
    } else if (measurement.length < 2) {
      setError({
        type: "measurement",
        message: "*La medida del producto es demasiado corta",
      });
      return;
    } else if (measurement && !/^[a-zA-Z0-9 ]+$/.test(measurement)) {
      setError({
        type: "measurement",
        message: "*La medida no puede tener símbolos",
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

      // console.log("Imagen antes de subir:", image);

      // const uploadedImageUrl = await uploadImageToCloudinaryProducts(image);

      // console.log("URL de imagen subida:", uploadedImageUrl);

      // if (!uploadedImageUrl) {
      //   Alert.alert("Error", "No se pudo cargar la imagen");
      //   return;
      // }

      let uploadedImageUrl: string | null = null;

      if (image) {
        uploadedImageUrl = await uploadImageToCloudinaryProducts(image);
      }

      const newProduct: Product = {
        name,
        brand,
        measurement,
        description,
        productTypeId,
        imgURL: uploadedImageUrl, // Puede ser null si no se subió imagen
        dateFrom: new Date(),
      };

      console.log("Nuevo producto:", newProduct);

      const createdProduct = await createProduct(newProduct);
      router.replace("/CRUD/LocalCRUD/LocalProduct/AddProduct");
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

  async function handleCreateType() {
    const name: string = typeRef.current?.getValue();
    const newProductType = await createProductType({ name });
    setSelectedType(newProductType);
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end"
        style={{ paddingTop: Platform.OS === "android" ? 24 : 0 }}
      >
        <View className="flex flex-row justify-between w-full items-center">
          <GoBackButton style="ml-2" iconColor="white" />
          <Text className="text-white font-semibold text-xl mt-1 w-3/4 text-center">
            {`Crear Producto`}
          </Text>
          <GoBackButton style="opacity-0" />
        </View>
        <View className="flex-1 bg-white h-full w-full rounded-3xl flex items-center justify-start">
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
            className=" bg-white w-full rounded-3xl overflow-hidden pt-3"
          >
            {error.type === "required" ? (
              <View className="w-3/4 mb-5">
                <Text className="text-red-800">{error.message}</Text>
              </View>
            ) : null}
            <BasicTextInput
              inputType="text"
              placeholder="Nombre"
              title="Nombre de Producto: "
              value=""
              textStyle={
                error.type === "name" || error.type === "required"
                  ? "text-red-800"
                  : ""
              }
              maxLength={30}
              ref={nameRef}
            />
            {error.type === "name" ? (
              <View className="w-3/4">
                <Text className="text-red-800">{error.message}</Text>
              </View>
            ) : null}
            <BasicTextInput
              inputType="text"
              placeholder="Marca"
              title="Marca: "
              value=""
              textStyle={
                error.type === "brand" || error.type === "required"
                  ? "text-red-800"
                  : ""
              }
              maxLength={40}
              ref={brandRef}
            />
            {error.type === "brand" ? (
              <View className="w-3/4">
                <Text className="text-red-800">{error.message}</Text>
              </View>
            ) : null}
            <BasicTextInput
              inputType="text"
              placeholder="Medida (Ej: 50g)"
              title="Medida: "
              value=""
              textStyle={
                error.type === "measurement" || error.type === "required"
                  ? "text-red-800"
                  : ""
              }
              maxLength={10}
              ref={measurementRef}
            />
            {error.type === "measurement" ? (
              <View className="w-3/4">
                <Text className="text-red-800">{error.message}</Text>
              </View>
            ) : null}
            <BigTextInput
              inputType="text"
              placeholder="Descripción"
              title="Descripción: "
              value=""
              maxLength={350}
              ref={descriptionRef}
            />
            <View>
              <Text className="text-gray-500 text-sm mb-2">
                Al crear un producto del menú, seleccionar la categoría "Item
                Menú"
              </Text>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={typeModalVisibility}
              onRequestClose={() => setTypeModalVisibility(false)}
            >
              <View
                className="flex items-center justify-center w-full h-full "
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                <View className="flex items-center justify-start w-[85%] h-[75%] bg-white rounded-3xl">
                  <BasicButton
                    text="No encunetra la categoría?"
                    onPress={() => setCreateType(true)}
                    background="#f8f8f8"
                    style="mt-4 mb-2"
                  />
                  {createType ? (
                    <View className="w-full h-full flex items-center justify-center">
                      <BasicTextInput
                        inputType="text"
                        placeholder="Nombre"
                        title="Nombre de Nueva Categoría: "
                        value=""
                        maxLength={24}
                        ref={typeRef}
                      />
                      <BasicButton
                        logo={<CreateLogo />}
                        text="Crear Categoría"
                        onPress={() => {
                          setCreateType(false);
                          handleCreateType();
                          setTypeModalVisibility(false);
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
                        data={serviceTypes}
                        renderItem={({ item, index }) => (
                          <Pressable
                            className={`flex items-center justify-center w-52 bg-[#f8f8f8] h-10 mt-2 rounded-2xl overflow-hidden ${serviceTypes && index === serviceTypes.length - 1 ? "mb-14" : ""}`}
                            onPress={() => {
                              setSelectedType(item);
                              setTypeModalVisibility(false);
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
                      setTypeModalVisibility(false);
                    }}
                    className="w-20 h-10 bg-defaultBlue rounded-2xl flex items-center justify-center my-4 absolute bottom-0"
                  >
                    <Text className="text-white">Cancelar</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            <Pressable
              onPress={() => setTypeModalVisibility(true)}
              style={styles.typeButton}
              className="rounded-2xl"
            >
              <Text
                style={styles.typeButtonText}
                className={error.type === "required" ? "text-red-800" : ""}
              >
                {selectedType
                  ? selectedType.name
                  : "Seleccionar Tipo de Producto"}
              </Text>
            </Pressable>

            <View style={{ marginTop: 20 }}>
              <Button title="Seleccionar Imagen" onPress={handleImagePicker} />
            </View>
            {image && (
              <Image
                source={{
                  uri: image || "https://example.com/default-image.png",
                }}
                style={{ width: 100, height: 100, marginTop: 10 }}
              />
            )}
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
      </SafeAreaView>
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
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  modalOptionText: { textAlign: "center", fontSize: 16 },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#e1e8e8",
    borderRadius: 5,
  },
  closeButtonText: { color: "#000", fontWeight: "bold" },
  typeButton: {
    marginTop: 20,
    paddingVertical: 15, // Aumenta el padding vertical
    paddingHorizontal: 20, // Aumenta el padding horizontal
    backgroundColor: "#f8f8f8",
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
