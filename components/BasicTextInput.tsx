import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Text, TextInput, View } from "react-native";

const BasicTextInput = forwardRef(({
  placeholder,
  submitText,
  inputType,
  title,
  textStyle,
  value, 
  onChangeText, 
}: {
  placeholder: string;
  submitText: boolean;
  inputType: "text" | "number";
  title?: string;
  textStyle?: string;
  value: string; 
  onChangeText: (text: string) => void; 
}, ref) => {
  const handleChange = (input: string) => {
    if (inputType === "number") {
      if (/^\d*$/.test(input)) {
        onChangeText(input); 
      }
    } else {
      onChangeText(input); 
    }
  };

  useImperativeHandle(ref, () => ({
    getValue: () => value, 
  }));

  return (
    <View className="w-3/4">
      {title && <Text className={`ml-2 mb-1 ${textStyle}`}>{title}</Text>}
      <TextInput
        className="w-full bg-[#e1e8e8] h-12 rounded-2xl text-center"
        onChangeText={handleChange}
        value={value} 
        placeholder={placeholder}
        keyboardType={inputType === "number" ? "numeric" : "default"}
      />
    </View>
  );
});

export default BasicTextInput;
