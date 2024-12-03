/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Alert,
  View,
  Button,
  Image,
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
import { useRef, useState, useEffect } from "react";
import { createLocal } from "../../../libs/local";
// import { CategorySelectButtonLocals } from "../../../components/CategorySelectButton";
import { getLocalTypes } from "../../../libs/localType";
import { Local, LocalTypes } from "../../../schema/GeneralSchema";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinaryLocals } from "../../../libs/cloudinary";

export default function CreateLocal() {
  const nameRef = useRef<any>(null);
  const locationRef = useRef<any>(null);
  const whatsappRef = useRef<any>(null);
  const instagramRef = useRef<any>(null);
  const facebookRef = useRef<any>(null);
  const webpageRef = useRef<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [typeModalVisibility, setTypeModalVisibility] = useState(false);
  const [localTypes, setLocalTypes] = useState<LocalTypes[]>([]);
  const [selectedType, setSelectedType] = useState<LocalTypes | null>(null);

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
    const location = locationRef.current?.getValue();
    const whatsapp = whatsappRef.current?.getValue();
    const instagram = instagramRef.current?.getValue();
    const facebook = facebookRef.current?.getValue();
    const webpage = webpageRef.current?.getValue();
    const localTypeID = selectedType?.id;

    if (!name || !location || !image) {
      Alert.alert("Error", "Por favor complete todos los campos obligatorios.");
      return;
    }

    try {
      const uploadedImageUrl = await uploadImageToCloudinaryLocals(image);
      if (!uploadedImageUrl) {
        Alert.alert("Error", "No se pudo cargar la imagen.");
        return;
      }

      const newLocal: Local = {
        name,
        location,
        whatsapp,
        instagram,
        facebook,
        webpage,
        localTypeID,
        imgURL: uploadedImageUrl,
        dateFrom: new Date(),
      };

      await createLocal(newLocal);
      Alert.alert("Éxito", "Local creado exitosamente");
      nameRef.current.setValue("");
      locationRef.current.setValue("");
      whatsappRef.current.setValue("");
      instagramRef.current.setValue("");
      facebookRef.current.setValue("");
      webpageRef.current.setValue("");
      setImage(null);
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el local.");
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getLocalTypes();
      if (data.allCategories) {
        setLocalTypes(data.allCategories);
      } else {
        console.warn("No se encontró 'allCategories' en la respuesta");
        setLocalTypes([]);
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
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Stack.Screen
        options={{
          header: () => <Header title="Crear Local" />,
        }}
      />
      <BasicTextInput
        inputType="text"
        placeholder="Nombre"
        textStyle="mt-4"
        title="Nombre de Local: "
        ref={nameRef}
        value=""
      />
      {/* <CategorySelectButtonLocals
        title="Categoría del Local:"
        placeholder="Seleccione una categoría"
        onSelectCategory={(categoryId) => setSelectedCategory(categoryId)}
        selectedCategory={selectedCategory}
      /> */}
      <BasicTextInput
        inputType="text"
        placeholder="Coordenadas"
        textStyle="mt-4"
        title="Coordenadas del Local: "
        ref={locationRef}
        value=""
      />
      <BasicTextInput
        inputType="number"
        placeholder="Número de WhatsApp"
        textStyle="mt-4"
        title="Número de WhatsApp: "
        ref={whatsappRef}
        value=""
      />
      <BasicTextInput
        inputType="text"
        placeholder="@Instagram"
        textStyle="mt-4"
        title="Instagram: "
        ref={instagramRef}
        value=""
      />
      <BasicTextInput
        inputType="text"
        placeholder="@Facebook"
        textStyle="mt-4"
        title="Facebook: "
        ref={facebookRef}
        value=""
      />
      <BasicTextInput
        inputType="text"
        placeholder="Página Web"
        textStyle="mt-4"
        title="Página Web: "
        ref={webpageRef}
        value=""
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
              {localTypes.length === 0 ? (
                <Text>No hay tipos disponibles</Text>
              ) : (
                localTypes.map((category, index) => (
                  <Pressable
                    key={index}
                    onPress={() => {
                      setSelectedType(category);
                      setTypeModalVisibility(false);
                    }}
                    style={styles.modalOption}
                  >
                    <Text style={styles.modalOptionText}>{category.name}</Text>
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
      <View className="flex flex-col justify-center items-center w-3/4 mt-3">
        <BasicButton
          logo={<CreateLogo />}
          text="Crear Local"
          style="mt-3"
          onPress={handleSubmit}
        />
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
    maxHeight: 400,
  },
  scrollView: {
    width: "100%",
    maxHeight: 300,
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
