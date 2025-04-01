import { ActivityIndicator, Pressable, Text, View } from "react-native";
import BasicSelectable from "../../../components/BasicSelectable";
import {
  ClockLogo,
  CreateLogo,
  DeleteLogo,
  ProductIcon,
  ReaderIcon,
  ReadLogo,
  ServiceIcon,
  StatsIcon,
  UpdateLogo,
} from "../../../components/Logos";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Local } from "../../../schema/GeneralSchema";
import { getLocalById, getLocals } from "../../../libs/local";
import GoBackButton from "../../../components/GoBackButton";
import { colors } from "../../../constants/colors";
import { useLocalIdStore } from "../../../libs/localZustang";
import BasicButton from "../../../components/BasicButton";
import LocalDeleteModal from "../../../components/modals/LocalDeleteModal";

export default function ProductCrud() {
  const local = useLocalIdStore((state) => state.local);

  const [isVisible, setVisible] = useState(false);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
        <View className="flex flex-row items-center justify-between w-full ">
          <GoBackButton iconColor="white" style="ml-1" />
          <Text className="text-white font-semibold text-xl mt-1">
            {`${local && local.name ? local.name : ""}`}
          </Text>
          <GoBackButton iconColor="white" style="ml-1 opacity-0" />
        </View>
        <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-center">
          {/* <BasicSelectable
                href="/CRUD/LocalCRUD/CreateLocal"
                logo={<CreateLogo />}
                text="Crear Local"
                style="mt-3"
              /> */}

          <BasicSelectable
            href="/CRUD/LocalCRUD/NewUpdateLocal"
            logo={<UpdateLogo />}
            text="Actualizar Local"
            style="mt-3"
          />
          <BasicSelectable
            href="CRUD/LocalCRUD/LocalPage/[id]"
            logo={<ReaderIcon />}
            text="Ver Local"
            style="mt-3"
          />
          <LocalDeleteModal isVisible={isVisible} setVisible={setVisible} />
          <View className="mt-3">
            <BasicButton
              text="Borrar Local"
              background="#fff"
              logo={
                <View className="p-2 mr-1">
                  <DeleteLogo />
                </View>
              }
              onPress={() => setVisible(!isVisible)}
            />
          </View>
          <BasicSelectable
            href="/CRUD/LocalCRUD/LocalSchedule/"
            logo={<ClockLogo />}
            text="Horarios Local"
            style="mt-3"
          />
          <BasicSelectable
            href="/CRUD/LocalCRUD/LocalProduct/AddProduct"
            logo={<ProductIcon />}
            text="Agregar Producto"
            style="mt-3"
          />
          <BasicSelectable
            href="/CRUD/LocalCRUD/LocalProduct/EditProduct"
            logo={<UpdateLogo />}
            text="Editar Productos"
            style="mt-3"
          />
          <BasicSelectable
            href="/CRUD/LocalCRUD/LocalStats"
            logo={<StatsIcon />}
            text="Estadisticas"
            style="mt-3"
          />
          {local.localTypes?.name === "Servicio" && (
            <BasicSelectable
              href="/CRUD/ServiceCRUD"
              logo={<ServiceIcon />}
              text="Servicios"
              style="mt-3"
            />
          )}
        </View>
      </View>
    </>
  );
}
{
  /* 
//por si alguien extraña el viejo codigo esta aca

// import { ActivityIndicator, Pressable, Text, View } from "react-native";
// import BasicSelectable from "../../../components/BasicSelectable";
// import {
//   CreateLogo,
//   DeleteLogo,
//   ProductIcon,
//   ReadLogo,
//   UpdateLogo,
// } from "../../../components/Logos";
// import { Stack, useLocalSearchParams } from "expo-router";
// import { useEffect, useState } from "react";
// import { Local } from "../../../schema/GeneralSchema";
// import { useLocalIdStore } from "../../../libs/scheduleZustang";
// import { getLocals } from "../../../libs/local";

// export default function ProductCrud() {
//   const [screen, setScreen] = useState(false);
//   const [locals, setLocals] = useState<Local[]>([]);
//   const setLocalId = useLocalIdStore((state) => state.setLocalId);
//   const { id, name, localCoordinates, image, localType } =
//     useLocalSearchParams();

//   useEffect(() => {
//     const fetchLocals = async () => {
//       if (id) {
//         setLocalId(id as string);
//         setScreen(true);
//       } else {
//         const fetchedLocals = await getLocals();
//         setLocals(fetchedLocals);
//       }
//     };
//     fetchLocals();
//   }, [id]);

//   function handlePress(id: string) {
//     setLocalId(id);
//     setScreen(true);
//   }

//   return (
//     <>
//       <Stack.Screen
//         options={{
//           headerShown: false,
//         }}
//       />
//       <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
//         {screen ? (
//           <>
//             <Text className="text-white font-semibold text-lg mb-2">
//               ABM Local
//             </Text>
//             <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-center">
//               <BasicSelectable
//                 href="/CRUD/LocalCRUD/CreateLocal"
//                 logo={<CreateLogo />}
//                 text="Crear Local"
//                 style="mt-3"
//               />
//               <BasicSelectable
//                 href="/CRUD/LocalCRUD/DeleteLocal"
//                 logo={<DeleteLogo />}
//                 text="Borrar Local"
//                 style="mt-3"
//               />
//               <BasicSelectable
//                 href="/CRUD/LocalCRUD/UpdateLocal"
//                 logo={<UpdateLogo />}
//                 text="Actualizar Local"
//                 style="mt-3"
//               />
//               <BasicSelectable
//                 href="/CRUD/LocalCRUD/ReadLocal"
//                 logo={<ReadLogo />}
//                 text="Leer Locales"
//                 style="mt-3"
//               />
//               <BasicSelectable
//                 href="/CRUD/LocalCRUD/LocalSchedule/"
//                 logo={<ReadLogo />}
//                 text="Horario Local"
//                 style="mt-3"
//               />
//               <BasicSelectable
//                 href="/CRUD/LocalCRUD/AddProduct"
//                 logo={<ProductIcon />}
//                 text="Agregar Producto"
//                 style="mt-3"
//               />
//               <BasicSelectable
//                 href="/CRUD/LocalCRUD/EditProduct"
//                 logo={<UpdateLogo />}
//                 text="Editar Productos"
//                 style="mt-3"
//               />
//             </View>
//           </>
//         ) : (
//           <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-center">
//             {locals === undefined ? (
//               <ActivityIndicator size="large" />
//             ) : locals.length === 0 ? (
//               <Text className="text-white mt-4">
//                 No hay locales disponibles
//               </Text>
//             ) : (
//               locals.map((local) => (
//                 <Pressable
//                   key={local.id}
//                   className="flex flex-row items-center justify-center bg-[#f6f6f6] w-5/6 h-10 mt-4 rounded-2xl"
//                   onPress={() => handlePress(local.id!)}
//                 >
//                   <Text className="mt-1 ml-1 font-bold">{local.name}</Text>
//                 </Pressable>
//               ))
//             )}
//           </View>
//         )}
//       </View>
//     </>
//   );
// } */
}
