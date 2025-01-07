import axios from "axios";

export const uploadImageToCloudinaryProducts = async (
  // eslint-disable-next-line prettier/prettier
  imageUri: string
): Promise<string | null> => {
  const cloudName = "local-seek-map";
  const uploadPreset = "products_upload"; // Nombre del preset unsigned

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
