import { Link } from "expo-router";
import { LocalSchedule, LocalServiceSchedule } from "../schema/GeneralSchema";
import {
  Text,
  View,
  PanResponder,
  TouchableOpacity,
  Animated,
} from "react-native";
import { bringDayName } from "../libs/libs";
import { useLocalScheduleIdStore } from "../libs/scheduleZustang";
import { useLocalServiceIdStore } from "../libs/localServiceZustang";

export default function EditScheduleContainer({
  local,
  schedule,
  href,
  onDelete,
}: {
  local: boolean;
  schedule: LocalSchedule | LocalServiceSchedule;
  href: string;
  onDelete: (id: string) => void;
}) {
  const setServiceSchedule = useLocalServiceIdStore(
    (state) => state.setServiceSchedule
  );

  const setLocalScheduleId = useLocalScheduleIdStore(
    (state) => state.setScheduleId
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
    if (local) {
      setLocalScheduleId(schedule.id!);
    } else {
      setServiceSchedule(schedule as LocalServiceSchedule);
    }

    // console.log("yes"); For some reason if i dont do this it calls the delete function
  }

  return (
    <View style={{ flex: 1 }} className="flex-row ">
      <Animated.View
        style={{
          transform: [{ translateX: translateX }],
        }}
      >
        <Link
          href={{
            pathname: href,
            params: {
              id: schedule.id,
            },
          }}
          asChild
        >
          <TouchableOpacity
            className="w-20 h-20 bg-[#1a253d] justify-center items-center  mt-2 absolute left-[-80px] z-[-1]"
            onPress={handleUpdate}
          >
            <Text className="text-white font-bold">Actualizar</Text>
          </TouchableOpacity>
        </Link>
        <View
          className="flex items-center justify-center w-72 h-20 bg-[#f6f6f6] mt-2 "
          {...panResponder.panHandlers}
        >
          <Text>
            {schedule.dayNumber ? bringDayName(schedule.dayNumber) : null}
          </Text>
          <Text>
            {schedule.FirstShiftStart} - {schedule.FirstShiftFinish}...
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onDelete(schedule.id!)}
          className="w-20 h-20 bg-[#ff6c3d] justify-center items-center  mt-2 absolute right-[-80px] z-[-1]"
        >
          <Text className="text-white font-bold">Borrar</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
