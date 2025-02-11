import { View, Text, Modal, Pressable } from "react-native";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { colors } from "../../constants/colors";
import {
  CircleCheckIcon,
  ClockLogo,
  CloseCircle,
  CreateLogo,
  StoreIcon,
} from "../Logos";
import BasicButton from "../BasicButton";
import { Role, useAuth } from "../../app/context/AuthContext";
import BasicTextInput from "../BasicTextInput";
import { validateEmail } from "../Register";
import { getStoreOwnerRequests, requestStoreOwner } from "../../libs/user";
import { Link } from "expo-router";
import BasicSelectable from "../BasicSelectable";

const UserPermissionModal = ({
  isVisible,
  setVisible,
}: {
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const { authState } = useAuth();
  //   console.log(authState?.user?.role);

  const email = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  }>(null);
  const [emailError, setEmailError] = useState(false);
  const [canRequest, setCanRequest] = useState(true);

  useEffect(() => {
    getOwnerRequests();
  }, [authState, isVisible]);

  const getOwnerRequests = async () => {
    if (authState?.user?.id) {
      const request = await getStoreOwnerRequests(authState.user.id);
      //   console.log(typeof request.status);
      if (request.status === 200) {
        const lastOwnerRequest = request.data.ownerRequest;
        // console.log(request.data.ownerRequest);
        if (lastOwnerRequest !== null) {
          if (Date.now() - new Date(lastOwnerRequest).getTime() <= 5259600000) {
            //this is about 2 months
            // console.log("aaaaaaaaaaaaaaaaaaaaaa Nooooooooooo flacooooooooooo");
            setCanRequest(false);
          }
        } else {
          setCanRequest(true);
        }
      }
    }
  };

  const handlePermisionRequest = async () => {
    if (canRequest) {
      if (
        email.current?.getValue() === "" ||
        validateEmail(email.current?.getValue() ? email.current.getValue() : "")
      ) {
        if (authState?.user?.id) {
          await requestStoreOwner(
            authState.user.email,
            email.current!.getValue(),
            authState.user.id
          );
          setCanRequest(false);
        }
        setEmailError(false);
        setVisible(false);
      } else {
        setEmailError(true);
      }
    }
  };
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View
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
            backgroundColor: "#fff",
            borderRadius: 20,
            // borderWidth: 2,
            // borderColor: colors.primary.blue,
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
          <View className="flex-1 h-full w-full items-center px-3">
            <Text className="font-bold text-3xl text-defaultBlue mb-2">
              Registrar Mi Local
            </Text>
            <StoreIcon size={100} color={colors.primary.orange} />
            {authState?.user?.role !== Role.USER ? (
              <>
                <Text
                  className="font-thin text-xl text-center mt-4"
                  style={{ color: colors.secondary.black }}
                >
                  {`Ya estas registrado como dueño de local. para crear tu local has click en el boton de abajo`}
                </Text>
                <View className="p-2">
                  <CircleCheckIcon size={100} color={colors.primary.blue} />
                </View>
                <Text
                  className="font-thin text-sm text-center mt-2"
                  style={{ color: colors.secondary.black }}
                >
                  recuerda no crear mas de 1 vez un mismo local o podrias
                  encontrarte en problemas
                </Text>
                <Link
                  className="mt-8"
                  asChild
                  href={{ pathname: "/CRUD/LocalCRUD/CreateLocal" }}
                >
                  <Pressable
                    className="flex flex-row items-center rounded-full h-10"
                    style={{ backgroundColor: colors.primary.blue }}
                  >
                    <View className="ml-2 bg-white rounded-full mr-1">
                      <CreateLogo />
                    </View>
                    <Text className="text-white font-bold p-1 text-base mr-2">
                      Crear Local
                    </Text>
                  </Pressable>
                </Link>
              </>
            ) : canRequest ? (
              <>
                <Text
                  className="font-thin text-xl text-center mt-2"
                  style={{ color: colors.secondary.black }}
                >
                  {`Para que se puede registrar tu local, se tiene que verificar que eres el dueño de un local. Para esto nos pondremos en contacto por medio de la direccion de correo electronico asociada a tu usuario`}
                </Text>
                <Text
                  className="font-thin text-sm text-center mt-2"
                  style={{ color: colors.secondary.black }}
                >
                  Si no quiere utilizar la direccion predeterminada puede
                  proporcionar otra
                </Text>
                <Text className=" text-sm text-center mb-1 text-red-500">
                  {emailError ? "Direccion de Email no valida" : ""}
                </Text>
                <BasicTextInput
                  inputType="text"
                  placeholder="Email (opcional)"
                  textStyle="w-full"
                  ref={email}
                />
                <BasicButton
                  text="Solicitar Registro"
                  background={colors.primary.blue}
                  textStyle="text-white font-bold p-1 text-base"
                  style="mt-4 h-11"
                  onPress={handlePermisionRequest}
                />
              </>
            ) : (
              <>
                <Text
                  className="font-thin text-xl text-center mt-4"
                  style={{ color: colors.secondary.black }}
                >
                  {`¡Ya tenemos tu peticion para ser dueño de local!`}
                </Text>

                <Text
                  className="font-thin text-xl text-center mt-2"
                  style={{ color: colors.secondary.black }}
                >
                  {`Ahora solo queda relajarse y esperar a que se tramite tu solicitud`}
                </Text>
                <View className="p-2">
                  <ClockLogo size={100} color={colors.primary.blue} />
                </View>
                <Text
                  className="font-thin text-sm text-center mt-2"
                  style={{ color: colors.secondary.black }}
                >
                  recuerda qeu se puede aplicar para ser dueño de local una vez
                  cada 60 dias
                </Text>
                <BasicButton
                  text="Cerrar"
                  background={colors.primary.blue}
                  textStyle="text-white font-bold p-1 text-base"
                  style="mt-4 h-11"
                  onPress={() => setVisible(false)}
                />
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UserPermissionModal;
