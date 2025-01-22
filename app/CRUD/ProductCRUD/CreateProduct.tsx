/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  View,
  Alert,
  Image,
  Button,
  ScrollView,
  Pressable,
  Modal,
  StyleSheet,
  Text,
} from "react-native";
import BasicTextInput from "../../../components/BasicTextInput";
import { Stack } from "expo-router";
import Header from "../../../components/Header";
import { CreateLogo } from "../../../components/Logos";
import BasicButton from "../../../components/BasicButton";
import { useEffect, useRef, useState } from "react";
import { Product, ProductType } from "../../../schema/GeneralSchema";
import { getProductTypes } from "../../../libs/productType";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinaryProducts } from "../../../libs/cloudinary";
import { createProduct } from "../../../libs/product";
import BigTextInput from "../../../components/BigTextInput";

export default function CreateProduct() {
  const nameRef = useRef<any>(null);
  const brandRef = useRef<any>(null);
  const measurementRef = useRef<any>(null);
  const descriptionRef = useRef<any>(null);
  const [serviceTypes, setServiceTypes] = useState<ProductType[]>([]);
  const [selectedType, setSelectedType] = useState<ProductType | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [typeModalVisibility, setTypeModalVisibility] = useState(false);

  //errorHandlers
  const [nameError, setNameError] = useState("");
  const [brandError, setbrandError] = useState("");
  const [measurementError, setMeasurementError] = useState("");

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
    const name = nameRef.current?.getValue();
    const brand = brandRef.current?.getValue();
    const mesurement = measurementRef.current?.getValue();
    const description = descriptionRef.current?.getValue();
    const productTypeId = selectedType?.id;

    if (
      !name ||
      !brand ||
      !mesurement ||
      !description ||
      !image ||
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
    } else if (mesurement.length < 2) {
      setNameError("");
      setbrandError("");
      setMeasurementError("La medida del produto es demasiado corta");
      return;
    } else if (mesurement.length >= 50) {
      setNameError("");
      setbrandError("");
      setMeasurementError("La medida del produto es demasiado larga");
      return;
    }

    try {
      const uploadedImageUrl = await uploadImageToCloudinaryProducts(image);
      if (!uploadedImageUrl) {
        Alert.alert("Error", "No se pudo cargar la imagen");
        return;
      }

      const newProduct: Product = {
        name,
        brand,
        mesurement,
        description,
        productTypeId,
        imgURL: uploadedImageUrl,
        dateFrom: new Date(),
      };

      await createProduct(newProduct);
      Alert.alert("Éxito", "Producto creado exitosamente");
      nameRef.current.setValue("");
      brandRef.current.setValue("");
      measurementRef.current.setValue("");
      descriptionRef.current.setValue("");
      setImage(null);
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el producto");
    }
  };

  // Función para obtener los tipos de producto
  const fetchCategories = async () => {
    try {
      const data = await getProductTypes();
      // Acceder directamente a allCategories
      if (data.allCategories) {
        setServiceTypes(data.allCategories);
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

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          paddingVertical: 20,
          width: "100%",
        }}
      >
        <Stack.Screen
          options={{
            header: () => <Header title="Crear Producto" />,
          }}
        />
        {nameError === "" ? null : (
          <View className="w-full flex items-start ml-28">
            <Text className="text-red-800">{nameError}</Text>
          </View>
        )}
        <BasicTextInput
          inputType="text"
          placeholder="Nombre"
          title="Nombre de Producto: "
          value=""
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
          value=""
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
          value=""
          ref={measurementRef}
        />
        <BigTextInput
          inputType="text"
          placeholder="Descripción"
          title="Descripción: "
          value=""
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
            {selectedType ? selectedType.name : "Seleccionar Tipo de Producto"}
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
        <View style={{ marginTop: 20, alignItems: "center", width: "80%" }}>
          <BasicButton
            logo={<CreateLogo />}
            text="Crear Producto"
            style="mt-3"
            onPress={handleSubmit}
          />
        </View>
      </View>
    </ScrollView>
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
