import React, { useState, forwardRef, useImperativeHandle, Ref } from "react";
import {
  View,
  Text,
  Pressable,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { specificDate } from "../constants/consts";
import { Platform } from "react-native";

const options: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

interface TimeSelectProps {
  logo?: any;
  text?: string;
  defaultTime?: Date;
  nextDay?: boolean;
  setNextDay?: React.Dispatch<React.SetStateAction<boolean>>;
}

const TimeSelect = forwardRef(
  ({ text, defaultTime, nextDay, setNextDay }: TimeSelectProps, ref) => {
    const [time, setTime] = useState(
      defaultTime && defaultTime !== specificDate ? defaultTime : specificDate
    );
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [textVisibility, setTextVisibility] = useState(
      defaultTime && defaultTime !== specificDate ? true : false
    );

    const handleTimeChange = (e: any, selectedDate?: Date) => {
      if (selectedDate) {
        setTime(selectedDate);
        if (Platform.OS === "android") {
          setPickerVisible(false);
        }
      }
    };

    // Use ref to expose the current time
    useImperativeHandle(ref, () => ({
      getTime: () => time,
      setTime: (newTime: Date) => {
        setTime(newTime);
        setTextVisibility(true);
        // newTime.getTime() === specificDate.getTime()
        //   ? setTextVisibility(false)
        //   : setTextVisibility(true);
      },
    }));

    const togglePicker = () => {
      setPickerVisible(!isPickerVisible);
      setTextVisibility(true);
    };

    const handleOutsideClick = () => {
      setPickerVisible(false);
    };

    return (
      <TouchableWithoutFeedback onPress={handleOutsideClick}>
        <View className={`w-3/4 mt-4`}>
          <Text className="ml-2">{text}</Text>

          <Pressable
            className="flex flex-row items-center justify-between w-full bg-defaultGray h-12 rounded-2xl text-center"
            onPress={togglePicker}
          >
            <Pressable>
              <Text
                className={`pl-3 text-sm font-light ${nextDay && textVisibility ? "" : "opacity-0"}`}
              >
                Sig. Día?
              </Text>
            </Pressable>

            <Text>
              {textVisibility
                ? time.toLocaleTimeString(undefined, options)
                : null}
            </Text>
            <TouchableNativeFeedback
              onPress={() => {
                setTime(specificDate);
                setTextVisibility(false);
                setPickerVisible(false);
              }}
            >
              <View
                style={{
                  opacity:
                    time.toTimeString() === specificDate.toTimeString() ? 0 : 1,
                }}
              >
                <Text className="text-defaultOrange pr-3">Quitar</Text>
              </View>
            </TouchableNativeFeedback>
          </Pressable>
          {isPickerVisible && (
            <View className="mt-2">
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display={Platform.OS === "android" ? "clock" : "spinner"}
                onChange={handleTimeChange}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
);

export default TimeSelect;
