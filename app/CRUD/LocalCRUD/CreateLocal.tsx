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
import {
  checkLocalName,
  createLocal,
  createLocalAndAddOwner,
} from "../../../libs/local";
// import { CategorySelectButtonLocals } from "../../../components/CategorySelectButton";
import { getLocalTypes } from "../../../libs/localType";
import { Local, LocalTypes } from "../../../schema/GeneralSchema";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinaryLocals } from "../../../libs/cloudinary";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";
import GoBackButton from "../../../components/GoBackButton";
import { colors } from "../../../constants/colors";

export const verifyUrl = (url: string): boolean => {
  const urlSchema = z.string().url();
  try {
    urlSchema.parse(url);
    return true;
  } catch (error) {
    return false;
  }
};

export default function CreateLocal() {
  const nameRef = useRef<any>(null);
  const locationRef = useRef<any>(null);
  const addressRef = useRef<any>(null);
  const whatsappRef = useRef<any>(null);
  const instagramRef = useRef<any>(null);
  const facebookRef = useRef<any>(null);
  const webpageRef = useRef<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [typeModalVisibility, setTypeModalVisibility] = useState(false);
  const [localTypes, setLocalTypes] = useState<LocalTypes[]>([]);
  const [selectedType, setSelectedType] = useState<LocalTypes | null>(null);

  //errorHandlers
  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [whatsappError, setWhatsappError] = useState("");
  const [instagramError, setInstagramError] = useState("");
  const [facebookError, setFacebookError] = useState("");
  const [webpageError, setWebpageError] = useState("");

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
    const name = nameRef.current?.getValue();
    const location = locationRef.current?.getValue();
    const address = addressRef.current?.getValue();
    const whatsapp = whatsappRef.current?.getValue();
    const instagram = instagramRef.current?.getValue();
    const facebook = facebookRef.current?.getValue();
    const webpage = webpageRef.current?.getValue();
    const localTypeID = selectedType?.id;

    if (!name || !location || !image || !location || !address) {
      Alert.alert("Error", "Por favor complete todos los campos obligatorios.");
      return;
    }
    if (name.length < 2) {
      setNameError("El nombre del Local requiere minimamente 2 caracteres");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (name.length >= 40) {
      setNameError("El nombre del Local es demasiado largo");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if ((await checkLocalName(name)) === "true") {
      setNameError("El nombre del Local ya esta en uso");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }

    if (address.length < 5) {
      setNameError("");
      setLocationError(
        // eslint-disable-next-line prettier/prettier
        "La ubicacion del Local requiere minimamente 5 caracteres"
      );
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (address.length >= 120) {
      setNameError("");
      setLocationError("La ubicacion del Local tiene demasiados caracteres");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (location.length < 5) {
      setNameError("");
      setLocationError(
        // eslint-disable-next-line prettier/prettier
        "Las coordenadas del Local requieren minimamente 23 caracteres"
      );
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (location.length >= 120) {
      setNameError("");
      setLocationError("Las coordenadas del Local tiene demasiados caracteres");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (whatsapp && whatsapp.length < 8) {
      setNameError("");
      setLocationError("");
      setWhatsappError(
        // eslint-disable-next-line prettier/prettier
        "La longitud minima de un numero de Whatsapp es de 8 numeros"
      );
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (whatsapp && whatsapp.length > 18) {
      //checkear esto y agregar que wpp no pueda ser negativo.
      setNameError("");
      setLocationError("");
      setWhatsappError(
        // eslint-disable-next-line prettier/prettier
        "La longitud maxima de un numero de Whatsapp es de 18 numeros"
      );
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (instagram && instagram.length < 1) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError(
        // eslint-disable-next-line prettier/prettier
        "La longitud minima de un usuario de instagram es de 1 caracter"
      );
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (instagram && instagram.length >= 30) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError(
        // eslint-disable-next-line prettier/prettier
        "La longitud maxima de un usuario de instagram es de 30 caracteres"
      );
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (instagram && instagram.includes(",")) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("un usuario de instagram no puede tener comas ','");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (instagram && instagram.includes(" ")) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("un usuario de instagram no puede tener espacios");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (instagram && (instagram.includes("__") || instagram.includes(".."))) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("un usuario de instagram no puede tener este caracter");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (facebook && facebook.length < 5) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError(
        // eslint-disable-next-line prettier/prettier
        "un usuario de Facebook debe tener como minimo 5 caracteres"
      );
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (facebook && facebook.length > 50) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError(
        // eslint-disable-next-line prettier/prettier
        "un usuario de Facebook debe tener como maximo 50 caracteres"
      );
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (
      facebook &&
      (facebook.includes("-") ||
        facebook.includes("@") ||
        facebook.includes("#") ||
        facebook.includes("$"))
    ) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("Un usuario de Facebook no permite estos caracteres");
      setWebpageError("");
      setAddressError("");
      return;
    }
    // if (webpage && !verifyUrl(webpage)) {
    //   setNameError("");
    //   setLocationError("");
    //   setWhatsappError("");
    //   setInstagramError("");
    //   setFacebookError("");
    //   setWebpageError("URL no valida");
    //   return;
    // }
    try {
      const uploadedImageUrl = await uploadImageToCloudinaryLocals(image);
      if (!uploadedImageUrl) {
        Alert.alert("Error", "No se pudo cargar la imagen.");
        return;
      }

      const newLocal: Local = {
        name,
        location,
        address,
        whatsapp,
        instagram,
        facebook,
        webpage,
        localTypeID,
        imgURL: uploadedImageUrl,
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
          headerShown: false,
        }}
      />
      <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
        <View className="flex flex-row justify-between w-full items-center">
          <GoBackButton style="bg-white w-12 justify-center mb-3 ml-3 h-9" />
          <Text className="text-white font-semibold text-xl mt-1 w-[75%] text-center">
            Crear Local
          </Text>
          <Text style={{ color: colors.primary.blue }}>aaaaaa</Text>
        </View>
        <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-center">
          {nameError === "" ? null : (
            <View className="w-full flex items-start ml-28">
              <Text className="text-red-800">{nameError}</Text>
            </View>
          )}
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
          {addressError === "" ? null : (
            <View className="w-full flex items-start ml-28">
              <Text className="text-red-800">{addressError}</Text>
            </View>
          )}
          <BasicTextInput
            inputType="text"
            placeholder="Dirección"
            textStyle="mt-4"
            title="Direccion del Local: "
            ref={addressRef}
            value=""
          />
          {locationError === "" ? null : (
            <View className="w-full flex items-start ml-28">
              <Text className="text-red-800">{locationError}</Text>
            </View>
          )}
          <BasicTextInput
            inputType="text"
            placeholder="Coordenadas"
            textStyle="mt-4"
            title="Coordenadas del Local: "
            ref={locationRef}
            value=""
          />
          {whatsappError === "" ? null : (
            <View className="w-full flex items-start ml-28">
              <Text className="text-red-800">{whatsappError}</Text>
            </View>
          )}
          <BasicTextInput
            inputType="number"
            placeholder="Número de WhatsApp"
            textStyle="mt-4"
            title="Número de WhatsApp: "
            ref={whatsappRef}
            value=""
          />
          {instagramError === "" ? null : (
            <View className="w-full flex items-start ml-28">
              <Text className="text-red-800">{instagramError}</Text>
            </View>
          )}
          <BasicTextInput
            inputType="text"
            placeholder="@Instagram"
            textStyle="mt-4"
            title="Instagram: "
            ref={instagramRef}
            value=""
          />
          {facebookError === "" ? null : (
            <View className="w-full flex items-start ml-28">
              <Text className="text-red-800">{facebookError}</Text>
            </View>
          )}
          <BasicTextInput
            inputType="text"
            placeholder="@Facebook"
            textStyle="mt-4"
            title="Facebook: "
            ref={facebookRef}
            value=""
          />
          {webpageError === "" ? null : (
            <View className="w-full flex items-start ml-28">
              <Text className="text-red-800">{webpageError}</Text>
            </View>
          )}
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
          <View className="flex flex-col justify-center items-center w-3/4 mt-3">
            <BasicButton
              logo={<CreateLogo />}
              text="Crear Local"
              style="mt-3 mb-4"
              onPress={handleSubmit}
            />
          </View>
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
