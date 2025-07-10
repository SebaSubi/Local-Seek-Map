import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Text, TextInput, View } from "react-native";

const BigTextInput = forwardRef(
  (
    {
      placeholder,
      inputType,
      title,
      textStyle,
      value,
      maxLength,
    }: {
      placeholder: string;
      inputType: "text" | "number";
      title?: string;
      textStyle?: string;
      value: string;
      maxLength?: number;
    },
    ref: React.ForwardedRef<{
      getValue: () => string;
      setValue: (newValue: string) => void;
    }>
  ) => {
    const [text, setText] = useState(value);

    const handleChange = (input: string) => {
      if (inputType === "number" && !/^\d*$/.test(input)) return;
      setText(input);
    };

    useImperativeHandle(ref, () => ({
      getValue: () => text,
      setValue: (newValue: string) => setText(newValue), // ✅ Now you can update it externally
    }));

    return (
      <View className="w-3/4">
        {title && (
          <Text className={`ml-2 mb-1 text-sm font-light ${textStyle}`}>
            {title}
          </Text>
        )}
        <TextInput
          value={text}
          className="w-full bg-[#f8f8f8] h-24 rounded-2xl text-center p-2 font-light"
          onChangeText={handleChange}
          placeholder={placeholder}
          keyboardType={inputType === "number" ? "numeric" : "default"}
          multiline={true}
          maxLength={maxLength}
        />
      </View>
    );
  }
);

export default BigTextInput;
