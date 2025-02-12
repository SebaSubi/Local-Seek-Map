import React from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Button,
} from "react-native";
import BasicTextInput from "../../../components/BasicTextInput";
import { Stack, useRouter } from "expo-router";
import { CreateLogo } from "../../../components/Logos";
import BasicButton from "../../../components/BasicButton";
import { useEffect, useRef, useState } from "react";
import {
  createServiceType,
  getAllTypesByName,
} from "../../../libs/serviceType";
import {
  createLocalService,
  createLocalServiceCategory,
  createService,
  getLocalServiceCatsByName,
  getServices,
  getServicesByName,
} from "../../../libs/localService";
import {
  LocalService,
  Service,
  ServiceType,
} from "../../../schema/GeneralSchema";
import BigTextInput from "../../../components/BigTextInput";
import BasicSearchButton from "../../../components/BasicSearchBar";
import { useLocalIdStore } from "../../../libs/localZustang";
import { useLocalServiceIdStore } from "../../../libs/localServiceZustang";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinaryServices } from "../../../libs/cloudinary";

export default function CreateService() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedType, setSelectedType] = useState<ServiceType>({
    id: "0000",
    name: "default",
  });
  const [services, setServices] = useState<Service[]>([]);
  const [serviceModal, setServiceModal] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState<string>();
  const [typeModalVisibility, setTypeModalVisibility] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [createType, setCreateType] = useState(false);

  const setLocalService = useLocalServiceIdStore(
    (state) => state.setLocalService
  );
  const local = useLocalIdStore((state) => state.local);
  const router = useRouter();

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
  const typeRef = useRef<any>(null);

  async function fetchServiceTypes() {
    const serviceTypes = await getLocalServiceCatsByName(search);
    setServiceTypes(serviceTypes);
  }

  async function fetchAndSetServices() {
    const services = await getServicesByName(search);
    setServices(services);
  }

  useEffect(() => {
    if (serviceModal) {
      fetchAndSetServices();
    } else {
      fetchServiceTypes();
    }
  }, [search, serviceModal, typeModalVisibility]);

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
    const serviceId = selectedServiceId;
    const description = descriptionRef.current?.getValue();
    const reservationURL = URLRef.current?.getValue();
    const reservationNumber = reservationNumberRef.current?.getValue();
    const serviceTypeId = selectedType.id!;
    const location = locationRef.current?.getValue();
    const address = addressRef.current?.getValue();

    if (
      !serviceId ||
      !description ||
      (!reservationURL && reservationNumber) ||
      selectedType.id === "0000" ||
      !location ||
      !address
    ) {
      Alert.alert("Por favor rellenar los campos obligatorios");
      return;
    } else if (!reservationURL && !reservationNumber) {
      Alert.alert("Por favor rellenar los campos obligatorios");
      return;
    }

    try {
      console.log("image:", image);

      if (!image) {
        Alert.alert(
          "Error",
          "Por favor, seleccione una imagen para el producto."
        );
        return;
      }

      const uploadedImageUrl = await uploadImageToCloudinaryServices(image);
      if (!uploadedImageUrl) {
        Alert.alert("Error", "No se pudo cargar la imagen");
        return;
      }

      const newService: LocalService = {
        serviceId,
        localId: local.id!,
        description,
        reservationURL,
        reservationNumber,
        location,
        address,
        localServiceCategoryId: selectedType.id!,
        imgURL: uploadedImageUrl,
        dateFrom: new Date(),
        dateTo: null,
      };

      const service = await createLocalService(newService);
      if (schedule) {
        setLocalService(service);
        router.push({
          pathname: "/CRUD/ServiceCRUD/ServiceSchedule/",
          params: {
            id: service.id,
            create: "true",
          },
        });
      }
      setImage(null);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo crear el local.");
    }
  };

  async function handleCreateType() {
    const name = typeRef.current?.getValue();
    const newType = await createLocalServiceCategory({ name });
    setSelectedType(newType);
  }

  // function handleCreatePlusSchedule() {
  //   console.log(createdService);
  //   if (createdService) {
  //     router.push({
  //       pathname: "/CRUD/ServiceCRUD/ServiceSchedule/CreateSchedule",
  //       params: {
  //         id: createdService.id,
  //       },
  //     });
  //   } else {
  //     Alert.alert(
  //       "Error",
  //       "El servicio fue creado con exito, pero no se pudo navegar a crear horario"
  //     );
  //   }
  // }

  return (
    <View className="w-full h-full bg-defaultBlue">
      <Modal
        animationType="slide"
        transparent={true}
        visible={serviceModal}
        onRequestClose={() => setServiceModal(false)}
      >
        <View
          className="flex items-center justify-center w-full h-full "
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <View className="flex items-center justify-start w-[85%] h-[75%] bg-white rounded-3xl">
            <Text className="font-thin text-base mt-4">
              Seleccione el servicio que desea cargar:
            </Text>
            <Pressable
              onPress={() => {
                router.replace("/CRUD/ServiceCRUD/CreateService");
                setServiceModal(false);
              }}
              className="flex items-center justify-center w-52 bg-[#f8f8f8] h-10 mt-2  rounded-2xl overflow-hidden mb-2"
            >
              <Text className="font-light text-sm">
                No encuentra el servicio?
              </Text>
            </Pressable>
            <BasicSearchButton
              placeholder="Buscar Servicio"
              onSearch={setSearch}
              background="#f8f8f8"
            />
            <FlatList
              data={services}
              horizontal={false}
              numColumns={2}
              renderItem={({ item, index }) => (
                <Pressable
                  className="flex items-center justify-start w-32 bg-[#f8f8f8] h-40 m-3 rounded-2xl overflow-hidden"
                  onPress={() => {
                    setSelectedServiceId(item.id!);
                    setServiceModal(false);
                  }}
                >
                  <View className="w-28 h-20 flex items-center justify-center  mt-3  ">
                    <Image
                      source={{
                        uri: item.imgURL || "https://via.placeholder.com/150",
                      }}
                      style={{
                        height: "100%",
                        width: "100%",
                        // borderRadius: 20,
                        resizeMode: "contain",
                      }}
                    />
                  </View>
                  <Text className="font-light text-sm mt-2">{item.name}</Text>
                  <Text className="font-light text-sm">
                    Tipo: {item.serviceType?.name}
                  </Text>
                </Pressable>
              )}
              keyExtractor={(item) => item.id!.toString()}
            />
          </View>
        </View>
      </Modal>
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
          <BasicTextInput
            inputType="text"
            value=""
            placeholder="Numero"
            textStyle="mt-4"
            title="Numero de Reservas"
            ref={reservationNumberRef}
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
                  style="mt-4 mb-4"
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
            onPress={() => {
              setTypeModalVisibility(true);
              fetchServiceTypes();
            }}
            className="bg-defaultGray flex items-center justify-center h-10 w-3/4 rounded-2xl mt-5"
          >
            <Text className="text-sm font-light">
              {selectedType && selectedType.name !== "default"
                ? selectedType.name
                : "Seleccionar Tipo de Servicio"}
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
          text="Crear Servicio"
          style="mt-4"
          onPress={() => handleSubmit(false)}
          background="white"
        />
        <BasicButton
          logo={<CreateLogo />}
          text="Crear + Horario"
          style="mt-4"
          onPress={() => handleSubmit(true)}
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
