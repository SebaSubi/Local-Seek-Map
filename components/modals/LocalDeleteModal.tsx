import { View, Text, Modal, Pressable } from "react-native";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { colors } from "../../constants/colors";
import { CloseCircle, TrashIcon, WarningIcon } from "../Logos";
import { useAuth } from "../../app/context/AuthContext";
import BasicButton from "../BasicButton";
import BasicTextInput from "../BasicTextInput";
import { useLocalIdStore } from "../../libs/localZustang";
import { deleteLocalv2 } from "../../libs/local";
import { useNavigation } from "expo-router";

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

  const navigation = useNavigation();

  const DeleteLocal = async () => {
    if (DeleteText.current?.getValue() === wordToCheck) {
      if (authState?.user?.id && local.id) {
        const response = await deleteLocalv2(local.id, authState.user.id);
        console.log(response);
        if (response?.status === 200) {
          setVisible(false);
          navigation.goBack();
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
            height: "48%",
            backgroundColor: colors.primary.white,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: colors.primary.blue,
            justifyContent: "flex-start",
            alignItems: "center",
            padding: 5,
          }}
        >
          <View className="w-full items-end">
            <Pressable onPress={() => setVisible(false)} className="mt-1 mr-1">
              <CloseCircle color="#cc0000" />
            </Pressable>
          </View>
          <Text className="font-bold text-3xl">Eliminar Local</Text>
          <WarningIcon size={100} color="#cc0000" />
          <Text className="font-thin text-xl text-center">
            Una vez que eliminas tu local no se podra volver a recuperar
          </Text>
          <Text className=" text-base text-center my-2">
            {`indroduce "${wordToCheck}" para eliminar el local`}
          </Text>
          <BasicTextInput
            inputType="text"
            placeholder={wordToCheck}
            ref={DeleteText}
          />
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
        </View>
      </View>
    </Modal>
  );
};
export default LocalDeleteModal;
