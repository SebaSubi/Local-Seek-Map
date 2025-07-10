import { View, Text, Pressable, Modal, FlatList } from "react-native";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CloseCircle,
  Eye,
  EyeOff,
  ReloadIcon,
  Save,
  TrashIcon,
  WarningIcon,
} from "../Logos";
import { Picker } from "@react-native-picker/picker";
import { colors } from "../../constants/colors";
import { DysplayUser, Local } from "../../schema/GeneralSchema";
import UserDeleteModal from "./UserDeleteModal";
import BasicTextInput from "../BasicTextInput";
import BasicButton from "../BasicButton";
import { AuthUser, Role, useAuth } from "../../app/context/AuthContext";
import {
  checkEmail,
  checkUsername,
  EditUser,
  EditUserAdmin,
  getUserLocals,
} from "../../libs/user";
import { validateEmail } from "../Register";
import EditLocalContainer from "../EditLocalContainer";

const UserInfoModal = ({
  isVisible,
  setVisible,
  user,
}: {
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  user: DysplayUser;
}) => {
  useEffect(() => {
    fetchData();
  }, [user]);

  const { onLogin } = useAuth();

  const email = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>(null);
  const username = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>(null);
  const password = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>(null);
  const secondPassword = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>(null);

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [seePassword, setSeePassword] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role>(
    user.role === "ADMIN"
      ? Role.ADMIN
      : user.role === "STORE_OWNER"
        ? Role.STOREOWNER
        : Role.USER
  );

  const [seeDeleteModal, setSeeDeleteModal] = useState(false);

  const [editType, setEditType] = useState<"user" | "local">("user");

  const [locals, setLocals] = useState<Local[]>([]);

  const fetchData = async () => {
    const fetchedLocals = await getUserLocals(user.email);
    // console.log(fetchedLocals);

    if (Array.isArray(fetchedLocals)) {
      setLocals(fetchedLocals);
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
            height: "75%",
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
          <View className="flex-row justify-evenly w-11/12">
            <BasicButton
              text="Usuario"
              background={
                editType === "user"
                  ? colors.primary.blue
                  : colors.primary.lightGray
              }
              textStyle={`text-${
                editType === "user" ? `white` : `black`
              } font-bold`}
              style="w-24"
              onPress={() => setEditType("user")}
            />
            <BasicButton
              text="Locales"
              background={
                editType === "local"
                  ? colors.primary.blue
                  : colors.primary.lightGray
              }
              textStyle={`text-${
                editType === "local" ? `white` : `black`
              } font-bold`}
              style="w-24"
              onPress={() => setEditType("local")}
            />
          </View>
          {editType === "user" ? (
            <>
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
                    value={user.name}
                    ref={username}
                  />
                </View>
                <View className="w-10/12 flex items-start ml-4 mt-2 h-8 justify-end">
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
                    value={""}
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
                    value={""}
                    ref={secondPassword}
                    textSecure={seePassword}
                  />
                  <Pressable
                    className="mt-11 ml-5"
                    onPress={() => {
                      setSeePassword(!seePassword);
                    }}
                  >
                    {seePassword ? <EyeOff /> : <Eye />}
                  </Pressable>
                </View>
              </View>
              <View
                className={`justify-end ${usernameError ? "mt-2" : "mt-6"} items-center w-full`}
              >
                <View className="w-full flex-row justify-start items-start">
                  <Text className="ml-7 mb-1 text-sm font-light">Rol:</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    width: 200,
                    height: 55,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.primary.lightGray,
                    borderRadius: 100,
                    marginBottom: 8,
                  }}
                >
                  <Picker
                    selectedValue={selectedRole}
                    onValueChange={(itemValue, itemIndex) =>
                      setSelectedRole(itemValue)
                    }
                    mode="dropdown"
                    style={{
                      display: "flex",
                      width: 170,
                      height: 50,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: colors.primary.lightGray,
                      borderRadius: 100,
                    }}
                  >
                    <Picker.Item label="User" value={Role.USER} />
                    <Picker.Item label="Store Owner" value={Role.STOREOWNER} />
                    <Picker.Item label="Admin" value={Role.ADMIN} />
                  </Picker>
                </View>
                <BasicButton
                  text="Guardar"
                  background={colors.primary.blue}
                  textStyle="text-white"
                  logo={
                    <View className="flex pl-2">
                      <Save color="#fff" />
                    </View>
                  }
                  style="w-28 justify-evenly"
                  onPress={async () => {
                    const userEditPetition = await handleUserChange(
                      email,
                      username,
                      password,
                      secondPassword,
                      setEmailError,
                      setPasswordError,
                      setUsernameError,
                      user,
                      selectedRole,
                      // eslint-disable-next-line prettier/prettier
                      onLogin
                    );
                    userEditPetition === 200 ? setVisible(false) : "";
                  }}
                />
                <Pressable
                  className="flex justify-center flex-row items-center mt-4"
                  onPress={() => {
                    setSeeDeleteModal(true);
                  }}
                >
                  <Text className="text-sm pr-1" style={{ color: "#cc0000" }}>
                    Eliminar Cuenta
                  </Text>
                  <TrashIcon size={20} color="#cc0000" />
                </Pressable>
                <UserDeleteModal
                  isVisible={seeDeleteModal}
                  setVisible={setSeeDeleteModal}
                  setBeforeModalVisible={setVisible}
                  userId={user.id}
                />
              </View>
            </>
          ) : (
            <>
              <View className="flex p-2 mt-2">
                {user.localUser.length === 0 ? (
                  <View className="flex items-center justify-center h-5/6">
                    <WarningIcon size={100} color={colors.primary.orange} />
                    <Text className="font-thin text-xl text-center">
                      {" "}
                      Este usuario no tiene locales
                    </Text>
                  </View>
                ) : (
                  <>
                    {locals.length !== 0 ? (
                      <View className="w-full h-72 mt-4">
                        <FlatList
                          data={locals}
                          horizontal={false}
                          numColumns={2}
                          renderItem={({ item }) => (
                            <EditLocalContainer local={item} />
                          )}
                          keyExtractor={(item) => item?.id!}
                          onRefresh={() => fetchData()}
                          // refreshing={loading}
                          refreshing={false}
                        />
                      </View>
                    ) : null}

                    <View className="flex justify-center items-center">
                      <BasicButton
                        text="Recargar"
                        background={colors.primary.blue}
                        textStyle="text-white font-bold ml-2"
                        logo={<ReloadIcon color="#fff" />}
                        style="w-28 pl-2 "
                        onPress={() => fetchData()}
                      />
                    </View>
                  </>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export const handleUserChange = async (
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
  user: DysplayUser,
  SelectedRole: string,
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
  } else if (
    (password.current?.getValue().length ?? 0) < 8 &&
    (password.current?.getValue().length ?? 0) !== 0
  ) {
    //handle no first Password
    setPasswordError("La contraseña debe tener al menos 8 caracteres");
    setEmailError("");
    setUsernameError("");
  } else if (
    (secondPassword.current?.getValue().length ?? 0) > 64 ||
    (password.current?.getValue().length ?? 0) > 64
  ) {
    setPasswordError("La contraseña no debe tener mas de 64 caracteres.");
    setEmailError("");
    setUsernameError("");
  } else if (
    (secondPassword.current?.getValue().length ?? 0) < 8 &&
    (secondPassword.current?.getValue().length ?? 0) !== 0
  ) {
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
    (validEmail === true || validEmail === "true")
  ) {
    //handle email already in use
    setPasswordError("");
    setEmailError("Este Email ya tiene una cuenta asociada");
    setUsernameError("");
  } else if (
    username.current?.getValue() !== user.name &&
    (validUsername === true || validUsername === "true")
  ) {
    //handle username already in use
    setPasswordError("");
    setEmailError("");
    setUsernameError("Este Nombre de Usuario no esta disponible");
  } else if ((email.current?.getValue().length ?? 0) >= 250) {
    //handle email too long
    setPasswordError("");
    setEmailError("El Email es demasiado largo");
    setUsernameError("");
  } else if ((username.current?.getValue().length ?? 0) >= 30) {
    //handle username too long
    setPasswordError("");
    setEmailError("");
    setUsernameError("El nombre del usuario es muy largo");
  } else if ((password.current?.getValue().length ?? 0) >= 20) {
    //handle password too long
    setPasswordError("La contraseña es demasiado larga");
    setEmailError("");
    setUsernameError("");
  } else {
    const editUser = async () => {
      if (
        email.current !== null &&
        username.current !== null &&
        password.current !== null
      ) {
        const petition = await EditUserAdmin({
          id: user.id,
          email: email.current.getValue(),
          username: username.current.getValue(),
          password: password.current.getValue(),
          role: SelectedRole,
        });
        console.log(petition.status);
        if (petition.status === 200) {
          onLogin!(email.current.getValue(), password.current.getValue());
          return 200;
        } else {
          setEmailError("Error, intente mas tarde nuevamente");
        }
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
    return await editUser();
  }
};

export default UserInfoModal;
