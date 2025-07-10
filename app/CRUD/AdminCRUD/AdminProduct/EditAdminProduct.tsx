import {
  View,
  Text,
  Alert,
  ScrollView,
  Modal,
  StyleSheet,
  Button,
  Pressable,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Stack } from "expo-router";
import GoBackButton from "../../../../components/GoBackButton";
import { useProduct } from "../../../../libs/productZustang";
import { Product, ProductType } from "../../../../schema/GeneralSchema";
import * as ImagePicker from "expo-image-picker";
import BasicTextInput from "../../../../components/BasicTextInput";
import BigTextInput from "../../../../components/BigTextInput";
import BasicButton from "../../../../components/BasicButton";
import { CreateLogo, TrashIcon } from "../../../../components/Logos";
import { getProductTypes } from "../../../../libs/productType";
import { uploadImageToCloudinaryProducts } from "../../../../libs/cloudinary";
import { UpdateProductAdmin } from "../../../../libs/product";
import ProductDeleteModal from "../../../../components/modals/ProductDeleteModal";

export default function EditAdminProduct() {
  const product = useProduct((state) => state.product);

  const nameRef = useRef<any>(null);
  const brandRef = useRef<any>(null);
  const measurementRef = useRef<any>(null);
  const descriptionRef = useRef<any>(null);
  const [serviceTypes, setServiceTypes] = useState<ProductType[]>([]);
  const [selectedType, setSelectedType] = useState<ProductType | null>(
    product.type ?? null
  );
  const [image, setImage] = useState<string | null>(product.imgURL ?? null);
  const [typeModalVisibility, setTypeModalVisibility] = useState(false);

  //errorHandlers
  const [nameError, setNameError] = useState("");
  const [brandError, setbrandError] = useState("");
  const [measurementError, setMeasurementError] = useState("");

  //productDeleteModal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

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

  // Función para obtener los tipos de producto
  const fetchCategories = async () => {
    try {
      const data = await getProductTypes();
      //   console.log(data);
      // Acceder directamente a allCategories
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
  }, [product]);

  const handleSubmit = async () => {
    const name = nameRef.current?.getValue();
    const brand = brandRef.current?.getValue();
    const measurement = measurementRef.current?.getValue();
    const description = descriptionRef.current?.getValue();
    const productTypeId = selectedType?.id;

    if (
      !name ||
      !brand ||
      !measurement ||
      !description ||
      // !image ||
      !productTypeId
    ) {
      Alert.alert("Error", "Por favor complete todos los campos");
      return;
    }
    if (name.length < 2) {
      setNameError("El nombre del produto es demasiado corto");
      setbrandError("");
      setMeasurementError("");
      return;
    } else if (name.includes(",") || name.includes(".")) {
      setNameError(
        // eslint-disable-next-line prettier/prettier
        "El nombre del produto no debe tener ni puntos '.' ni comas ','"
      );
      setbrandError("");
      setMeasurementError("");
      return;
    } else if (name.length >= 50) {
      setNameError("El nombre del produto es demasiado largo");
      setbrandError("");
      setMeasurementError("");
      return;
    } else if (brand.length < 2) {
      setNameError("");
      setbrandError("La marca del produto es demasiado corta");
      setMeasurementError("");
      return;
    } else if (brand.length >= 50) {
      setNameError("");
      setbrandError("La marca del produto es demasiado larga");
      setMeasurementError("");
      return;
    } else if (measurement.length < 2) {
      setNameError("");
      setbrandError("");
      setMeasurementError("La medida del produto es demasiado corta");
      return;
    } else if (measurement.length >= 50) {
      setNameError("");
      setbrandError("");
      setMeasurementError("La medida del produto es demasiado larga");
      return;
    }

    try {
      let uploadedImageUrl: string | null = null;
      if (image !== product.imgURL) {
        try {
          if (image) {
            uploadedImageUrl = await uploadImageToCloudinaryProducts(image);
          }
        } catch (e) {
          console.warn("Error subiendo la imagen:", e);
        }
      } else {
        uploadedImageUrl = image;
      }

      const updatedProduct: Product = {
        id: product.id,
        name,
        brand,
        measurement,
        description,
        productTypeId,
        imgURL: uploadedImageUrl, // puede ser null
        dateFrom: new Date(),
      };

      //   console.log(updatedProduct);
      await UpdateProductAdmin(updatedProduct);
      Alert.alert("Éxito", "Producto creado exitosamente");
      nameRef.current.setValue("");
      brandRef.current.setValue("");
      measurementRef.current.setValue("");
      descriptionRef.current.setValue("");
      setImage(null);
    } catch (error) {
      console.error("No se pudo crear el producto", error);
      // Alert.alert("Error", "No se pudo crear el producto");
    }
  };
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
        <View className="flex flex-row items-center justify-between w-full ">
          <GoBackButton iconColor="white" style="ml-1" />
          <Text className="text-white font-semibold text-xl mt-1">
            Editar Producto
          </Text>
          <GoBackButton iconColor="white" style="ml-1 opacity-0" />
        </View>
        <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-start py-6">
          {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }}> */}
          {nameError === "" ? null : (
            <View className="w-full flex items-start ml-28">
              <Text className="text-red-800">{nameError}</Text>
            </View>
          )}
          <BasicTextInput
            inputType="text"
            placeholder="Nombre"
            title="Nombre de Producto: "
            value={product.name}
            ref={nameRef}
          />
          {brandError === "" ? null : (
            <View className="w-full flex items-start ml-28">
              <Text className="text-red-800">{brandError}</Text>
            </View>
          )}
          <BasicTextInput
            inputType="text"
            placeholder="Marca"
            title="Marca: "
            value={product.brand}
            ref={brandRef}
          />
          {measurementError === "" ? null : (
            <View className="w-full flex items-start ml-28">
              <Text className="text-red-800">{measurementError}</Text>
            </View>
          )}
          <BasicTextInput
            inputType="text"
            placeholder="Medida"
            title="Medida: "
            value={product.measurement}
            ref={measurementRef}
          />
          <BigTextInput
            inputType="text"
            placeholder="Descripción"
            title="Descripción: "
            value={product.description}
            ref={descriptionRef}
          />
          <Modal
            animationType="slide"
            transparent={true}
            visible={typeModalVisibility}
            onRequestClose={() => setTypeModalVisibility(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Selecciona el tipo de producto
                </Text>
                <ScrollView style={styles.scrollView}>
                  {serviceTypes.length === 0 ? (
                    <Text>No hay tipos disponibles</Text>
                  ) : (
                    serviceTypes.map((category, index) => (
                      <Pressable
                        key={index}
                        onPress={() => {
                          setSelectedType(category);
                          setTypeModalVisibility(false);
                        }}
                        style={styles.modalOption}
                      >
                        <Text style={styles.modalOptionText}>
                          {category.name}
                        </Text>
                      </Pressable>
                    ))
                  )}
                </ScrollView>
                <Pressable
                  onPress={() => setTypeModalVisibility(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Pressable
            onPress={() => setTypeModalVisibility(true)}
            style={styles.typeButton}
          >
            <Text style={styles.typeButtonText}>
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
              // source={{ uri: image || defaultImage }}
              style={{ width: 100, height: 100, marginTop: 10 }}
            />
          )}
          <View style={{ marginTop: 20, alignItems: "center", width: "80%" }}>
            <BasicButton
              logo={<CreateLogo />}
              text="Actualizar Producto"
              style="mt-3 pl-2"
              onPress={handleSubmit}
            />
            <ProductDeleteModal
              isVisible={deleteModalVisible}
              setVisible={setDeleteModalVisible}
            />
            <BasicButton
              text="Eliminar Producto"
              background="#cc0000"
              textStyle="text-white"
              style="mt-4"
              logo={
                <View className="flex px-2">
                  <TrashIcon color="#fff" size={21} />
                </View>
              }
              onPress={() => setDeleteModalVisible(!deleteModalVisible)}
            />
          </View>
          {/* </ScrollView> */}
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
    maxHeight: 400, // Establece la altura máxima que deseas
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
