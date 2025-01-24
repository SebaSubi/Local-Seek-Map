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
      value: string;
      textSecure?: boolean;
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
          className="w-full bg-[#e1e8e8] h-12 rounded-2xl text-center"
          onChangeText={handleChange}
          placeholder={placeholder}
          keyboardType={inputType === "number" ? "numeric" : "default"}
          secureTextEntry={textSecure}
        />
      </View>
    );
    // eslint-disable-next-line prettier/prettier
  }
);

export default BasicTextInput;
