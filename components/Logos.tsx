import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import Fontisto from "@expo/vector-icons/Fontisto";

<FontAwesome6 name="arrow-up-right-from-square" size={24} color="black" />;

export const CreateLogo = () => {
  return <Entypo name="plus" size={24} color="black" />;
};

export const ReadLogo = () => {
  return <FontAwesome5 name="readme" size={17} color="black" />;
};

export const UpdateLogo = ({ color = "black", size = 18 }) => {
  return <Entypo name="new-message" size={size} color={color} />;
};

export const DeleteLogo = ({ color = "black", size = 24 }) => {
  return <MaterialIcons name="delete-outline" size={size} color={color} />;
};

export const ProductIcon = ({ color = "black", size = 24 }) => {
  return (
    <MaterialCommunityIcons
      name="food-apple-outline"
      size={size}
      color={color}
    />
  );
};

export const LocalIcon = ({ color = "black", size = 24 }) => {
  return (
    <MaterialCommunityIcons name="shopping-outline" size={size} color={color} />
  );
};

export const ScheduleIcon = () => {
  return <MaterialIcons name="schedule" size={24} color="black" />;
};

export const ServiceIcon = () => {
  return <MaterialCommunityIcons name="soccer" size={24} color="black" />;
};

export const ReloadIcon = ({ color = "black", size = 24 }) => {
  return <AntDesign name="reload1" size={size} color={color} />;
};

export const EmptyHeartIcon = ({ color = "black", size = 24 }) => {
  return <AntDesign name="hearto" size={size} color={color} />;
};

export const fullHeartIcon = ({ color = "black", size = 24 }) => {
  return <AntDesign name="heart" size={size} color={color} />;
};

export const WhatsAppIcon = ({ color = "black", size = 24 }) => {
  return <FontAwesome5 name="whatsapp" size={size} color={color} />;
};

export const InstagramIcon = ({ color = "black", size = 24 }) => {
  return <FontAwesome5 name="instagram" size={size} color={color} />;
};

export const FacebookIcon = ({ color = "#3b5998", size = 24 }) => {
  return <FontAwesome5 name="facebook" size={size} color={color} />;
};

export const WebIcon = ({ color = "black", size = 24 }) => {
  return <MaterialCommunityIcons name="web" size={size} color={color} />;
};

export const LocationIcon = ({ color = "black", size = 24 }) => {
  return <FontAwesome6 name="location-dot" size={size} color={color} />;
};

export const WarningIcon = ({ color = "black", size = 24 }) => (
  <AntDesign name="warning" size={size} color={color} />
);

export const HomeIcon = () => {
  return <Entypo name="home" size={24} color="black" />;
};

export const SearchIcon = ({ color = "black", size = 24 }) => {
  return <Feather name="search" size={size} color={color} />;
};

export const PersonCircleIcon = ({ color = "black", size = 24 }) => {
  return <Ionicons name="person-circle-sharp" size={size} color={color} />;
};

export const LogOutIcon = ({ color = "white" }) => {
  return <MaterialCommunityIcons name="logout" size={24} color={color} />;
};

export const InfoIcon = ({ color = "white", size = 24 }) => {
  return <AntDesign name="question" size={size} color={color} />;
};

export const Cafeteria = ({ color = "black" }) => {
  return <FontAwesome6 name="mug-hot" size={24} color={color} />;
};

export const Supermercado = ({ color = "black" }) => {
  return <AntDesign name="shoppingcart" size={24} color={color} />;
};

export const Heladeria = ({ color = "balck" }) => {
  return <MaterialIcons name="icecream" size={24} color={color} />;
};

export const Pasteleria = ({ color = "black" }) => {
  return <MaterialCommunityIcons name="cake" size={24} color={color} />;
};

export const Ferreteria = ({ color = "black" }) => {
  return (
    <MaterialCommunityIcons name="hammer-screwdriver" size={24} color={color} />
  );
};

export const Servicio = ({ color = "black" }) => {
  return (
    <MaterialIcons name="miscellaneous-services" size={24} color={color} />
  );
};

export const ArrowUpRight = ({ color = "black", size = 24 }) => {
  return <Feather name="arrow-up-right" size={size} color={color} />;
};

export const ArrowUpRightBox = ({ color = "black", size = 24 }) => {
  return (
    <FontAwesome6 name="arrow-up-right-from-square" size={size} color={color} />
  );
};

export const Checkbox = ({ color = "black" }) => {
  return <AntDesign name="checksquareo" size={24} color={color} />;
};

export const CloseCircle = ({ color = "black" }) => {
  return <AntDesign name="closecircle" size={24} color={color} />;
};

export const Save = ({ color = "black" }) => {
  return <Feather name="save" size={24} color={color} />;
};

export const Edit = ({ color = "black", size = 24 }) => {
  return <AntDesign name="edit" size={size} color={color} />;
};

export const Eye = ({ color = "black", size = 24 }) => {
  return <Feather name="eye" size={size} color={color} />;
};

export const EyeOff = ({ color = "black", size = 24 }) => {
  return <Feather name="eye-off" size={size} color={color} />;
};

export const ArrowLeft = ({ color = "black", size = 24 }) => {
  return <AntDesign name="arrowleft" size={size} color={color} />;
};

export const ClockLogo = ({ color = "black", size = 24 }) => {
  return <Feather name="clock" size={size} color={color} />;
};

export const ReadMore = ({ color = "black", size = 24 }) => {
  return <MaterialIcons name="read-more" size={size} color={color} />;
};

export const ReaderIcon = ({ color = "black", size = 24 }) => {
  return <Ionicons name="reader-outline" size={size} color={color} />;
};

export const TrashIcon = ({ color = "black", size = 24 }) => {
  return <Fontisto name="trash" size={size} color={color} />;
};

export const EmailIcon = ({ color = "black", size = 24 }) => {
  return <Fontisto name="email" size={size} color={color} />;
};

export const StoreIcon = ({ color = "black", size = 24 }) => {
  return <FontAwesome5 name="store" size={size} color={color} />;
};

export const CircleCheckIcon = ({ color = "black", size = 24 }) => {
  return <AntDesign name="checkcircleo" size={size} color={color} />;
};

export const StatsIcon = ({ color = "black", size = 24 }) => {
  return <Ionicons name="stats-chart-sharp" size={size} color={color} />;
};

export const RefreshLogo = ({ color = "black", size = 24 }) => {
  return <Ionicons name="refresh" size={size} color={color} />;
};

export const InfoCircle = ({ color = "black", size = 24 }) => {
  return <Entypo name="info-with-circle" size={size} color={color} />;
};
