import { Stack } from "expo-router";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/Header";
import BasicSearchButton from "../../components/BasicSearchBar";
import { useEffect, useState } from "react";
import {
  getDisplayLocals,
  getLocalsByCategory,
  getLocalsByName,
  getOpenLocals,
} from "../../libs/local";
import {
  getDisplayServices,
  getDisplayServicesByName,
  getOpenServices,
  getServicesByCategory,
} from "../../libs/localService";
import { getLocalTypes } from "../../libs/localType";
import { getServiceTypes } from "../../libs/serviceType";
import ServiceContainer from "../../components/ServiceContainer";
import LocalContainer from "../../components/LocalContainer";
import ReadWS from "../CRUD/ServiceCRUD/ReadWS";
import ReadLocal from "../CRUD/LocalCRUD/ReadLocal";
import React from "react";

const avaliableItems = ["Locales", "Servicios", "Productos"];

export default function Search() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState("Locales");
  const [itemModal, setItemModal] = useState(false);
  const [types, setTypes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [modalVisibility, setModalVisibility] = useState(false);

  console.log(selectedItem);

  async function fetchAndSetItems() {
    if (selectedItem === "" || selectedItem === "Locales") {
      const items = await getDisplayLocals();
      setItems(items);
    }
    if (selectedItem === "Servicios") {
      const items = await getDisplayServices();
      console.log(items);
      setItems(items);
    }
    // if (selectedItem === "Product") {
    //   const items = await getDisplayProducts();
    //   setItems(items);
    // }
  }

  useEffect(() => {
    const fetchServices = async () => {
      fetchAndSetItems();
    };
    fetchServices();
  }, [selectedItem]);

  useEffect(() => {
    const fetchServices = async () => {
      await fetchAndSetItems();
    };
    const fetchTypes = async () => {
      if (selectedItem === "" || selectedItem === "Locales") {
        const types = await getLocalTypes();
        setTypes(types);
      }
      if (selectedItem === "Servicios") {
        const types = await getServiceTypes();
        setTypes(types);
      }
      // if (selectedItem === "Product") {
      //   const items = await getDisplayProducts();
      //   setItems(items);
      // }
    };
    fetchServices();
    fetchTypes();
  }, []);

  useEffect(() => {
    if (search === "" || search === " ") {
      fetchAndSetItems();
    } else {
      const fetchData = async () => {
        if (selectedItem === "" || selectedItem === "Locales") {
          const items = await getLocalsByName(search);
          setItems(items);
        }
        if (selectedItem === "Servicios") {
          const items = await getDisplayServicesByName(search);
          setItems(items);
        }
        // if (selectedItem === "Product") {
        //   const items = await getDisplayProducts();
        //   setItems(items);
        // }
      };
      fetchData();
    }
  }, [search]);

  function hourFilter() {
    const fetchData = async () => {
      if (selectedItem === "" || selectedItem === "Locales") {
        const items = await getOpenLocals();
        setItems(items);
      }
      if (selectedItem === "Servicios") {
        const items = await getOpenServices();
        setItems(items);
      } else {
        //here we need to put just a getProductByName
      }
    };
    fetchData();
  }

  function itemCategoryFilter(category: string) {
    const fetchData = async () => {
      if (selectedItem === "" || selectedItem === "Locales") {
        const items = await getLocalsByCategory(category);
        setItems(items);
      }
      if (selectedItem === "Servicios") {
        const items = await getServicesByCategory(search);
        setItems(items);
      }
      // if (selectedItem === "Product") {
      //   const items = await getDisplayProducts();
      //   setItems(items);
      // }
    };
    fetchData();
  }

  const handleCategorySelection = (category: string) => {
    if (category === "Quitar") {
      fetchAndSetItems();
    } else if (category === "Apertura") hourFilter();
    else if (category === "Categoria") setModalVisibility(true);
    setSearch("");
  };

  const handleStoreCateory = (category: string) => {
    setModalVisibility(false);
    itemCategoryFilter(category);
  };

  const handleItemSelectPress = () => {
    setItemModal(true);
  };

  function handleSelectedItemSerach(name: string) {
    setSelectedItem(name);
  }

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header title="Buscar" />,
        }}
      />
      <View className="flex flex-row items-center justify-center mt-2">
        <Text>Estas buscando: </Text>
        <TouchableOpacity
          onPress={handleItemSelectPress}
          style={styles.filterButton}
        >
          <Text>{selectedItem}</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={itemModal}
        onRequestClose={() => setItemModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Selecciona el tipo de búsqueda
            </Text>
            {avaliableItems.map((category, index) => (
              <Pressable
                onPress={() => handleSelectedItemSerach(category)}
                style={styles.modalOption}
                key={index}
              >
                <Text style={styles.modalOptionText}>{category}</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => setItemModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View>
        {selectedItem === "Locales" ? (
          <ReadLocal />
        ) : selectedItem === "Servicios" ? (
          <ReadWS />
        ) : null}
      </View>
    </>
  );
}

// <>
//       <Stack.Screen
//         options={{
//           header: () => <Header title="Buscar" />,
//         }}
//       />
//       <View className="flex flex-row items-center justify-center mt-2">
//         <Text className="">Estas buscando: </Text>
//         <TouchableOpacity
//           onPress={handleItemSelectPress}
//           style={styles.filterButton}
//         >
//           <Text>{selectedItem}</Text>
//         </TouchableOpacity>
//       </View>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={itemModal}
//         onRequestClose={() => setItemModal(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>
//               Selecciona el tipo de búsqueda
//             </Text>
//             {avaliableItems.map((category, index) => (
//               <Pressable
//                 onPress={() => handleSelectedItemSerach(category)}
//                 style={styles.modalOption}
//                 key={index}
//               >
//                 <Text style={styles.modalOptionText}>{category}</Text>
//               </Pressable>
//             ))}
//             <Pressable
//               onPress={() => setItemModal(false)}
//               style={styles.closeButton}
//             >
//               <Text style={styles.closeButtonText}>Cerrar</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//       <BasicSearchButton
//         placeholder={`Buscar ${selectedItem}`}
//         onSearch={setSearch}
//         categories={types}
//         selectedCategory={handleCategorySelection}
//       />
//       <ScrollView
//         contentContainerStyle={{ flexGrow: 1 }}
//         keyboardShouldPersistTaps="handled"
//         className="mt-2"
//       >
//         <View className="flex items-center">
//           {items.length > 0 &&
//             items.map(
//               (item) =>
//                 selectedItem === "Servicios" ? (
//                   <ReadWS />
//                 ) : // <Text>Hola</Text>
//                 // <Text>{item.local}</Text>
//                 selectedItem === "Locales" || selectedItem === "" ? (
//                   <LocalContainer key={item.id} local={item} />
//                 ) : null, //Here we will have to add the product container
//             )}

//           <Pressable
//             className="flex items-center justify-center h-10 w-20 bg-slate-800 rounded-xl mt-2"
//             onPress={async () => {
//               await fetchAndSetItems();
//             }}
//           >
//             <Text className="text-white">Recargar</Text>
//           </Pressable>
//           <Modal
//             animationType="slide"
//             transparent={true}
//             visible={modalVisibility}
//             onRequestClose={() => setModalVisibility(false)}
//           >
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}>
//                   Selecciona el tipo de búsqueda
//                 </Text>
//                 {types.length > 0 &&
//                   types.map((category, index) => (
//                     <Pressable
//                       onPress={() => handleStoreCateory(category.name)}
//                       style={styles.modalOption}
//                       key={index}
//                     >
//                       <Text style={styles.modalOptionText}>
//                         {category.name}
//                       </Text>
//                     </Pressable>
//                   ))}
//                 <Pressable
//                   onPress={() => setModalVisibility(false)}
//                   style={styles.closeButton}
//                 >
//                   <Text style={styles.closeButtonText}>Cerrar</Text>
//                 </Pressable>
//               </View>
//             </View>
//           </Modal>
//         </View>
//       </ScrollView>
//     </>

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  modalOptionText: {
    textAlign: "center",
    fontSize: 16,
  },
  filterButton: {
    height: 30,
    width: 100,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e1e8e8",
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#e1e8e8",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
});
