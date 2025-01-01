import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { shift } from "../constants/consts";
import { LocalHours, LocalServiceSchedule } from "../schema/GeneralSchema";
import { getScheduleByLocalServiceId } from "../libs/localService";
import { useLocalServiceIdStore } from "../libs/localServiceZustang";

export default function ScheduleBox({
  shiftOpen,
  shiftClose,
  schedules,
}: {
  shiftOpen: shift;
  shiftClose: shift;
  schedules: LocalHours[];
}) {
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];

  if (shiftOpen === null || shiftClose === null) return;
  else
    return (
      <>
        <View
          style={{ height: schedules.length * 48 }}
          className="flex flex-col w-4/5 bg-[#e1e8e8] rounded-2xl mt-10"
        >
          {schedules.map((schedule: LocalServiceSchedule, index) => (
            <View key={schedule.id}>
              {index === 0 ? null : (
                <View
                  className={`w-5/6 h-0.5 bg-black ml-7 ${
                    index === 0 ? "mt-4" : "mt-2"
                  } rounded-lg`}
                ></View>
              )}

              <View
                key={schedule.id}
                className="flex flex-row justify-between mt-1 items-center"
              >
                <Text className="font-bold text-base ml-12 mt-2" key={index}>
                  {days[schedule.dayNumber! - 1]}
                </Text>
                <Text className="mr-12">
                  {shiftOpen === "FirstShiftStart"
                    ? schedule.FirstShiftStart
                    : shiftOpen === "SecondShiftStart"
                      ? schedule.SecondShiftStart
                      : shiftOpen === "ThirdShiftStart"
                        ? schedule.ThirdShiftStart
                        : null}
                  {" - "}
                  {shiftClose === "FirstShiftFinish"
                    ? schedule.FirstShiftFinish
                    : shiftClose === "SecondShiftFinish"
                      ? schedule.SecondShiftFinish
                      : shiftClose === "ThirdShiftFinish"
                        ? schedule.ThirdShiftFinish
                        : null}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </>
    );
}
