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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BasicWarning from "../../../components/BasicWarning";
import { verifyUrl } from "../LocalCRUD/CreateLocal";

type error = "address" | "location" | "required" | "whatsapp" | "url" | "";

export default function CreateService() {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceModal, setServiceModal] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState<string>();
  const [warning, setWarning] = useState<{ schedule: boolean; war: boolean }>({
    schedule: false,
    war: false,
  });
  const [image, setImage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<{ type: error; message: string }>({
    type: "",
    message: "",
  });
  const insets = useSafeAreaInsets();

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

  // async function fetchServiceTypes() {
  //   const serviceTypes = await getLocalServiceCatsByName(search);
  //   setServiceTypes(serviceTypes);
  // }

  async function fetchAndSetServices() {
    const services = await getServicesByName(search);
    setServices(services);
  }

  useEffect(() => {
    if (serviceModal) {
      fetchAndSetServices();
    }
  }, [search, serviceModal]);

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

  const handleSubmit = async (schedule: boolean, warn: boolean) => {
    const serviceId = selectedServiceId;
    const description = descriptionRef.current?.getValue();
    const reservationURL = URLRef.current?.getValue();
    const reservationNumber = reservationNumberRef.current?.getValue();
    const location = locationRef.current?.getValue();
    const address = addressRef.current?.getValue();

    if (!location || !address) {
      setError({
        type: "required",
        message: "*Por favor complete todos los campos obligatorios",
      });
      return;
    } else if (warn && !reservationURL && !reservationNumber) {
      setWarning({ schedule: schedule, war: true });
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
        message: "*La longitud mínima de un número es de 8",
      });
      return;
    } else if (reservationNumber && reservationNumber.length > 18) {
      setError({
        type: "whatsapp",
        message: "*La longitud máxima de un número es de 18 ",
      });
      return;
    }
    if (reservationURL && !verifyUrl(reservationURL)) {
      setError({ type: "url", message: "*URL no valida" });
      return;
    }

    try {
      // console.log("image:", image);

      // if (!image) {
      //   Alert.alert(
      //     "Error",
      //     "Por favor, seleccione una imagen para el producto."
      //   );
      //   return;
      // }

      // const uploadedImageUrl = await uploadImageToCloudinaryServices(image);
      // if (!uploadedImageUrl) {
      //   Alert.alert("Error", "No se pudo cargar la imagen");
      //   return;
      // }

      let uploadedImageUrl = null;
      if (image) {
        uploadedImageUrl = await uploadImageToCloudinaryServices(image);
        if (!uploadedImageUrl) {
          Alert.alert("Error", "No se pudo cargar la imagen");
          return;
        }
      }

      const newService: LocalService = {
        serviceId,
        localId: local.id!,
        description,
        reservationURL,
        reservationNumber,
        location,
        address,
        imgURL: uploadedImageUrl,
        dateFrom: new Date(),
        dateTo: null,
      };

      const service = await createLocalService(newService);
      if (schedule) {
        setLocalService(service);
        setWarning({ schedule: false, war: false });
        router.push({
          pathname: "/CRUD/ServiceCRUD/ServiceSchedule/CreateSchedule",
          params: {
            id: service.id,
            create: "true",
          },
        });
      } else {
        router.back();
      }
      setImage(null);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo crear el local.");
    }
  };

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
                        uri:
                          item.imgURL ||
                          "https://i0.wp.com/mikeyarce.com/wp-content/uploads/2021/09/woocommerce-placeholder.png?ssl=1",
                      }}
                      style={{
                        height: "100%",
                        width: "100%",
                        // borderRadius: 20,
                        resizeMode: "contain",
                      }}
                    />
                  </View>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    className="font-light text-sm mt-2"
                  >
                    {item.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="font-light text-sm px-2 pb-1"
                  >
                    Tipo: {item.serviceType?.name}
                  </Text>
                </Pressable>
              )}
              keyExtractor={(item) => item.id!.toString()}
            />
            <Pressable
              onPress={() => {
                router.back();
              }}
              className="w-20 h-10 bg-defaultGray rounded-2xl flex items-center justify-center my-4"
            >
              <Text>Volver</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View
        className={`w-full h-[90%] rounded-3xl overflow-hidden bg-white`}
        style={{
          paddingTop: insets.top,
        }}
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
            maxLength={350}
          />
          <BasicTextInput
            inputType="text"
            value=""
            placeholder="URL"
            textStyle="mt-4"
            title="URL Reservas"
            ref={URLRef}
          />
          {error.type === "url" ? (
            <View className="w-3/4">
              <Text className="text-red-800 text-sm font-light">
                {error.message}
              </Text>
            </View>
          ) : null}
          <BasicTextInput
            inputType="number"
            value=""
            placeholder="Numero"
            textStyle="mt-4"
            title="Numero de Reservas"
            ref={reservationNumberRef}
          />
          {error.type === "whatsapp" && (
            <View className="w-3/4">
              <Text className="text-red-800 text-sm font-light">
                {error.message}
              </Text>
            </View>
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
            textStyle={`mt-4 ${error.type === "required" || error.type === "location" ? " text-red-800" : ""}`}
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
          {/* <Modal
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
          </Modal> */}

          {/* <Pressable
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
          </Pressable> */}

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
          {warning && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={warning.war}
              onRequestClose={() =>
                setWarning({ schedule: warning.schedule, war: false })
              }
            >
              <View
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                <BasicWarning
                  text="No cargo ni un URL de reservas ni un numero de resevas, las personas no sabran como contactarlo, esta seguro que quiere crear el servicio?"
                  cancelButton={false}
                  buttonLeft="Cancelar"
                  buttonRight="Crear"
                  onPressRight={() => {
                    handleSubmit(warning.schedule, false);
                  }}
                  onPressLeft={() =>
                    setWarning({ schedule: warning.schedule, war: false })
                  }
                />
              </View>
            </Modal>
          )}
        </ScrollView>
      </View>
      <View className="flex flex-row justify-evenly items-center w-full">
        <BasicButton
          logo={<CreateLogo />}
          text="Crear Servicio"
          style="mt-4"
          onPress={() => handleSubmit(false, true)}
          background="white"
        />
        <BasicButton
          logo={<CreateLogo />}
          text="Crear + Horario"
          style="mt-4"
          onPress={() => handleSubmit(true, true)}
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
