import { View, Text, Modal, Pressable } from "react-native";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { colors } from "../../constants/colors";
import { CloseCircle, TrashIcon, WarningIcon } from "../Logos";
import { useAuth } from "../../app/context/AuthContext";
import BasicButton from "../BasicButton";
import BasicTextInput from "../BasicTextInput";
import { deleteUser } from "../../libs/user";

const UserDeleteModal = ({
  isVisible,
  setVisible,
  setBeforeModalVisible,
}: {
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  setBeforeModalVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const { onLogout, authState } = useAuth();
  const wordToCheck = authState?.user?.username ?? "cuenta";

  const DeleteText = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>(null);

  const DeleteAccount = async () => {
    if (DeleteText.current?.getValue() === wordToCheck) {
      if (authState?.user?.id) {
        const response = await deleteUser(authState.user.id);
        // console.log(response);
        if (response.status === 200) {
          onLogout;
          setVisible(false);
          setBeforeModalVisible(false);
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
          <Text className="font-bold text-3xl">Eliminar Cuenta</Text>
          <WarningIcon size={100} color="#cc0000" />
          <Text className="font-thin text-xl text-center">
            Una vez que eliminas tu cuenta se eliminaran tus datos cargados
          </Text>
          <Text className=" text-base text-center my-2">
            {`indroduce "${wordToCheck}" para eliminar la cuenta`}
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
            onPress={DeleteAccount}
          />
        </View>
      </View>
    </Modal>
  );
};

export default UserDeleteModal;
