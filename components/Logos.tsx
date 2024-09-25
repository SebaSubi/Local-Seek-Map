import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from '@expo/vector-icons/AntDesign';

export const CreateLogo = () => {
  return <Entypo name="plus" size={24} color="black" />;
};

export const ReadLogo = () => {
  return <FontAwesome5 name="readme" size={17} color="black" />;
};

export const UpdateLogo = () => {
  return <Entypo name="new-message" size={18} color="black" />;
};

export const DeleteLogo = () => {
  return <MaterialIcons name="delete-outline" size={24} color="black" />;
};

export const ProductIcon = () => {
  return (
    <MaterialCommunityIcons name="food-apple-outline" size={24} color="black" />
  );
};

export const LocalIcon = () => {
  return (
    <MaterialCommunityIcons name="shopping-outline" size={24} color="black" />
  );
};

export const ScheduleIcon = () => {
  return  <MaterialIcons name="schedule" size={24} color="black" />
}

export const ServiceIcon = () => {
  return <MaterialCommunityIcons name="soccer" size={24} color="black" />
}

export const ReloadIcon = () => {
  return <AntDesign name="reload1" size={24} color="black" />
}
