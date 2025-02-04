import React, { useState, forwardRef, useImperativeHandle } from "react";
import { View, Text, Pressable, TouchableWithoutFeedback } from "react-native";
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
}

const TimeSelect = forwardRef((props: TimeSelectProps, ref) => {
  const [time, setTime] = useState(specificDate);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [textVisibility, setTextVisibility] = useState(false);

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
        <Text className="ml-2">{props.text}</Text>

        <Pressable
          className="flex items-center justify-center w-full bg-defaultGray h-12 rounded-2xl text-center"
          onPress={togglePicker}
        >
          <Text>
            {textVisibility
              ? time.toLocaleTimeString(undefined, options)
              : null}
          </Text>
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
});

export default TimeSelect;
