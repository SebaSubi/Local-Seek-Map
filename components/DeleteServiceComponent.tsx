import { Link } from "expo-router";
import { LocalProduct, LocalService, Service } from "../schema/GeneralSchema";
import {
  Text,
  View,
  PanResponder,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import { useLocalServiceIdStore } from "../libs/localServiceZustang";

export default function DeleteServiceComponent({
  service,
  onDelete,
}: {
  service: LocalService;
  onDelete: (id: string) => void;
}) {
  const setLocalService = useLocalServiceIdStore(
    (state) => state.setLocalService
  );
  const translateX = new Animated.Value(0);
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < 0) {
        translateX.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -100) {
        Animated.spring(translateX, {
          toValue: -80,
          useNativeDriver: true,
        }).start();
      } else if (gestureState.dx > 100) {
        Animated.spring(translateX, {
          toValue: 80,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  function handleUpdate() {
    setLocalService(service);

    // console.log("yes"); For some reason if i dont do this it calls the delete function
  }
  return (
    <View className="flex-row rounded-2xl overflow-hidden mt-2">
      <Animated.View
        style={{
          transform: [{ translateX: translateX }],
        }}
      >
        <Link
          href={{
            pathname: "CRUD/ServiceCRUD/UpdateIndex",
            params: {
              serviceId: service.id,
            },
          }}
          asChild
        >
          <TouchableOpacity
            className="w-28 h-24 bg-[#1a253d] justify-center items-end absolute left-[-80px] z-[-1] rounded-2xl"
            onPress={handleUpdate}
          >
            <Text className="text-white font-bold mr-9">Actualizar</Text>
          </TouchableOpacity>
        </Link>
        <View
          className="flex flex-row items-center justify-between w-72 h-24 bg-defaultGray  rounded-2xl overflow-hidden "
          {...panResponder.panHandlers}
        >
          <View className="w-32  ">
            <Image
              style={{
                height: "100%",
                width: "100%",
                borderRadius: 4,
                resizeMode: "contain",
              }}
              source={{
                uri: service.imgURL ?? "https://via.placeholder.com/150",
              }}
            />
          </View>
          <View className="flex-1  h-full items-center justify-center">
            <Text className="font-light text-base">
              {service.service?.name}
            </Text>
            <Text className="font-thin text-sm">
              {service.localServiceCategory?.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => onDelete(service.id!)}
          className="w-32 h-24 bg-[#ff6c3d] justify-center items-end absolute right-[-80px] z-[-1] rounded-2xl"
        >
          <Text className="text-white font-bold mr-4">Borrar</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
