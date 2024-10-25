import { v2 as cloudinary } from "cloudinary";
// import * as dotenv from "react-native-dotenv";
import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
// import Constants from "expo-constants";
// import {
//     EXPO_PUBLIC_CLOUD_NAME,
//     EXPO_PUBLIC_API_KEY,
//     EXPO_PUBLIC_API_SECRET,
// } from "react-native-dotenv";

// dotenv.config();

// cloudinary.config({
//   cloud_name: CLOUDINARY_CLOUD_NAME,
//   api_key: CLOUDINARY_API_KEY,
//   api_secret: CLOUDINARY_API_SECRET,
//   secure: true,
// });

// const cloudinaryConfig = Constants.expoConfig?.extra;

// cloudinary.config({
//   cloud_name: cloudinaryConfig.CLOUDINARY_CLOUD_NAME,
//   api_key: cloudinaryConfig.CLOUDINARY_API_KEY,
//   api_secret: cloudinaryConfig.CLOUDINARY_API_SECRET,
//   secure: true,
// });

cloudinary.config({
  cloud_name: process.env.EXPO_PUBLIC_CLOUD_NAME,
  api_key: process.env.EXPO_PUBLIC_API_KEY,
  api_secret: process.env.EXPO_PUBLIC_API_SECRET,
  secure: true,
});

export const uploadImageToCloudinary = async (imageUri: string) => {
  try {
    const base64Img = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const data = `data:image/jpg;base64,${base64Img}`;

    const result = await cloudinary.uploader.upload(data, {
      upload_preset: "products_upload",
    });

    return result.secure_url;
  } catch (error) {
    Alert.alert("Error", "No se pudo subir la imagen a Cloudinary");
    console.error(error);
    return null;
  }
};
