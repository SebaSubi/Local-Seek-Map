import { View, Text, Modal, Pressable } from "react-native";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { colors } from "../constants/colors";
import { CloseCircle, Eye, EyeOff, Save } from "./Logos";
import BasicButton from "./BasicButton";
import BasicTextInput from "./BasicTextInput";
import { checkEmail, checkUsername, EditUser } from "../libs/user";
import { validateEmail } from "./Register";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AuthUser, useAuth } from "../app/context/AuthContext";

const UserUpdateModal = ({
  isVisible,
  setVisible,
  user,
  onLogin,
}: {
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  user: AuthUser;
  onLogin: ((email: string, password: string) => Promise<any>) | undefined;
}) => {
  const email = useRef<{ getValue: () => string }>(null);
  const username = useRef<{ getValue: () => string }>(null);
  const password = useRef<{ getValue: () => string }>(null);
  const secondPassword = useRef<{ getValue: () => string }>(null);

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [seePassword, setSeePassword] = useState(true);

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
            height: "65%",
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
          <Text className="font-bold text-2xl">Editar Perfil</Text>
          <View className="flex ml-10 w-full">
            <View className="w-10/12 flex items-start ml-4 mt-2 h-4">
              {emailError === "" ? null : (
                <Text className="text-red-800">{emailError}</Text>
              )}
            </View>
            <View className="w-96 flex">
              <BasicTextInput
                inputType="text"
                placeholder="Email"
                title="Email: "
                textStyle="mt-2"
                value={user.email}
                ref={email}
              />
              <View
                className={`w-[70%] flex items-start ml-4 mt-1 ${usernameError ? "h-8" : "h-4"}`}
              >
                {usernameError === "" ? null : (
                  <Text className="text-red-800">{usernameError}</Text>
                )}
              </View>
              <BasicTextInput
                inputType="text"
                placeholder="Nombre de Usuario"
                title="Nombre de Usuario: "
                textStyle="mt-1"
                value={user.username}
                ref={username}
              />
            </View>
            <View className="w-full flex items-start ml-4 mt-2 h-4">
              {passwordError === "" ? null : (
                <Text className="text-red-800">{passwordError}</Text>
              )}
            </View>
            <View className="flex flex-row">
              <BasicTextInput
                inputType="text"
                placeholder="Contraseña"
                title="Contraseña: "
                textStyle=""
                value={user.password}
                ref={password}
                textSecure={seePassword}
              />
              <Pressable
                className="mt-9 ml-5"
                onPress={() => setSeePassword(!seePassword)}
              >
                {seePassword ? <EyeOff /> : <Eye />}
              </Pressable>
            </View>
            <View className="flex flex-row">
              <BasicTextInput
                inputType="text"
                placeholder="Contraseña"
                title="Repetir Contraseña: "
                textStyle="mt-2"
                value={user.password}
                ref={secondPassword}
                textSecure={seePassword}
              />
              <Pressable
                className="mt-11 ml-5"
                onPress={() => {
                  setSeePassword(!seePassword);
                  setVisible(false);
                }}
              >
                {seePassword ? <EyeOff /> : <Eye />}
              </Pressable>
            </View>
          </View>
          <View className={`justify-end ${usernameError ? "mt-8" : "mt-12"}`}>
            <BasicButton
              text="Guardar"
              background={colors.primary.blue}
              textStyle="text-white"
              logo={<Save color={colors.primary.blue} />}
              onPress={() =>
                handleUserChange(
                  email,
                  username,
                  password,
                  secondPassword,
                  setEmailError,
                  setPasswordError,
                  setUsernameError,
                  user,
                  // eslint-disable-next-line prettier/prettier
                  onLogin
                )
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const handleUserChange = async (
  email: React.RefObject<{
    getValue: () => string;
  }>,
  username: React.RefObject<{
    getValue: () => string;
  }>,
  password: React.RefObject<{
    getValue: () => string;
  }>,
  secondPassword: React.RefObject<{
    getValue: () => string;
  }>,
  setEmailError: React.Dispatch<React.SetStateAction<string>>,
  setPasswordError: React.Dispatch<React.SetStateAction<string>>,
  setUsernameError: React.Dispatch<React.SetStateAction<string>>,
  user: AuthUser,
  // eslint-disable-next-line prettier/prettier
  onLogin: any
) => {
  const validEmail = email.current?.getValue()
    ? await checkEmail(email.current?.getValue() ?? "")
    : true;
  const validUsername = username.current?.getValue()
    ? await checkUsername(username.current?.getValue() ?? "")
    : true;
  if (!validateEmail(email.current?.getValue() ?? "")) {
    //handle wrong email format
    setEmailError("La direccion de email no es valida");
    setPasswordError("");
    setUsernameError("");
  } else if ((username.current?.getValue().length ?? 0) < 2) {
    //handle no Username
    setPasswordError("");
    setEmailError("");
    setUsernameError("El nombre de usuario debe tener al menos 2 caracteres");
  } else if ((password.current?.getValue().length ?? 0) < 8) {
    //handle no first Password
    setPasswordError("La contraseña debe tener al menos 8 caracteres");
    setEmailError("");
    setUsernameError("");
  } else if ((secondPassword.current?.getValue().length ?? 0) < 8) {
    //handle no second Password
    setPasswordError("La contraseña debe tener al menos 8 caracteres");
    setEmailError("");
    setUsernameError("");
  } else if (
    secondPassword.current?.getValue() !== password.current?.getValue()
  ) {
    setPasswordError("Las contraseñas no coinciden");
    setEmailError("");
    setUsernameError("");
  } else if (
    email.current?.getValue() !== user.email &&
    (validEmail === true || validEmail.request.response === "true")
  ) {
    //handle email already in use
    setPasswordError("");
    setEmailError("Este Email ya tiene una cuenta asociada");
    //   setEmailError("hoy me levante re loco");
    setUsernameError("");
  } else if (
    username.current?.getValue() !== user.username &&
    (validUsername === true || validUsername.request.response === "true")
  ) {
    //handle username already in use
    setPasswordError("");
    setEmailError("");
    setUsernameError("Este Nombre de Usuario no esta disponible");
  } else if ((email.current?.getValue().length ?? 0) >= 250) {
    //handle
    setPasswordError("");
    setEmailError("El Email es demasiado largo");
    setUsernameError("");
  } else if ((username.current?.getValue().length ?? 0) >= 30) {
    //handle
    setPasswordError("");
    setEmailError("");
    setUsernameError("El nombre del usuario es muy largo");
  } else if ((password.current?.getValue().length ?? 0) >= 20) {
    //handle
    setPasswordError("La contraseña es demasiado larga");
    setEmailError("");
    setUsernameError("");
  } else {
    console.log("Making Changes"); //FIXME: we have to put the method than changes the User
    const editUser = async () => {
      if (
        email.current !== null &&
        username.current !== null &&
        password.current !== null
      ) {
        await EditUser({
          id: user.id,
          email: email.current.getValue(),
          username: username.current.getValue(),
          password: password.current.getValue(),
        });
        onLogin!(email.current.getValue(), password.current.getValue());
        // console.log(
        //   email.current.getValue(),
        //   username.current.getValue(),
        //   password.current.getValue()
        // );
      } else {
        setPasswordError("Los campos no deben estar vacios");
        setEmailError("Los campos no deben estar vacios");
        setUsernameError("Los campos no deben estar vacios");
      }
    };
    editUser();
  }
};

export default UserUpdateModal;
