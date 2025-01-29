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
    }: {
      placeholder: string;
      inputType: "text" | "number";
      title?: string;
      textStyle?: string;
      value: string;
    },
    ref: React.ForwardedRef<{ getValue: () => string }>
  ) => {
    const [text, setText] = useState(value);

    const handleChange = (input: string) => {
      if (inputType === "number" && !/^\d*$/.test(input)) return;
      setText(input);
      if (inputType === "number" && !/^\d*$/.test(input)) return;
      setText(input);
    };

    useImperativeHandle(ref, () => ({
      getValue: () => text,
    }));
    useImperativeHandle(ref, () => ({
      getValue: () => text,
    }));

    return (
      <View className="w-3/4">
        {title && <Text className={`ml-2 mb-1 ${textStyle}`}>{title}</Text>}
        <TextInput
          value={text}
          className="w-full bg-[#f8f8f8] h-24 rounded-2xl text-center p-2"
          onChangeText={handleChange}
          placeholder={placeholder}
          keyboardType={inputType === "number" ? "numeric" : "default"}
          multiline={true}
        />
      </View>
    );
    // eslint-disable-next-line prettier/prettier
  }
);

export default BigTextInput;
