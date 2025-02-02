import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { deleteLocal, getLocalsOfUser } from "../../../libs/local";
import DeleteLocalCard from "../../../components/SmallLocalCard";
import BasicWarning from "../../../components/BasicWarning";

export default function DeleteLocal() {
  const { authState } = useAuth();
  const [userLocals, setUserLocals] = useState();
  const [confirmModal, setConfirmModal] = useState(false);
  const [localId, setLocalId] = useState<string | null>(null);
  const [localName, setLocalName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function getAndSetUserLocals() {
    setLoading(true);
    if (authState && authState.user) {
      const uLocals = await getLocalsOfUser(authState.user.email);
      setUserLocals(uLocals);
      setLoading(false);
    }
  }

  useEffect(() => {
    getAndSetUserLocals();
  }, []);

  function handleDelete(id: string, name: string) {
    setLocalId(id);
    setLocalName(name);
    setConfirmModal(true);
  }

  async function DeleteLocal() {
    console.log(localId);
    console.log(localName);
    localId
      ? await deleteLocal(localId)
      : Alert.alert(
          "Error",
          "Error a borrar local, por fabor intentelo mas tarde"
        );

    getAndSetUserLocals();
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
        <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-center">
          <FlatList
            data={userLocals}
            horizontal={false}
            numColumns={2}
            renderItem={({ item }) => (
              <DeleteLocalCard local={item} onDelete={handleDelete} />
            )}
            keyExtractor={(item) => item.id!.toString()}
            onRefresh={() => getAndSetUserLocals()}
            refreshing={loading}
            style={{ width: "100%" }}
          />
          <Modal
            animationType="fade"
            transparent={true}
            visible={confirmModal}
            onRequestClose={() => setConfirmModal(false)}
          >
            <View
              className="flex items-center justify-center w-full h-full"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <BasicWarning
                text={`Estas seguro que desea borrar el local ${localName}?`}
                cancelButton={false}
                buttonRight="Borrar"
                buttonLeft="Cancelar"
                onPressRight={DeleteLocal}
                onPressLeft={() => {
                  setConfirmModal(false);
                  setLocalId(null);
                }}
              />
            </View>
          </Modal>
        </View>
      </View>
    </>
  );
}
