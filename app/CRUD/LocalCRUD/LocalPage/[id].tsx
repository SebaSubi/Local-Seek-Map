import {
  View,
  Text,
  Image,
  Pressable,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Local, LocalSchedule } from "../../../../schema/GeneralSchema";
import { colors } from "../../../../constants/colors";
import { EmptyHeartIcon } from "../../../../components/Logos";
import BasicLine from "../../../../components/BasicLine";
import LocalInformation from "../../../../components/LocalInformation";
import { getLocal } from "../../../../libs/local";
import Header from "../../../../components/Header";
import LocalMap from "../../../../components/LocalMap";
import { useLocalIdStore } from "../../../../libs/scheduleZustang";
import { getSchedulesByLocalId } from "../../../../libs/localSchedule";
import Schedule from "../../../../components/Schedule";

export default function LocalPage() {
  const { id, name, localCoordinates, image } = useLocalSearchParams();
  const [local, setLocals] = useState<Local>();
  const [schedules, setSchedules] = useState<LocalSchedule[]>([]);
  const [info, setInfo] = useState(false); //This will be a state that sets weather the info is showing or the schedule. False = info, true = schedule.

  // const setLocalId = useLocalIdStore((state) => state.setLocalId);
  // setLocalId(id as string);

  async function fetchAndSetLocals() {
    const searchLocal = await getLocal(id as string);
    setLocals(searchLocal);
  }

  useEffect(() => {
    const fetchLocals = async () => {
      await fetchAndSetLocals();
    };
    fetchLocals();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const schedules = await getSchedulesByLocalId(id as string);
      setSchedules(schedules);
    };
    fetchData();
  }, [id]);
  // console.log(info);
  //hacete un boton e horarios con una flechita
  // console.log(name as string);
  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header title={(name as string) ?? "local"} />,
        }}
      />
      <View
        className="flex h-full w-full justify-center mt-6"
        style={{ flex: 1 }}
      >
        {/* <View className="flex flex-row justify-between items-center">
          <Text className="text-5xl font-bold p-2 pl-5">{name}</Text>
          <View className="pr-6 p-2">
            <EmptyHeartIcon color={colors.primary.orange} size={36} />
          </View>
        </View> */}
        <View className="flex flex-row justify-evenly w-full m-1 mt-2">
          <Pressable
            style={info ? { borderBottomWidth: 2 } : {}} //Consider later putting an animation to this
            className="mb-2"
            onPress={() => setInfo(true)}
          >
            <Text className="text-xl font-bold">Horarios</Text>
          </Pressable>
          <Pressable
            className="mb-2"
            style={info ? {} : { borderBottomWidth: 2 }}
            onPress={() => setInfo(false)}
          >
            <Text className="text-xl font-bold">Información</Text>
          </Pressable>
        </View>
        <View className="flex items-center w-full h-full">
          {local &&
            (info ? (
              <View className="w-full h-full">
                <Schedule schedule={schedules} />
              </View>
            ) : local!.facebook ||
              local!.instagram ||
              local!.webpage ||
              local!.whatsapp ||
              local!.address ? (
              <LocalInformation
                instagram={local!.instagram}
                whatsapp={local!.whatsapp?.toString()}
                facebook={local!.facebook}
                location={local!.address}
                webpage={local!.webpage}
                coordinates={local!.location}
              />
            ) : null)}
        </View>
      </View>
    </>
  );
}
