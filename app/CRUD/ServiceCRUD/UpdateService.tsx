import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import BasicTextInput from "../../../components/BasicTextInput";
import { Stack } from "expo-router";
import Header from "../../../components/Header";
import { CreateLogo } from "../../../components/Logos";
import BasicButton from "../../../components/BasicButton";
import { useEffect, useRef, useState } from "react";
import {
  deleteService,
  getServicesById,
  updateService,
} from "../../../libs/localService";
import { Service, ServiceType } from "../../../schema/GeneralSchema";
import { useLocalServiceIdStore } from "../../../libs/localServiceZustang";
import { getServiceTypes } from "../../../libs/serviceType";

export default function UpdateService() {
  const [service, setService] = useState<Service>();
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedType, setSelectedType] = useState<ServiceType>({
    id: "0000",
    name: "default",
  });
  const [typeModalVisibility, setTypeModalVisibility] = useState(false);

  const serviceId = useLocalServiceIdStore((state) => state.localServiceId);

  const nameRef = useRef<any>(null);
  const descriptionRef = useRef<any>(null);
  const URLRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const services = await getServicesById(serviceId);
      setService(services);
    };
    fetchData();
  }, [serviceId]);

  const handlePress = async () => {
    const name = nameRef.current?.getValue();
    const description = descriptionRef.current?.getValue();
    const reservationURL = URLRef.current.getValue();
    const serviceTypeId = selectedType.id;

    if (!name || !description || !reservationURL || serviceTypeId === "0000") {
      Alert.alert("Por favor rellenar los campos obligatorios");
      return;
    }

    const newService: Service = {
      name,
      description,
      reservationURL,
      serviceTypeId,
      dateFrom: new Date(),
    };
    console.log(updateService(serviceId, newService));
  };

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

  return (
    <View className="flex justify-center items-center bg-white h-full w-full">
      <Stack.Screen
        options={{
          header: () => <Header title="Actualizar Servicio" />,
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
      <BasicButton
        style="mt-5"
        text="Categoria"
        onPress={() => setTypeModalVisibility(true)}
      />

      <View className="flex flex-col justify-center items-center w-3/4 mt-3">
        <BasicButton
          logo={<CreateLogo />}
          text="Actualizar Servicio"
          style="mt-3"
          onPress={handlePress}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={typeModalVisibility}
        onRequestClose={() => setTypeModalVisibility(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Selecciona el tipo de búsqueda
            </Text>
            {serviceTypes.length === 0 ? (
              <Text> No hay tipos disponibles</Text>
            ) : (
              serviceTypes.map((category, index) => (
                <Pressable
                  onPress={() => {
                    setSelectedType(category);
                    setTypeModalVisibility(false);
                  }}
                  style={styles.modalOption}
                  key={index}
                >
                  <Text style={styles.modalOptionText}>{category.name}</Text>
                </Pressable>
              ))
            )}
            <Pressable
              onPress={() => setTypeModalVisibility(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
});
