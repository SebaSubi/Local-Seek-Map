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
import { CreateLogo } from "../../../components/Logos";
import BasicButton from "../../../components/BasicButton";
import { useRef, useState, useEffect } from "react";
import { checkLocalName, createLocalAndAddOwner } from "../../../libs/local";
// import { CategorySelectButtonLocals } from "../../../components/CategorySelectButton";
import { getLocalTypes } from "../../../libs/localType";
import { Local, LocalTypes } from "../../../schema/GeneralSchema";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinaryLocals } from "../../../libs/cloudinary";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";
import GoBackButton from "../../../components/GoBackButton";

export const verifyUrl = (url: string): boolean => {
  const urlSchema = z.string().url();
  try {
    urlSchema.parse(url);
    return true;
  } catch (error) {
    return false;
  }
};

type error =
  | "name"
  | "location"
  | "whatsapp"
  | "instagram"
  | "facebook"
  | "webpage"
  | "address"
  | "required"
  | "";

export default function CreateLocal() {
  const nameRef = useRef<any>(null);
  const locationRef = useRef<any>(null);
  const addressRef = useRef<any>(null);
  const whatsappRef = useRef<any>(null);
  const instagramRef = useRef<any>(null);
  const facebookRef = useRef<any>(null);
  const webpageRef = useRef<any>(null);
  // const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [coordinatesInfo, setCoordinatesInfo] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [typeModalVisibility, setTypeModalVisibility] = useState(false);
  const [localTypes, setLocalTypes] = useState<LocalTypes[]>([]);
  const [selectedType, setSelectedType] = useState<LocalTypes | null>(null);

  const [error, setError] = useState<{ type: error; message: string }>({
    type: "",
    message: "",
  });

  const { authState } = useAuth();

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
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setError({ type: "", message: "" });
    const name = nameRef.current?.getValue();
    const location = locationRef.current?.getValue();
    const address = addressRef.current?.getValue();
    const whatsapp = whatsappRef.current?.getValue();
    const instagram = instagramRef.current?.getValue();
    const facebook = facebookRef.current?.getValue();
    const webpage = webpageRef.current?.getValue();
    const localTypeID = selectedType?.id;

    if (!name || !location || !location || !address) {
      setError({
        type: "required",
        message: "Por favor complete todos los campos obligatorios",
      });
      return;
    } else if (name.length < 2) {
      setError({
        type: "name",
        message: "*El nombre del Local requiere minimamente 2 caracteres",
      });
      return;
    } else if (name.length >= 24) {
      setError({
        type: "name",
        message: "*El nombre del Local es no puede superar los 24 caracteres",
      });
      return;
    } else if ((await checkLocalName(name)) === "true") {
      setError({
        type: "name",
        message: "*El nombre del Local ya esta en uso",
      });
      return;
    } else if (address.length < 5) {
      setError({
        type: "address",
        message: "La dirección del Local requiere minimamente 5 caracteres",
      });
      return;
    } else if (address.length >= 120) {
      setError({
        type: "address",
        message: "La dirección del Local no puede tener mas de 120 caracteres",
      });

      return;
    } else if (
      address &&
      (address.includes("!") ||
        address.includes("@") ||
        address.includes("#") ||
        address.includes("$") ||
        address.includes("&") ||
        address.includes("*"))
    ) {
      setError({
        type: "address",
        message: "La dirección del local no puede tener caracteres especiales",
      });
      return;
    } else if (location.length < 10) {
      setError({
        type: "location",
        message:
          "Las coordenadas del Local requieren mínimamente 14 caracteres",
      });
      return;
    } else if (location.length >= 60) {
      setError({
        type: "location",
        message:
          "Las coordenadas del Local no pueden tener mas de 60 caracteres caracteres",
      });
      return;
    } else if (
      location &&
      (location.includes("!") ||
        location.includes("@") ||
        location.includes("#") ||
        location.includes("$") ||
        location.includes("&") ||
        location.includes("*"))
    ) {
      setError({
        type: "location",
        message:
          "Las coordenadas del local no puede tener caracteres especiales",
      });
      return;
    } else if (whatsapp && whatsapp.length < 8) {
      setError({
        type: "whatsapp",
        message: "La longitud mínima de un número de Whatsapp es de 8 números",
      });
      return;
    } else if (whatsapp && whatsapp.length > 18) {
      //checkear esto y agregar que wpp no pueda ser negativo.
      setError({
        type: "whatsapp",
        message: "La longitud máxima de un número de Whatsapp es de 18 números",
      });
      return;
    } else if (instagram && instagram.length >= 30) {
      setError({
        type: "instagram",
        message:
          "La longitud máxima de un usuario de instagram es de 30 caracteres",
      });
      return;
    } else if (instagram && instagram.includes(",")) {
      setError({
        type: "instagram",
        message: "Un usuario de instagram no puede tener comas ','",
      });
      return;
    } else if (
      instagram &&
      instagram.length !== instagram.replace(/\s+/g, "").length
    ) {
      setError({
        type: "instagram",
        message: "Un usuario de instagram no puede tener espacios",
      });
      return;
    } else if (
      instagram &&
      (instagram.includes("__") || instagram.includes(".."))
    ) {
      setError({
        type: "instagram",
        message: "Un usuario de instagram no puede incluir esos caracteres",
      });
      return;
    } else if (facebook && facebook.length < 5) {
      setError({
        type: "facebook",
        message: "Un usuario de Facebook debe tener como minimo 5 caracteres",
      });
      return;
    } else if (facebook && facebook.length > 50) {
      setError({
        type: "facebook",
        message: "Un usuario de Facebook debe tener como máximo 50 caracteres",
      });
      return;
    } else if (
      facebook &&
      (facebook.includes("-") ||
        facebook.includes("@") ||
        facebook.includes("#") ||
        facebook.includes("$"))
    ) {
      setError({
        type: "facebook",
        message: "Un usuario de Facebook no permite estos caracteres",
      });

      return;
    }
    if (webpage && !verifyUrl(webpage)) {
      setError({ type: "webpage", message: "URL no valida" });
      return;
    }
    try {
      // const uploadedImageUrl = await uploadImageToCloudinaryLocals(""); // Esto esta mal, pero lo dejamos asi por ahora
      // if (!uploadedImageUrl) {
      //   Alert.alert("Error", "No se pudo cargar la imagen.");
      //   return;
      // }

      const newLocal: Local = {
        name,
        location,
        address,
        whatsapp,
        instagram,
        facebook,
        webpage,
        localTypeID,
        imgURL: "",
      };

      await createLocalAndAddOwner(newLocal, authState!.user!.id);
      Alert.alert("Éxito", "Local creado exitosamente");
      nameRef.current.setValue("");
      addressRef.current.setValue("");
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
      // console.log(data);
      if (data) {
        setLocalTypes(data);
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
            Crear Local
          </Text>
          <GoBackButton iconColor="white" style="ml-1 opacity-0" />
        </View>
        <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-center overflow-hidden">
          <ScrollView
            className="w-full"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            {error.type === "required" ? (
              <Text className="mt-5 mb-[-15px] text-red-800">
                {error.message}
              </Text>
            ) : null}
            <BasicTextInput
              inputType="text"
              placeholder="Nombre"
              textStyle={`mt-10 ${error.type === "required" || error.type === "name" ? " text-red-800" : ""}`}
              title="Nombre de Local: "
              ref={nameRef}
              value=""
            />
            {error.type === "name" ? (
              <View className="w-3/4">
                <Text className="text-red-800">{error.message}</Text>
              </View>
            ) : null}
            {/* <CategorySelectButtonLocals
        title="Categoría del Local:"
        placeholder="Seleccione una categoría"
        onSelectCategory={(categoryId) => setSelectedCategory(categoryId)}
        selectedCategory={selectedCategory}
      /> */}

            <BasicTextInput
              inputType="text"
              placeholder="Dirección"
              textStyle={`mt-4 ${error.type === "required" || error.type === "address" ? " text-red-800" : ""}`}
              title="Dirección del Local: "
              ref={addressRef}
              value=""
            />
            {error.type === "address" ? (
              <View className="w-3/4">
                <Text className="text-red-800">{error.message}</Text>
              </View>
            ) : null}

            <BasicTextInput
              inputType="text"
              placeholder="Coordenadas"
              textStyle={`mt-4 ${error.type === "required" || error.type === "location" ? " text-red-800" : ""}`}
              title="Coordenadas del Local: "
              ref={locationRef}
              value=""
              info={true}
              infoPress={() => setCoordinatesInfo(!coordinatesInfo)}
            />
            {error.type === "location" ? (
              <View className="w-3/4">
                <Text className="text-red-800">{error.message}</Text>
              </View>
            ) : null}
            <BasicTextInput
              inputType="number"
              placeholder="Número de WhatsApp"
              textStyle={`mt-4 ${error.type === "whatsapp" ? " text-red-800" : ""}`}
              title="Número de WhatsApp: "
              ref={whatsappRef}
              value=""
            />

            {error.type === "whatsapp" ? (
              <View className="w-3/4">
                <Text className="text-red-800">{error.message}</Text>
              </View>
            ) : null}

            <BasicTextInput
              inputType="text"
              placeholder="@Instagram"
              textStyle={`mt-4 ${error.type === "instagram" ? " text-red-800" : ""}`}
              title="Instagram: "
              ref={instagramRef}
              value=""
            />
            {error.type === "instagram" ? (
              <View className="w-3/4">
                <Text className="text-red-800">{error.message}</Text>
              </View>
            ) : null}

            <BasicTextInput
              inputType="text"
              placeholder="@Facebook"
              textStyle={`mt-4 ${error.type === "facebook" ? " text-red-800" : ""}`}
              title="Facebook: "
              ref={facebookRef}
              value=""
            />
            {error.type === "facebook" ? (
              <View className="w-3/4">
                <Text className="text-red-800">{error.message}</Text>
              </View>
            ) : null}
            <BasicTextInput
              inputType="text"
              placeholder="Página Web"
              textStyle={`mt-4 ${error.type === "webpage" ? " text-red-800" : ""}`}
              title="Página Web: "
              ref={webpageRef}
              value=""
            />

            {error.type === "webpage" ? (
              <View className="w-3/4">
                <Text className="text-red-800">{error.message}</Text>
              </View>
            ) : null}

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
            <Modal
              animationType="slide"
              transparent={true}
              visible={coordinatesInfo}
              onRequestClose={() => setCoordinatesInfo(false)}
            >
              <View
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                <View className="w-3/4 h-1/2 bg-white rounded-3xl overflow-hidden flex items-center ">
                  <ScrollView
                    className="px-3"
                    contentContainerStyle={{
                      alignItems: "center",
                    }}
                  >
                    <Text className="flex-wrap mt-2 text-2xl text-center font-light">
                      ¿Por qué utilizamos coordenadas?
                    </Text>
                    <Text className="flex-wrap mt-2 text-lg text-center font-light">
                      Las coordenadas aseguran que tu local aparezca en el lugar
                      correcto en el mapa de la aplicación, ya que Maps y Google
                      Maps pueden equivocarse al proporcionarle solamente la
                      dirección.
                    </Text>
                    <Text className="flex-wrap mt-6 text-2xl text-center font-light">
                      ¿Cómo las consigo?
                    </Text>
                    <Text className="flex-wrap mt-2 text-lg text-center font-light mb-2">
                      En Google Maps, mantén presionado sobre el punto donde se
                      ubica tu local. Abajo aparecerá la información de ese
                      lugar con las coordenadas; simplemente cópialas y pégalas.
                    </Text>
                    <Pressable
                      onPress={() => {
                        setCoordinatesInfo(false);
                        fetchCategories();
                      }}
                      className="w-20 h-10 bg-defaultGray rounded-2xl flex items-center justify-center my-4"
                    >
                      <Text>Cerrar</Text>
                    </Pressable>
                  </ScrollView>
                </View>
              </View>
            </Modal>

            <Pressable
              onPress={() => {
                setTypeModalVisibility(true);
                fetchCategories();
              }}
              style={styles.typeButton}
            >
              <Text style={styles.typeButtonText}>
                {selectedType
                  ? selectedType.name
                  : "Seleccionar categoria del Local"}
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
            <View className="flex flex-col justify-center items-center w-3/4 mt-3 pb-10">
              <BasicButton
                logo={<CreateLogo />}
                text="Crear Local"
                style="mt-3"
                onPress={handleSubmit}
              />
            </View>
          </ScrollView>
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
    borderRadius: 16,
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
