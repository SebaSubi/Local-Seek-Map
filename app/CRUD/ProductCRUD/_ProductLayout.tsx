// _ProductLayout.tsx

import React from "react";
import Header from "../../../components/Header";
import { Slot, Stack } from "expo-router";

export default function ProductLayout() {
  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header title="ABM Product" />,
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      <Slot />
    </>
  );
}
