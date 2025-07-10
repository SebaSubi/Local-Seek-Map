import {
  View,
  Text,
  Alert,
  Button,
  Pressable,
  FlatList,
  Modal,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router, Stack } from "expo-router";
import GoBackButton from "../../../../components/GoBackButton";
import * as ImagePicker from "expo-image-picker";
import { Service, ServiceType } from "../../../../schema/GeneralSchema";
import {
  createServiceType,
  getAllTypesByName,
  UpdateAdminService,
} from "../../../../libs/serviceType";
import { uploadImageToCloudinaryServices } from "../../../../libs/cloudinary";
import BasicSearchButton from "../../../../components/BasicSearchBar";
import BasicButton from "../../../../components/BasicButton";
import { CreateLogo, TrashIcon } from "../../../../components/Logos";
import BasicTextInput from "../../../../components/BasicTextInput";
import { colors } from "../../../../constants/colors";
import { useService } from "../../../../libs/serviceZustang";
import ServiceDeleteModal from "../../../../components/modals/ServiceDeleteModal";

export default function EditAdminService() {
  const service = useService((service) => service.service);
  // console.log(service);

  const [search, setSearch] = useState("");
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedType, setSelectedType] = useState<ServiceType>({
    id: "0000",
    name: "default",
  });

  const [createType, setCreateType] = useState(false);
  const [typeModalVisibility, setTypeModalVisibility] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  type error = "name" | "category" | "required" | "";
  const [error, setError] = useState<{ type: error; message: string }>({
    type: "",
    message: "",
  });

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const nameRef = useRef<{
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
    if (service.serviceType) {
      setSelectedType(service.serviceType);
    }
    if (service.imgURL) {
      setImage(service.imgURL);
    }
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
      aspect: [4, 4],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const name = nameRef.current?.getValue();
    const serviceTypeId = selectedType.id!;

    if (!name || serviceTypeId === "0000") {
      setError({
        type: "required",
        message: "*Por favor complete los campos obligatorios",
      });
      return;
    } else if (name.length < 2) {
      setError({
        type: "name",
        message: "*El nombre no puede tener menos de 2 caracteres",
      });
      return;
    }

    try {
      let uploadedImageUrl = null;
      if (image) {
        uploadedImageUrl = await uploadImageToCloudinaryServices(image);
        if (!uploadedImageUrl) {
          Alert.alert("Error", "No se pudo cargar la imagen");
          return;
        }
      }

      const newService: Service = {
        id: service.id,
        name,
        imgURL: uploadedImageUrl,
        serviceTypeId,
        dateFrom: new Date(),
      };

      console.log(newService);

      const updatedService = await UpdateAdminService(newService);
      setImage(null);
      router.replace("/CRUD/AdminCRUD/AdminService/AdminService");
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el local.");
    }
  };
  async function handleCreateType() {
    const name = typeRef.current?.getValue();
    if (!name || name.length < 2) {
      setError({
        type: "category",
        message:
          "*El nombre de la categoría no puede tener menos de 2 caracteres",
      });
    } else {
      setError({ type: "", message: "" });
      const newType = await createServiceType({ name });
      setSelectedType(newType);
      setCreateType(false);
      setTypeModalVisibility(false);
    }
  }
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
            Editar Servicio
          </Text>
          <GoBackButton iconColor="white" style="ml-1 opacity-0" />
        </View>
        <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-center">
          {/* <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
            }}
          > */}
          {error.type === "required" ? (
            <View className="w-3/4 mb-5">
              <Text className="text-red-800">{error.message}</Text>
            </View>
          ) : null}
          <BasicTextInput
            inputType="text"
            value={service.name}
            placeholder="Nombre"
            textStyle={`"mt-4 ${error.type === "required" || error.type === "name" ? "text-red-800" : ""}`}
            title="Nombre del Servicio: "
            ref={nameRef}
            maxLength={30}
          />
          {error.type === "name" ? (
            <View className="w-3/4 mb-5">
              <Text className="text-red-800">{error.message}</Text>
            </View>
          ) : null}
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
                  text={createType ? "Volver" : "No encunetra la categoría?"}
                  onPress={() => {
                    createType ? setCreateType(false) : setCreateType(true);
                  }}
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
                      textStyle={
                        error.type === "category" ? "text-red-800" : ""
                      }
                      maxLength={40}
                      ref={typeRef}
                    />
                    {error.type === "category" ? (
                      <View className="w-3/4 mb-5">
                        <Text className="text-red-800">{error.message}</Text>
                      </View>
                    ) : null}
                    <BasicButton
                      logo={<CreateLogo />}
                      text="Crear Categoría"
                      onPress={() => {
                        handleCreateType();
                      }}
                      background="#f8f8f8"
                      style="mt-4"
                    />
                  </View>
                ) : (
                  <>
                    <BasicSearchButton
                      placeholder="Buscar Categoría"
                      onSearch={setSearch}
                      background="#f8f8f8"
                      style="mb-2"
                    />
                    <View className="flex-1 ">
                      <FlatList
                        data={serviceTypes}
                        renderItem={({ item }) => (
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
                    </View>
                  </>
                )}
                <Pressable
                  onPress={() => {
                    setTypeModalVisibility(false);
                  }}
                  className="w-20 h-10 bg-defaultBlue rounded-2xl flex items-center justify-center my-2 absolute bottom-2 "
                >
                  <Text className="text-white">Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Pressable
            onPress={() => setTypeModalVisibility(true)}
            className="bg-defaultGray flex items-center justify-center h-10 w-3/4 rounded-2xl mt-5"
          >
            <Text
              className={`text-sm font-light ${error.type === "required" || error.type === "category" ? "text-red-800" : ""}`}
            >
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
          <BasicButton
            text="Modificar Servicio"
            style="mt-4 pl-2"
            onPress={() => handleSubmit()}
            background={colors.primary.lightGray}
            logo={<CreateLogo />}
          />
          <ServiceDeleteModal
            isVisible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
          />
          <BasicButton
            text="Eliminar Producto"
            background="#cc0000"
            textStyle="text-white"
            style="mt-4 pl-1"
            logo={
              <View className="flex px-2">
                <TrashIcon color="#fff" size={21} />
              </View>
            }
            onPress={() => setDeleteModalVisible(!deleteModalVisible)}
          />

          {/* <TouchableOpacity
            onPress={handleImagePicker}
            className="bg-defaultGray flex items-center justify-center h-10 w-3/4 rounded-2xl mt-5"
          >
            <Text className="text-sm font-light">Seleccionar Imagen</Text>
          </TouchableOpacity> */}

          {/* {image && (
            <Image
              source={{ uri: image || defaultImage }}
              style={{ width: 100, height: 100, marginTop: 10 }}
            />
          )} */}
          {/* </ScrollView> */}
        </View>
        {/* <View className="flex flex-row justify-evenly items-end w-full">
          <View className="flex w-16 h-12 justify-center   items-start ">
            <GoBackButton style="mt-2" iconColor="white" />
          </View>
          
        </View> */}
      </View>
    </>
  );
}
