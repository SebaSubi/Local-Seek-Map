import { useEffect, useState } from "react";
import { TextInput, StyleSheet } from "react-native";

export default function BasicSearchButton({
  placeholder,
  className,
}: {
  placeholder: string;
  className?: any;
}) {
  const [text, setText] = useState("");

  useEffect(() => {
    //Logic for submitting text
  }, [text]);

  console.log(className);

  return (
    <TextInput
      className="w-3/4 bg-[#e1e8e8] h-12 rounded-2xl text-center mt-2"
      style={StyleSheet.flatten([className])}
      onChangeText={(text) => setText(text)}
      value={text}
      placeholder={placeholder}
    />
  );
}
