// _LocalLayout.tsx

import React from "react";
import Header from "../../../components/Header";
import { Slot, Stack } from "expo-router";

export default function LocalLayout() {
  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header title="ABM Local" />,
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      <Slot />
    </>
  );
}
