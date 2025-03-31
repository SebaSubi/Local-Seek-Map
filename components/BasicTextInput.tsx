import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { InfoIcon } from "./Logos";

const BasicTextInput = forwardRef(
  (
    {
      placeholder,
      inputType,
      title,
      textStyle,
      value,
      textSecure = false,
      info,
      infoPress,
    }: {
      placeholder: string;
      inputType: "text" | "number";
      title?: string;
      textStyle?: string;
      value?: string;
      textSecure?: boolean;
      info?: boolean;
      infoPress?: () => void;
    },
    ref: React.ForwardedRef<{
      getValue: () => string;
      setValue: (value: string) => void;
    }>
  ) => {
    const [text, setText] = useState(value ? value : "");

    const handleChange = (input: string) => {
      if (inputType === "number" && !/^\d*$/.test(input)) return;
      setText(input);
    };

    useImperativeHandle(ref, () => ({
      getValue: () => text,
      setValue: (newValue: string) => setText(newValue),
    }));

    return (
      <View className="w-3/4">
        {title && (
          <Text className={`ml-2 mb-1 text-sm font-light ${textStyle}`}>
            {title}
          </Text>
        )}
        <View className="flex flex-row items-center">
          <TextInput
            value={text}
            multiline={false}
            numberOfLines={1}
            className="w-full bg-[#f8f8f8] h-11 rounded-2xl p-2 font-light"
            onChangeText={handleChange}
            placeholder={placeholder}
            keyboardType={inputType === "number" ? "numeric" : "default"}
            secureTextEntry={textSecure}
            style={{ overflow: "hidden" }}
          />
          {info && (
            <Pressable className="ml-1" onPress={infoPress}>
              <InfoIcon color="black" size={22} />
            </Pressable>
          )}
        </View>
      </View>
    );
  }
);

export default BasicTextInput;
