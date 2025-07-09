import { View, Text, Modal, Pressable } from "react-native";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { colors } from "../../constants/colors";
import { CloseCircle, TrashIcon, WarningIcon } from "../Logos";
import { useAuth } from "../../app/context/AuthContext";
import BasicButton from "../BasicButton";
import BasicTextInput from "../BasicTextInput";
import { deleteUser } from "../../libs/user";
import { useLocalIdStore } from "../../libs/localZustang";
import { deleteLocalv2 } from "../../libs/local";

const LocalDeleteModal = ({
  isVisible,
  setVisible,
}: {
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const { authState } = useAuth();
  const local = useLocalIdStore((state) => state.local);
  const wordToCheck = local.name ?? "Borrar Local";

  const DeleteText = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>(null);

  const DeleteLocal = async () => {
    if (DeleteText.current?.getValue() === wordToCheck) {
      if (authState?.user?.id && local.id) {
        const response = await deleteLocalv2(local.id, authState.user.id);
        console.log(response);
        if (response?.status === 200) {
          setVisible(false);
          //   onLogout; FIXME: en vez de logout que recargue la parte de user
        }
      }
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      //   onRequestClose={() => setIsModalVisible(false)}
    >
      <View //this view exists because when you set a modal to visible, it ocupies the whole screen, and here its when it needs to be centered, also it needs to be made by styles
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semi-transparente
        }}
      >
        <View
          style={{
            width: "80%",
            height: "auto",
            backgroundColor: colors.primary.white,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            padding: 5,
          }}
        >
          <View className="w-full items-end"></View>
          <Text className="font-normal text-2xl">Eliminar Local</Text>
          <Text className="font-extralight text-lg text-center">
            Una vez que eliminas tu local no se podra volver a recuperar.{" "}
            {`Indroduce "${wordToCheck}" para eliminar el local`}
          </Text>

          <BasicTextInput
            inputType="text"
            placeholder={wordToCheck}
            ref={DeleteText}
          />
          <View className="w-full h-fit flex flex-row items-center justify-evenly mb-2">
            <BasicButton
              text="Eliminar"
              background="#cc0000"
              textStyle="text-white"
              style="mt-4"
              logo={
                <View className="flex px-2">
                  <TrashIcon color="#fff" size={21} />
                </View>
              }
              onPress={DeleteLocal}
            />
            <BasicButton
              text="Cancelar"
              background={colors.primary.lightGray}
              textStyle={`text-${colors.primary.blue}`}
              style="mt-4"
              onPress={() => setVisible(false)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default LocalDeleteModal;
