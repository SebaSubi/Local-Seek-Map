import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Text, TextInput, View } from "react-native";


const BasicTextInput = forwardRef(({
  placeholder,
  submitText,
  inputType,
  title,
  textStyle,
  defaultValue = "",
}: {
  placeholder: string;
  submitText: boolean;
  inputType: "text" | "number";
  title?: string;
  textStyle?: string;
  defaultValue?: string
}, ref) => {
  const [text, setText] = useState("");
  useEffect(() => {
    setText(defaultValue)
  }, [defaultValue])

  function handleChange(input: string) {
    if (inputType === "number") {
      if (/^\d*$/.test(input)) {
        setText(input);
      }
    } else {
      setText(input);
    }
  }


  useImperativeHandle(ref, () => ({
    getValue: () => text,
  }));

  return (
    <View className="w-3/4">
      {title && <Text className={`ml-2 mb-1 ${textStyle}`}>{title}</Text>}
      <TextInput
        className="w-full bg-[#e1e8e8] h-12 rounded-2xl text-center"
        onChangeText={handleChange}
        value={text}
        placeholder={placeholder}
        keyboardType={inputType === "number" ? "numeric" : "default"}
      />
    </View>
  );
});

export default BasicTextInput;
