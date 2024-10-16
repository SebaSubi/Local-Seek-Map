import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Text, TextInput, View } from "react-native";

// forwardRef allows you to pass a ref from the parent to the child
const BasicTextInput = forwardRef(
  (
    {
      placeholder,
      inputType,
      title,
      textStyle,
      containerStyle,
      defaultValue = " ",
    }: {
      placeholder: string;
      inputType: "text" | "number";
      title?: string;
      textStyle?: string;
      containerStyle?: string;
      defaultValue?: string;
    },
    ref, // This ref will come from the parent component
  ) => {
    const [text, setText] = useState(defaultValue);
    useEffect(() => {
      if (defaultValue !== " ") {
        setText(defaultValue);
      }
    }, [defaultValue]);

    // This hook allows the parent component to access functions or values inside the child
    useImperativeHandle(ref, () => ({
      getValue: () => text, // Expose a "getValue" method to the parent
    }));

    function handleChange(input: string) {
      if (inputType === "number") {
        if (/^\d*$/.test(input)) {
          setText(input);
        }
      } else {
        setText(input);
      }
    }

    return (
      <View className={`w-3/4 ${containerStyle}`}>
        {title && <Text className={`ml-2 mb-1 ${textStyle}`}>{title}</Text>}
        <TextInput
          className="w-full bg-[#e1e8e8] h-12 rounded-2xl text-center opacity-15"
          onChangeText={handleChange}
          value={text}
          placeholder={placeholder}
          keyboardType={inputType === "number" ? "numeric" : "default"}
        />
      </View>
    );
  },
);

export default BasicTextInput;
