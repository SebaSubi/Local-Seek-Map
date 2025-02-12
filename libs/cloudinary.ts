import axios from "axios";
import * as FileSystem from "expo-file-system";

// export const uploadImageToCloudinaryProducts = async (
//   // eslint-disable-next-line prettier/prettier
//   imageUri: string
// ): Promise<string | null> => {
//   const cloudName = "local-seek-map";
//   const uploadPreset = "products_test"; // Nombre del preset unsigned

//   const fileExtension = imageUri.split(".").pop()?.toLowerCase(); // para saber la extensión de la imagen
//   const imageType =
//     fileExtension === "jpg" || fileExtension === "jpeg"
//       ? "image/jpeg"
//       : "image/png";

//   const formData = new FormData();
//   formData.append("file", {
//     uri: imageUri,
//     type: imageType, // para que se pueda cargar jpg o png
//     name: `image.${fileExtension}`,
//   } as any);
//   formData.append("upload_preset", uploadPreset);

//   try {
//     const response = await axios.post(
//       `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         // eslint-disable-next-line prettier/prettier
//       }
//     );

//     return response.data.secure_url; // URL segura de la imagen
//   } catch (error: any) {
//     console.error(
//       "Error subiendo imagen a Cloudinary:",
//       // eslint-disable-next-line prettier/prettier
//       error.response?.data || error
//     );
//     console.log("formData:", formData);
//     return null;
//   }
// };

// export const uploadImageToCloudinaryProducts = async (
//   // eslint-disable-next-line prettier/prettier
//   imageUri: string
// ): Promise<string | null> => {
//   const cloudName = "local-seek-map";
//   const uploadPreset = "products_test";

//   const fileExtension = imageUri.split(".").pop()?.toLowerCase();
//   const imageType =
//     fileExtension === "jpg" || fileExtension === "jpeg"
//       ? "image/jpeg"
//       : "image/png";

//   try {
//     // Convertir imagen a Blob
//     const response = await fetch(imageUri);
//     const blob = await response.blob();

//     const formData = new FormData();
//     formData.append("file", blob, `image.${fileExtension}`);
//     formData.append("upload_preset", uploadPreset);

//     formData.forEach((value, key) => {
//       console.log(`${key}: ${value}`);
//     });

//     const uploadResponse = await axios.post(
//       `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         // eslint-disable-next-line prettier/prettier
//       }
//     );

//     return uploadResponse.data.secure_url; // Retorna la URL de la imagen subida
//   } catch (error: any) {
//     console.error(
//       "Error subiendo imagen a Cloudinary:",
//       // eslint-disable-next-line prettier/prettier
//       error.response?.data || error
//     );
//     return null;
//   }
// };

export const uploadImageToCloudinaryProducts = async (
  // eslint-disable-next-line prettier/prettier
  imageUri: string
): Promise<string | null> => {
  const cloudName = "local-seek-map";
  const uploadPreset = "products_test";

  const fileExtension = imageUri.split(".").pop()?.toLowerCase();
  const imageType: "image/jpeg" | "image/png" =
    fileExtension === "jpg" || fileExtension === "jpeg"
      ? "image/jpeg"
      : "image/png";

  // const cleanUri = imageUri.replace("file://", "file:///");

  // Crear el FormData
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    // uri: cleanUri,
    type: imageType,
    name: `image.${fileExtension}`,
  } as any);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // eslint-disable-next-line prettier/prettier
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        // eslint-disable-next-line prettier/prettier
        `Error subiendo imagen: ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error subiendo imagen a Cloudinary:", error);
    return null;
  }
};

// export const uploadImageToCloudinaryProducts = async (
//   imageUri: string
// ): Promise<string | null> => {

//   const cloudName = "local-seek-map";
//   const uploadPreset = "products_test";

//   // Cloudinary acepta directamente la URI sin modificarla
//   const formData = new FormData();
//   formData.append("file", {
//     uri: imageUri,
//     type: "image/jpeg",
//     name: "image.jpg",
//   } as any);
//   formData.append("upload_preset", uploadPreset);

//   try {
//     const base64Image = await FileSystem.readAsStringAsync(imageUri, {
//       encoding: FileSystem.EncodingType.Base64,
//     });

//     const formData = new FormData();
//     formData.append("file", `data:image/jpeg;base64,${base64Image}`);
//     formData.append("upload_preset", uploadPreset);

//     const response = await fetch(
//       `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//       {
//         method: "POST",
//         body: formData, // No agregamos headers manualmente
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         `Error subiendo imagen: ${errorData.message || response.statusText}`
//       );
//     }

//     const data = await response.json();
//     return data.secure_url;
//   } catch (error) {
//     console.error("Error subiendo imagen a Cloudinary:", error);
//     return null;
//   }
// };

// export const uploadImageToCloudinaryProducts = async (
//   imageUri: string
// ): Promise<string | null> => {
//   console.log("Intentando subir imagen desde URI:", imageUri);

//   const cloudName = "local-seek-map";
//   const uploadPreset = "products_test";

//   try {
//     // 🔄 Convertir la imagen a Base64
//     const base64 = await FileSystem.readAsStringAsync(imageUri, {
//       encoding: FileSystem.EncodingType.Base64,
//     });

//     const formData = new FormData();
//     formData.append("file", `data:image/jpeg;base64,${base64}`);
//     formData.append("upload_preset", uploadPreset);

//     const response = await fetch(
//       `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         `Error subiendo imagen: ${errorData.message || response.statusText}`
//       );
//     }

//     const data = await response.json();
//     console.log("Imagen subida correctamente:", data.secure_url);
//     return data.secure_url;
//   } catch (error) {
//     console.error("Error subiendo imagen a Cloudinary:", error);
//     return null;
//   }
// };

export const uploadImageToCloudinaryLocals = async (
  // eslint-disable-next-line prettier/prettier
  imageUri: string
): Promise<string | null> => {
  const cloudName = "local-seek-map";
  const uploadPreset = "locals_upload";

  const fileExtension = imageUri.split(".").pop()?.toLowerCase();
  const imageType =
    fileExtension === "jpg" || fileExtension === "jpeg"
      ? "image/jpeg"
      : "image/png";

  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    type: imageType,
    name: `image.${fileExtension}`,
  } as any);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // eslint-disable-next-line prettier/prettier
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        // eslint-disable-next-line prettier/prettier
        `Error subiendo imagen: ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error subiendo imagen a Cloudinary:", error);
    return null;
  }
};

export const uploadImageToCloudinaryServices = async (
  // eslint-disable-next-line prettier/prettier
  imageUri: string
): Promise<string | null> => {
  const cloudName = "local-seek-map";
  const uploadPreset = "services_upload";

  const fileExtension = imageUri.split(".").pop()?.toLowerCase();
  const imageType =
    fileExtension === "jpg" || fileExtension === "jpeg"
      ? "image/jpeg"
      : "image/png";

  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    type: imageType, // para que se pueda cargar jpg o png
    name: `image.${fileExtension}`,
  } as any);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // eslint-disable-next-line prettier/prettier
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        // eslint-disable-next-line prettier/prettier
        `Error subiendo imagen: ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error subiendo imagen a Cloudinary:", error);
    return null;
  }
};
