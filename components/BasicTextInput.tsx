import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Text, TextInput, View } from "react-native";

const BasicTextInput = forwardRef(
  (
    {
      placeholder,
      inputType,
      title,
      textStyle,
      value,
      textSecure = false,
    }: {
      placeholder: string;
      inputType: "text" | "number";
      title?: string;
      textStyle?: string;
      value?: string;
      textSecure?: boolean;
    },
    ref: React.ForwardedRef<{
      getValue: () => string;
      setValue: (value: string) => void;
    }>
  ) => {
    const [text, setText] = useState("");

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
        {title && <Text className={`ml-2 mb-1 ${textStyle}`}>{title}</Text>}
        <TextInput
          value={text}
          multiline={false}
          numberOfLines={1}
          className="w-full bg-[#f8f8f8] h-11 rounded-2xl px-2"
          onChangeText={handleChange}
          placeholder={placeholder}
          keyboardType={inputType === "number" ? "numeric" : "default"}
          secureTextEntry={textSecure}
          style={{ overflow: "hidden" }}
        />
      </View>
    );
  }
);

export default BasicTextInput;
