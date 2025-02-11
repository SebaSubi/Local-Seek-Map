import { View, Text, Modal } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { colors } from "../../constants/colors";
import { EmailIcon } from "../Logos";
import BasicButton from "../BasicButton";

const UserEmailRegisterModal = ({
  isVisible,
  setVisible,
}: {
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
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
            height: "52%",
            backgroundColor: "#f8f8f8",
            borderRadius: 20,
            // borderWidth: 2,
            // borderColor: colors.primary.blue,
            justifyContent: "flex-start",
            alignItems: "center",
            padding: 5,
          }}
        >
          <View className="flex-1 h-full w-full items-center p-3">
            <Text className="font-bold text-3xl text-defaultBlue">
              Verificar Cuenta
            </Text>
            <EmailIcon size={120} color={colors.primary.orange} />
            <Text
              className="font-thin text-xl text-center mt-2"
              style={{ color: colors.secondary.black }}
            >
              {`Abre el correo electronico que ingresaste y verifica tu cuenta clieckeando en el boton de "Activar Cuenta". Una vez apretado el boton inicie sesion con su cuenta ya activada`}
            </Text>
            <Text
              className="font-thin text-sm text-center mt-2"
              style={{ color: colors.secondary.black }}
            >
              {" "}
              Tiene 20 minutos para confirmar su cuenta
            </Text>
            <BasicButton
              text="Aceptar"
              background={colors.primary.blue}
              textStyle="text-white font-bold p-1 text-base"
              style="mt-4 h-11"
              onPress={() => setVisible(false)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UserEmailRegisterModal;
