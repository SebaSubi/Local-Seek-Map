import { Pressable, Text, View } from "react-native";
import BasicTextInput from "../../../components/BasicTextInput";
import BasicButton from "../../../components/BasicButton";
import { useLocalIdStore } from "../../../libs/scheduleZustang";
import { useEffect, useRef, useState } from "react";
import { createLocal, getLocal, getLocals } from "../../../libs/local";
import { Local } from "../../../schema/GeneralSchema";

export default function DeleteProduct() {
  const [locals, setLocals] = useState<Local[]>([]);
  const [screen, setScreen] = useState(false);
  const [local, setLocal] = useState<Local>();
  const setLocalId = useLocalIdStore((state) => state.setLocalId);
  const localId = useLocalIdStore((state) => state.localId);

  const nameRef = useRef(null);
  const locationRef = useRef(null);
  const wppNumberRef = useRef(null);
  const instagramRef = useRef(null);
  const facebookRef = useRef(null);
  const paginaWebRef = useRef(null);
  const imgURLRef = useRef(null);

  useEffect(() => {
    const fetchLocals = async () => {
      const locals = await getLocals();
      setLocals(locals);
    };
    fetchLocals();
  }, []);

  const handlePress = async () => {
    const name = nameRef.current?.getValue();
    const location = locationRef.current.getValue();
    const whatsapp = parseInt(wppNumberRef.current.getValue());
    const instagram = instagramRef.current.getValue();
    const facebook = facebookRef.current.getValue();
    const webpage = paginaWebRef.current.getValue();
    const image = imgURLRef.current.getValue();

    const newLocal: Local = {
      name,
      location,
      whatsapp,
      instagram,
      facebook,
      webpage,
      image,
      dateFrom: new Date(),
    };
    console.log(newLocal);
    // console.log(createLocal(newLocal))
  };
  async function getSpecificLocal(id: string) {
    const fetchLocal = async () => {
      const local = await getLocal(id);
      setLocal(local);
    };
    fetchLocal();
  }

  return (
    <View className="flex flex-col justify-center bg-white items-center w-full h-full">
      {screen ? (
        <>
          <BasicTextInput
            placeholder="Nombre del Local"
            inputType="text"
            title="Nuevo Nombre: "
            textStyle="mt-4"
            defaultValue={local ? local.name : ""}
            ref={nameRef}
          />
          <BasicTextInput
            placeholder="Ubicacion de Local"
            inputType="text"
            title="Nueva Ubicacion del Local" //This we will have to change later, since the person most likely wont knoe the coordinates
            textStyle="mt-4"
            defaultValue={local ? local.location : ""}
            ref={locationRef}
          />
          <BasicTextInput
            placeholder="Numero de WhatsApp"
            inputType="number"
            title="Nuevo Numero: "
            textStyle="mt-4"
            defaultValue={
              local ? (local.whatsapp ? local.whatsapp.toString() : "") : ""
            }
            ref={wppNumberRef}
          />
          <BasicTextInput
            placeholder="Instagram"
            inputType="text"
            title="Nuevo @Instagram: "
            textStyle="mt-4"
            ref={instagramRef}
            defaultValue={local ? (local.instagram ? local.instagram : "") : ""}
          />
          <BasicTextInput
            placeholder="Nuevo Facebook"
            inputType="text"
            title="Nuevo @Facebook: "
            textStyle="mt-4"
            ref={facebookRef}
            defaultValue={local ? (local.facebook ? local.facebook : "") : ""}
          />
          <BasicTextInput
            placeholder="Sitio Web"
            inputType="text"
            title="Nuevo URL: "
            textStyle="mt-4"
            ref={paginaWebRef}
            defaultValue={local ? (local.webpage ? local.webpage : "") : ""}
          />
          <BasicTextInput
            placeholder="Imagen"
            inputType="text"
            title="Esto tenemos que definir" //We have to see hoe we are gonna do the logic for this.
            textStyle="mt-4"
            ref={imgURLRef}
            defaultValue={local ? (local.webpage ? local.image : "") : ""}
          />
          <BasicButton
            text="Actualizar Local"
            style="mt-4"
            onPress={handlePress}
          />
        </>
      ) : (
        <>
          {locals.map((local) => (
            <Pressable
              key={local.id}
              className="flex flex-row items-center justify-center bg-[#e1e8e8] w-5/6 h-10 mt-4 rounded-2xl"
              onPress={() => {
                getSpecificLocal(local.id);
                setLocalId(local.id);
                setScreen(true);
              }}
            >
              <Text className="mt-1 ml-1 font-bold">{local.name}</Text>
            </Pressable>
          ))}
        </>
      )}
    </View>
  );
}
