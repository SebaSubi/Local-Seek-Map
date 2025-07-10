import React from "react";
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
  TouchableOpacity,
  FlatList,
} from "react-native";
import BasicTextInput from "../../../components/BasicTextInput";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../../components/Header";
import { CreateLogo } from "../../../components/Logos";
import BasicButton from "../../../components/BasicButton";
import { useEffect, useRef, useState } from "react";
import {
  createServiceType,
  getAllTypesByName,
  getServiceTypes,
} from "../../../libs/serviceType";
import {
  createService,
  getLocalServiceCatsByName,
  updateService,
} from "../../../libs/localService";
import {
  LocalService,
  LocalServiceCategory,
  Service,
  ServiceType,
} from "../../../schema/GeneralSchema";
import BigTextInput from "../../../components/BigTextInput";
import BasicSearchButton from "../../../components/BasicSearchBar";
import BasicSelectable from "../../../components/BasicSelectable";
import { useLocalIdStore } from "../../../libs/localZustang";
import { useLocalServiceIdStore } from "../../../libs/localServiceZustang";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinaryServices } from "../../../libs/cloudinary";
import { verifyUrl } from "../LocalCRUD/CreateLocal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type error = "address" | "location" | "required" | "whatsapp" | "url" | "";

export default function UpdateService() {
  const [serviceTypes, setServiceTypes] = useState<LocalServiceCategory[]>([]);
  const [selectedType, setSelectedType] = useState<LocalServiceCategory>({
    id: "0000",
    name: "default",
  });
  const [typeModalVisibility, setTypeModalVisibility] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [createType, setCreateType] = useState(false);
  const [warn, setWarning] = useState(false);
  const insets = useSafeAreaInsets();

  const localService = useLocalServiceIdStore((state) => state.localService);

  const local = useLocalIdStore((state) => state.local);
  const router = useRouter();

  //Error handlers
  const [error, setError] = useState<{ type: error; message: string }>({
    type: "",
    message: "",
  });

  const reservationNumberRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>(null);
  const descriptionRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>(null);
  const URLRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>(null);
  const addressRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>(null);
  const locationRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>(null);
  const typeRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>(null);

  // async function fetchServiceTypes() {
  //   const serviceTypes = await getLocalServiceCatsByName(search);
  //   setServiceTypes(serviceTypes);
  // }

  useEffect(() => {
    if (localService.service) {
      if (localService.reservationNumber) {
        reservationNumberRef.current?.setValue(localService.reservationNumber);
      }
      if (localService.description) {
        descriptionRef.current?.setValue(localService.description);
      }
      if (localService.reservationURL) {
        URLRef.current?.setValue(localService.reservationURL);
      }
      if (localService.address) {
        addressRef.current?.setValue(localService.address);
      }
      if (localService.location) {
        locationRef.current?.setValue(localService.location);
      }
      if (localService.localServiceCategory) {
        typeRef.current?.setValue(localService.localServiceCategory.name!);
        setSelectedType(localService.localServiceCategory);
      }
    }
  }, []);

  // useEffect(() => {
  //   fetchServiceTypes();
  // }, [search]);

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

  const handleSubmit = async (schedule: boolean) => {
    const reservationNumber = reservationNumberRef.current?.getValue();
    const description = descriptionRef.current?.getValue();
    const reservationURL = URLRef.current?.getValue();
    const localServiceCategoryId = selectedType.id!;
    const location = locationRef.current?.getValue();
    const address = addressRef.current?.getValue();

    if (!location || !address) {
      setError({
        type: "required",
        message: "*Por favor complete todos los campos obligatorios",
      });
      return;
    } else if (warn && !reservationURL && !reservationNumber) {
      // setWarning(true);
      return;
    } else if (5 > address.length || address.length > 120) {
      setError({
        type: "address",
        message:
          "*La dirección no puede tener menos de 5 caracteres o mas de 120",
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
        message:
          "*La dirección del servicio no puede tener caracteres especiales",
      });
      return;
    } else if (location.length < 10) {
      setError({
        type: "location",
        message:
          "Las coordenadas del servicio requieren mínimamente 14 caracteres",
      });
      return;
    } else if (location.length >= 60) {
      setError({
        type: "location",
        message:
          "Las coordenadas del servicio no pueden tener mas de 60 caracteres",
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
          "*Las coordenadas del servicio no puede tener caracteres especiales",
      });
      return;
    } else if (reservationNumber && reservationNumber.length < 8) {
      setError({
        type: "whatsapp",
        message: "*La longitud minima de un numero es de 8",
      });
      return;
    } else if (reservationNumber && reservationNumber.length > 18) {
      setError({
        type: "whatsapp",
        message: "*La longitud maxima de un numero es de 18 ",
      });
      return;
    }
    if (reservationURL && !verifyUrl(reservationURL)) {
      setError({ type: "url", message: "*URL no valida" });
      return;
    }

    try {
      let uploadedImageUrl = null;

      if (image) {
        const uploadedImageUrl = await uploadImageToCloudinaryServices(image);
        if (!uploadedImageUrl) {
          Alert.alert("Error", "No se pudo cargar la imagen");
          return;
        }
      }

      const newService: LocalService = {
        reservationNumber,
        description,
        reservationURL,
        location,
        address,
        imgURL: uploadedImageUrl,
        dateFrom: new Date(),
      };

      const updatedService = await updateService(localService.id!, newService);
      if (schedule) {
        router.push({
          pathname: "/CRUD/ServiceCRUD/ServiceSchedule",
          params: {
            id: localService.id,
          },
        });
      }
      setImage(null);
      Alert.alert("Éxito", "Servicio actualizado con éxito");
      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo actualizar el servicio.");
    }
  };

  async function handleCreateType() {
    const name = typeRef.current?.getValue();
    if (name) {
      const newType = await createServiceType({ name });
      setSelectedType(newType);
    } else {
      Alert.alert("Error", "Error creando el nuevo tipo");
    }
  }

  return (
    <View className="w-full h-full bg-defaultBlue">
      <View
        className="w-full h-[90%] rounded-3xl overflow-hidden bg-white"
        style={{ paddingTop: insets.top }}
      >
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
          {error.type === "required" ? (
            <View className="w-3/4">
              <Text className="text-red-800">{error.message}</Text>
            </View>
          ) : null}
          <BigTextInput
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
            placeholder="URL"
            textStyle="mt-4"
            title="URL Reservas"
            ref={URLRef}
          />
          {error.type === "url" && (
            <Text className="text-defaultOrange text-sm font-light">
              *{error.message}
            </Text>
          )}
          <BasicTextInput
            inputType="number"
            value=""
            placeholder="Numero"
            textStyle="mt-4"
            title="Numero de Reservas"
            ref={reservationNumberRef}
          />
          {error.type === "whatsapp" && (
            <Text className="text-defaultOrange text-sm font-light">
              *{error.message}
            </Text>
          )}
          <BasicTextInput
            inputType="text"
            value=""
            placeholder="Ej: 25 de Mayo 99, Libertador San Martin, Entre Rios"
            textStyle={`mt-4 ${error.type === "required" || error.type === "address" ? " text-red-800" : ""}`}
            title="Dirección"
            ref={addressRef}
          />
          {error.type === "address" ? (
            <View className="w-3/4">
              <Text className="text-red-800">{error.message}</Text>
            </View>
          ) : null}
          <Pressable
            style={({ pressed }) => [
              { backgroundColor: pressed ? "#f8f8f8" : "white" },
              { marginTop: 6 },
              { padding: 6 },
              { borderRadius: 16 },
            ]}
            onPress={() => {
              addressRef.current?.setValue(local.address!);
            }}
          >
            <Text className="text-defaultBlue text-sm font-light">
              Utilizar la misma dirección de Local?
            </Text>
          </Pressable>

          <BasicTextInput
            inputType="text"
            value=""
            placeholder="Ej: -1.000, -2.000"
            textStyle={`mt-4 ${error.type === "required" || error.type === "address" ? " text-red-800" : ""}`}
            title="Coordenadas"
            ref={locationRef}
          />
          {error.type === "location" ? (
            <View className="w-3/4">
              <Text className="text-red-800">{error.message}</Text>
            </View>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              { backgroundColor: pressed ? "#f8f8f8" : "white" },
              { marginTop: 6 },
              { padding: 6 },
              { borderRadius: 16 },
            ]}
            onPress={() => {
              locationRef.current?.setValue(local.location!);
            }}
          >
            <Text className="text-defaultBlue text-sm font-light">
              Utilizar las mismas coordenadas del local?
            </Text>
          </Pressable>
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
                  style="mt-4"
                />
                {createType ? (
                  <View className="w-full h-full flex items-center justify-center">
                    <BasicTextInput
                      inputType="text"
                      placeholder="Nombre"
                      title="Nombre de Nueva Categoría: "
                      value=""
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
                          className="flex items-center justify-center w-52 bg-[#f8f8f8] h-10 mt-2 rounded-2xl overflow-hidden"
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
                  className="w-20 h-10 bg-defaultBlue rounded-2xl flex items-center justify-center my-2 absolute bottom-2 "
                >
                  <Text className="text-white">Cancelar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <View style={{ marginTop: 20 }}>
            <Button title="Seleccionar Imagen" onPress={handleImagePicker} />
          </View>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 100, height: 100, marginTop: 10 }}
            />
          )}

          {/* <TouchableOpacity
            onPress={handleImagePicker}
            className="bg-defaultGray flex items-center justify-center h-10 w-3/4 rounded-2xl mt-5"
          >
            <Text className="text-sm font-light">Seleccionar Imagen</Text>
          </TouchableOpacity>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 100, height: 100, marginTop: 10 }}
            />
          )} */}

          <Text className="text-red-600 mt-4">
            *No te olvides de agregale un horario a tu Servicio!
          </Text>
        </ScrollView>
      </View>
      <View className="flex flex-row justify-evenly items-center w-full">
        <BasicButton
          logo={<CreateLogo />}
          text="Actualizar Servicio"
          style="mt-4"
          onPress={() => handleSubmit(false)}
          background="white"
        />
      </View>
    </View>
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

  typeButtonText: {
    fontSize: 16, // Aumenta el tamaño de la fuente
    // fontWeight: "bold",
    textAlign: "center",
  },
});
