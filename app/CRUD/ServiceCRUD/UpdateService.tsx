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
import { createService, updateService } from "../../../libs/localService";
import { Service, ServiceType } from "../../../schema/GeneralSchema";
import * as ImagePicker from "expo-image-picker";
import BigTextInput from "../../../components/BigTextInput";
import BasicSearchButton from "../../../components/BasicSearchBar";
import BasicSelectable from "../../../components/BasicSelectable";
import { useLocalIdStore } from "../../../libs/localZustang";
import { useLocalServiceIdStore } from "../../../libs/localServiceZustang";

export default function UpdateService() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedType, setSelectedType] = useState<ServiceType>({
    id: "0000",
    name: "default",
  });
  const [typeModalVisibility, setTypeModalVisibility] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [createType, setCreateType] = useState(false);

  const service = useLocalServiceIdStore((state) => state.service);

  const local = useLocalIdStore((state) => state.local);
  const router = useRouter();

  const nameRef = useRef<{
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

  async function fetchServiceTypes() {
    const serviceTypes = await getAllTypesByName(search);
    setServiceTypes(serviceTypes);
  }

  useEffect(() => {
    if (service) {
      if (service.name) {
        nameRef.current?.setValue(service.name);
      }
      if (service.description) {
        descriptionRef.current?.setValue(service.description);
      }
      if (service.reservationURL) {
        URLRef.current?.setValue(service.reservationURL);
      }
      if (service.address) {
        addressRef.current?.setValue(service.address);
      }
      if (service.location) {
        locationRef.current?.setValue(service.location);
      }
      if (service.serviceType) {
        typeRef.current?.setValue(service.serviceType.name);
        setSelectedType(service.serviceType);
      }
    }
  }, []);

  useEffect(() => {
    fetchServiceTypes();
  }, [search]);

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
    const name = nameRef.current?.getValue();
    const description = descriptionRef.current?.getValue();
    const reservationURL = URLRef.current?.getValue();
    const serviceTypeId = selectedType.id!;
    const location = locationRef.current?.getValue();
    const address = addressRef.current?.getValue();

    if (
      !name ||
      !description ||
      !reservationURL ||
      serviceTypeId === "0000" ||
      !location ||
      !address
    ) {
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
        localId: local.id!,
        description,
        reservationURL,
        location,
        address,
        // imgURL: uploadedImageUrl,
        serviceTypeId,
        dateFrom: new Date(),
      };

      const updatedService = await updateService(service.id!, newService);
      if (schedule) {
        router.push({
          pathname: "/CRUD/ServiceCRUD/ServiceSchedule",
          params: {
            id: service.id,
          },
        });
      }
      setImage(null);
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
      <View className="w-full h-[90%] rounded-3xl overflow-hidden bg-white">
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
          <BasicTextInput
            inputType="text"
            value=""
            placeholder="Nombre"
            textStyle="mt-4"
            title="Nombre del Servicio: "
            ref={nameRef}
          />

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
            placeholder="URL o Numero"
            textStyle="mt-4"
            title="URL Reservas o Numero: "
            ref={URLRef}
          />

          <BasicTextInput
            inputType="text"
            value=""
            placeholder="Ej: 25 de Mayo 99, Libertador San Martin, Entre Rios"
            textStyle="mt-4"
            title="Dirección"
            ref={addressRef}
          />

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
            textStyle="mt-4"
            title="Coordenadas"
            ref={locationRef}
          />

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
              </View>
            </View>
          </Modal>

          <Pressable
            onPress={() => setTypeModalVisibility(true)}
            className="bg-defaultGray flex items-center justify-center h-10 w-3/4 rounded-2xl mt-5"
          >
            <Text className="text-sm font-light">
              {selectedType && selectedType.name !== "default"
                ? selectedType.name
                : "Seleccionar Tipo de Servicio"}
            </Text>
          </Pressable>
          <TouchableOpacity
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
          )}

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
