import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Text, TextInput, View } from "react-native";

const BasicTextInput = forwardRef(
  (
    {
      placeholder,
      inputType,
      title,
      textStyle,
    }: {
      placeholder: string;
      inputType: "text" | "number";
      title?: string;
      textStyle?: string;
    },
    ref,
  ) => {
    const [value, setValue] = useState(""); // Use local state to track value

    const handleChange = (input: string) => {
      if (inputType === "number") {
        if (/^\d*$/.test(input)) {
          // Only allow numbers for 'number' inputType
          setValue(input);
        }
      } else {
        setValue(input); // Allow text input
      }
    };

    // Expose `getValue()` via ref, which returns the current input value
    useImperativeHandle(ref, () => ({
      getValue: () => value,
    }));

    return (
      <View className="w-3/4">
        {title && <Text className={`ml-2 mb-1 ${textStyle}`}>{title}</Text>}
        <TextInput
          className="w-full bg-[#e1e8e8] h-12 rounded-2xl text-center"
          onChangeText={handleChange} // Set local state on change
          value={value} // Use the local value state
          placeholder={placeholder}
          keyboardType={inputType === "number" ? "numeric" : "default"}
        />
      </View>
    );
  },
);

export default BasicTextInput;
