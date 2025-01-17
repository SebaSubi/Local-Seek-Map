/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Alert,
  Button,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import BasicTextInput from "../../../components/BasicTextInput";
import { Stack } from "expo-router";
import Header from "../../../components/Header";
import { CreateLogo } from "../../../components/Logos";
import BasicButton from "../../../components/BasicButton";
import { useEffect, useRef, useState } from "react";
import { getServiceTypes } from "../../../libs/serviceType";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import BasicSelectable from "../../../components/BasicSelectable";
import { createService } from "../../../libs/localService";
import { Service, ServiceType } from "../../../schema/GeneralSchema";
import { useLocalIdStore } from "../../../libs/scheduleZustang";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinaryServices } from "../../../libs/cloudinary";
import { Picker } from "@react-native-picker/picker";

export default function CreateProduct() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedType, setSelectedType] = useState<ServiceType>({
    id: "0000",
    name: "default",
  });
  const [typeModalVisibility, setTypeModalVisibility] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const localId = useLocalIdStore((state) => state.localId);

  const nameRef = useRef<any>(null);
  const descriptionRef = useRef<any>(null);
  const URLRef = useRef<any>(null);

  function fetchServiceTypes() {
    const fetchData = async () => {
      const serviceTypes = await getServiceTypes();
      setServiceTypes(serviceTypes);
    };
    fetchData();
  }

  useEffect(() => {
    fetchServiceTypes();
  }, []);

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
    const description = descriptionRef.current?.getValue();
    const reservationURL = URLRef.current.getValue();
    const serviceTypeId = selectedType.id;

    if (!name || !description || !reservationURL || serviceTypeId === "0000") {
      Alert.alert("Por favor rellenar los campos obligatorios");
      return;
    }

    try {
      // const uploadedImageUrl = await uploadImageToCloudinaryServices(image);
      // if (!uploadedImageUrl) {
      //   Alert.alert("Error", "No se pudo cargar la imagen.");
      //   return;
      // }

      const newService: Service = {
        name,
        localId,
        description,
        reservationURL,
        // image: uploadedImageUrl,
        serviceTypeId,
        dateFrom: new Date(),
      };

      // console.log(createService(newService));
      await createService(newService);
      // Alert.alert("Éxito", "Local creado exitosamente");
      setImage(null);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo crear el local.");
    }
  };

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
          header: () => <Header title="Crear Servicio" />,
        }}
      />
      <BasicTextInput
        inputType="text"
        value=""
        placeholder="Nombre"
        textStyle="mt-4"
        title="Nombre del Servicio: "
        ref={nameRef}
      />

      <BasicTextInput
        inputType="text"
        value=""
        placeholder="Descripción"
        textStyle="mt-4"
        title="Descripcion del Servicio: "
        ref={descriptionRef}
      />

      <BasicTextInput
        inputType="text"
        value=""
        placeholder="URL o Numero"
        textStyle="mt-4"
        title="URL Reservas o Numero: "
        ref={URLRef}
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
          {selectedType && selectedType.name !== "default"
            ? selectedType.name
            : "Seleccionar Tipo de Local"}
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
          text="Crear Servicio"
          style="mt-3"
          onPress={handleSubmit}
        />
      </View>

      {/* <Pressable
        onPress={() => setTypeModalVisibility(true)}
        style={styles.typeButton}
      >
        <Text style={styles.typeButtonText}>
          {selectedType ? selectedType.name : "Seleccionar Tipo de Producto"}
        </Text>
      </Pressable> */}

      <Text className="text-red-600 mt-4">
        *No te olvides de agegale un horario a tu Servicio!
      </Text>
    </ScrollView>
  );
} //For the Brand and for the Tupe, we will have to make them select from ones we give them, or else the database will get filled with garbage. We might have to make a new component for that.
// Also add that you can change the imput type to number for the price. And it only accepts numbers

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
