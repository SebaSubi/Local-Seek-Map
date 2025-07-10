import { View, Text, Modal, Pressable, FlatList } from "react-native";
import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import { colors } from "../../constants/colors";
import { CloseCircle, ReloadIcon } from "../Logos";
import EditLocalContainer from "../EditLocalContainer";
import { Local } from "../../schema/GeneralSchema";
import { Role, useAuth } from "../../app/context/AuthContext";
import { getUserLocals } from "../../libs/user";
import { useFocusEffect } from "expo-router";
import BasicButton from "../BasicButton";

const LocalEditModal = ({
  isVisible,
  setVisible,
}: {
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const { authState } = useAuth();

  useFocusEffect(
    useCallback(() => {
      fetchData(); // se ejecuta cada vez que esta pantalla recibe el foco
    }, [authState?.user?.email])
  );

  const [locals, setLocals] = useState<Local[]>([]);

  const fetchData = async () => {
    // console.log("username: ", authState?.user?.username);
    // console.log(authState?.user?.username !== "Admin");
    // console.log(authState?.user?.username !== Role.USER);
    if (
      authState?.user?.username &&
      authState.user.username !== "Admin" &&
      authState.user.role !== Role.USER
    ) {
      const fetchedLocals = await getUserLocals(authState?.user?.email);
      //   console.log(fetchedLocals);

      if (Array.isArray(fetchedLocals)) {
        setLocals(fetchedLocals);
      }
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setVisible(false)}
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
          <View className="w-full items-end"></View>
          <Text className="font-normal text-2xl">Mis Locales</Text>
          <View className="w-full h-4/6">
            <FlatList
              data={locals}
              horizontal={false}
              numColumns={2}
              renderItem={({ item }) => (
                <Pressable
                  style={{ width: "50%" }}
                  // onPressIn={() => setVisible(false)}
                  onPress={() => setVisible(false)}
                >
                  <EditLocalContainer local={item} />
                </Pressable>
              )}
              keyExtractor={(item) => item?.id!}
              onRefresh={() => fetchData()}
              // refreshing={loading}
              refreshing={false}
            />
          </View>
          <View className="flex justify-center w-full items-center">
            <BasicButton
              text="Recargar"
              background={colors.primary.blue}
              textStyle="text-white font-bold ml-2"
              logo={<ReloadIcon color="#fff" />}
              style="w-28 pl-2 mt-5"
              onPress={() => fetchData()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LocalEditModal;
