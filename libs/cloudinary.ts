import axios from "axios";

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
  const uploadPreset = "products_test"; // Nombre del preset unsigned

  const fileExtension = imageUri.split(".").pop()?.toLowerCase(); // para saber la extensión de la imagen
  const imageType: "image/jpeg" | "image/png" =
    fileExtension === "jpg" || fileExtension === "jpeg"
      ? "image/jpeg"
      : "image/png";

  // Crear el FormData
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    type: imageType, // Se usa imageType aquí
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
      // Verificamos si la respuesta no es exitosa
      const errorData = await response.json();
      throw new Error(
        // eslint-disable-next-line prettier/prettier
        `Error subiendo imagen: ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data.secure_url; // URL segura de la imagen
  } catch (error) {
    console.error("Error subiendo imagen a Cloudinary:", error);
    return null;
  }
};

export const uploadImageToCloudinaryLocals = async (
  // eslint-disable-next-line prettier/prettier
  imageUri: string
): Promise<string | null> => {
  const cloudName = "local-seek-map";
  const uploadPreset = "locals_upload"; // Nombre del preset unsigned

  const fileExtension = imageUri.split(".").pop()?.toLowerCase(); // para saber la extensión de la imagen
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
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // eslint-disable-next-line prettier/prettier
      }
    );

    return response.data.secure_url; // URL segura de la imagen
  } catch (error: any) {
    console.error(
      "Error subiendo imagen a Cloudinary:",
      // eslint-disable-next-line prettier/prettier
      error.response?.data || error
    );
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
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // eslint-disable-next-line prettier/prettier
      }
    );

    return response.data.secure_url;
  } catch (error: any) {
    console.error(
      "Error subiendo imagen a Cloudinary:",
      // eslint-disable-next-line prettier/prettier
      error.response?.data || error
    );
    return null;
  }
};
