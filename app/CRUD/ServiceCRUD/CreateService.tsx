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
import { Stack, useRouter } from "expo-router";
import Header from "../../../components/Header";
import { CreateLogo } from "../../../components/Logos";
import BasicButton from "../../../components/BasicButton";
import { useEffect, useRef, useState } from "react";
import {
  createServiceType,
  getAllTypesByName,
  getServiceTypes,
} from "../../../libs/serviceType";
import { createService } from "../../../libs/localService";
import { Service, ServiceType } from "../../../schema/GeneralSchema";
import * as ImagePicker from "expo-image-picker";
import BigTextInput from "../../../components/BigTextInput";
import BasicSearchButton from "../../../components/BasicSearchBar";
import BasicSelectable from "../../../components/BasicSelectable";
import { useLocalIdStore } from "../../../libs/localZustang";

export default function CreateService() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedType, setSelectedType] = useState<ServiceType>({
    id: "0000",
    name: "default",
  });
  const [typeModalVisibility, setTypeModalVisibility] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [createType, setCreateType] = useState(false);
  const [createdService, setCreatedService] = useState<Service | null>(null);
  const [goSchedule, setGoSchedule] = useState(false);

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
  const typeRef = useRef<any>(null);

  async function fetchServiceTypes() {
    const serviceTypes = await getAllTypesByName(search);
    setServiceTypes(serviceTypes);
  }

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

  const handleSubmit = async () => {
    const name = nameRef.current?.getValue();
    const description = descriptionRef.current?.getValue();
    const serviceTypeId = selectedType.id!;
    const location = locationRef.current?.getValue();
    const address = addressRef.current?.getValue();

    if (!name || serviceTypeId === "0000") {
      Alert.alert("Por favor rellenar los campos obligatorios");
      return;
    }

    console.log(local.id);

    try {
      // const uploadedImageUrl = await uploadImageToCloudinaryServices(image);
      // if (!uploadedImageUrl) {
      //   Alert.alert("Error", "No se pudo cargar la imagen.");
      //   return;
      // }

      const newService: Service = {
        name,
        imgURL: "",
        serviceTypeId,
        dateFrom: new Date(),
      };

      const service = await createService(newService);
      setImage(null);
      router.replace("/CRUD/ServiceCRUD/AddService");
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el local.");
    }
  };

  async function handleCreateType() {
    const name = typeRef.current?.getValue();
    const newType = await createServiceType({ name });
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
                  style="mt-4 mb-2"
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
        </ScrollView>
      </View>
      <View className="flex flex-row justify-evenly items-center w-full">
        <BasicButton
          logo={<CreateLogo />}
          text="Crear Servicio"
          style="mt-4"
          onPress={() => handleSubmit()}
          background="white"
        />
      </View>
    </View>
  );
} //For the Brand and for the Tupe, we will have to make them select from ones we give them, or else the database will get filled with garbage. We might have to make a new component for that.
// Also add that you can change the imput type to number for the price. And it only accepts numbers
