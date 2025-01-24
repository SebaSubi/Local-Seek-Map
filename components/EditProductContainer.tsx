import { LocalProduct, Product } from "../schema/GeneralSchema";
import {
  StyleSheet,
  Text,
  View,
  PanResponder,
  TouchableOpacity,
  Animated,
} from "react-native";

export default function EditProductContainer({
  product,
  onDelete,
}: {
  product: LocalProduct;
  onDelete: (id: string) => void;
}) {
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
      if (gestureState.dx < -50) {
        console.log("worked");
        // onDelete(product.id);
        Animated.spring(translateX, {
          toValue: -100,
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
  return (
    <View style={{ flex: 1 }} className="flex-row ">
      <Animated.View
        style={{
          transform: [{ translateX: translateX }],
        }}
      >
        <View
          className="flex items-center justify-center w-72 h-20 bg-[#f6f6f6] mt-2 "
          {...panResponder.panHandlers}
        >
          <Text>{product.product.name}</Text>
        </View>
        <TouchableOpacity
          onPress={() => onDelete(product.id)}
          className="w-20 h-20 bg-red-500 justify-center items-center  mt-2 absolute right-[-80px] z-[-1]"
        >
          <Text className="text-white font-bold">Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
