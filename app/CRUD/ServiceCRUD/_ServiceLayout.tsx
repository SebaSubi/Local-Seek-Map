// _ServiceLayout.tsx
import React from "react";
import Header from "../../../components/Header";
import { Slot, Stack } from "expo-router";

export default function ServiceLayout() {
  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header title="ABM Service" />,
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      <Slot />
    </>
  );
}
