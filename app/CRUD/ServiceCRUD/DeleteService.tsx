import { useEffect, useState } from "react";
import { Service } from "../../../schema/GeneralSchema";
import { useLocalIdStore } from "../../../libs/localZustang";
import {
  deleteService,
  getServicesByLocalId,
  getServicesByLocalIdAndName,
} from "../../../libs/localService";
import { Stack } from "expo-router";
import { FlatList, View } from "react-native";
import BasicSearchButton from "../../../components/BasicSearchBar";
import DeleteServiceContainer from "../../../components/DeleteServiceComponent";

export default function EditProduct() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const local = useLocalIdStore((state) => state.local);

  async function getAndSetServices() {
    setLoading(true);
    const products = await getServicesByLocalIdAndName(local.id!, search);
    setServices(products);
    setLoading(false);
  }
  const handleDelete = (id: string) => {
    setLoading(true);
    deleteService(id);
    getAndSetServices();
  };

  useEffect(() => {
    getAndSetServices();
  }, [search]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className=" flex justify-start flex-col h-full w-full bg-[#1a253d]">
        <BasicSearchButton
          placeholder="Buscar"
          onSearch={setSearch}
          style="mt-6 "
        />

        <View className="flex items-center h-[90%] w-full bg-white rounded-3xl overflow-hidden">
          <FlatList
            data={services}
            renderItem={({ item }) => (
              <DeleteServiceContainer service={item} onDelete={handleDelete} />
            )}
            keyExtractor={(item) => item.id!}
            onRefresh={() => getAndSetServices()}
            refreshing={loading}
            className="mt-2"
          />
        </View>
      </View>
    </>
  );
}

// import { Pressable, Text, View } from "react-native";

// import { useEffect, useState } from "react";
// import { DeleteLogo, ReloadIcon, UpdateLogo } from "../../../components/Logos";
// import { Link, Stack } from "expo-router";
// import BasicButton from "../../../components/BasicButton";
// import { days } from "../../../schema/generalConst";
// import Header from "../../../components/Header";
// import {
//   deleteService,
//   deleteServiceSchedule,
//   getScheduleByLocalServiceId,
//   getServicesByLocalId,
// } from "../../../libs/localService";
// import { useLocalServiceIdStore } from "../../../libs/localServiceZustang";
// import { LocalServiceSchedule } from "../../../schema/GeneralSchema";
// import { useLocalIdStore } from "../../../libs/localZustang";

// export default function DeleteSchedule() {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refresh, setRefresh] = useState(false);
//   const local = useLocalIdStore((state) => state.local);
//   const setServiceId = useLocalServiceIdStore(
//     (state) => state.setLocalServiceId
//   );

//   useEffect(() => {
//     const fetchData = async () => {
//       const services = await getServicesByLocalId(localId);
//       setServices(services);
//       setLoading(false);
//     };
//     fetchData();
//   }, [localId, refresh]);

//   function handlePress(id: string) {
//     deleteService(id);
//     console.log(id);
//     setRefresh(!refresh);
//   }

//   const handleReload = () => {
//     setRefresh(!refresh);
//   };

//   return (
//     <View className="flex flex-col items-center justify-center">
//       <Stack.Screen
//         options={{
//           header: () => <Header title="Editar/Borrar Horarios" />,
//         }}
//       />
//       {loading ? (
//         <Text>Cargando...</Text>
//       ) : services.length ? (
//         <View
//           style={{ height: services.length * 45 }}
//           className="flex flex-col w-4/5 bg-[#e1e8e8] rounded-2xl mt-10"
//         >
//           {services.map((service: LocalService, index) => (
//             <View
//               key={index}
//               className="flex flex-col items-center justify-center"
//             >
//               <Text className="font-bold text-xl mt-3" key={index}>
//                 {service.name}
//               </Text>
//               <View className="absolute left-0 ml-1 flex items-center justify-center h-7 w-7 bg-white rounded-full">
//                 <Pressable onPress={() => handlePress(service.id!)}>
//                   <DeleteLogo />
//                 </Pressable>
//               </View>
//               <Link
//                 asChild
//                 href="/CRUD/ServiceCRUD/UpdateService"
//                 className="absolute right-3 top-5 bg-white"
//               >
//                 <Pressable
//                   onPress={() => {
//                     setServiceId(service.id!);
//                   }}
//                 >
//                   <UpdateLogo />
//                 </Pressable>
//               </Link>
//             </View>
//           ))}
//         </View>
//       ) : (
//         <Text>No hay servicios disponibles</Text>
//       )}
//       <BasicButton
//         logo={<ReloadIcon />}
//         text="Recargar Servicios"
//         onPress={handleReload}
//         style="mt-5"
//       />
//     </View>
//   );
// }
