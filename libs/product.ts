import { Product } from "../schema/GeneralSchema";
import { Alert } from "react-native";
import { Platform } from 'react-native';

const API_URL = Platform.OS === 'android' ? "http://10.0.2.2:3000/product" : "http://localhost:3000/product";

export async function getProducts() {
  try {
    const rawData = await fetch(API_URL);
    if (!rawData.ok) {
      throw new Error("Failed to fetch Products");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting products", error);
  }
}

export async function getActiveProducts() {
  try {
    const rawData = await fetch(API_URL);
    if (!rawData.ok) {
      throw new Error("Failed to fetch Products");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting products", error);
  }
}

export async function updateProduct(product: Product) {
  try {
    const response = await fetch(API_URL, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      Alert.alert("Error", "Failed to update Product");
      return false; 
    }

    return true; 
  } catch (error) {
    console.log("Error updating product", error);
    Alert.alert("Error", "Error updating product");
    return false; 
  }
}

export async function getProductById(productId: string) {
  const url = `${API_URL}/${productId}`;

  try {
    const response = await fetch(url);
    console.log("Response Status:", response.status); 
    const text = await response.text(); 
    console.log("Response Body:", text); 

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
    }

    const product: Product = JSON.parse(text); 
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    Alert.alert("Error", `Error al obtener el producto: ${error.message}`);
    return null; 
  }
}

export async function createProduct(product: Product) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    console.log(JSON.stringify(product));

    if (!response.ok) {
      Alert.alert("Error", "Failed to create Product");
    } else {
      console.log("Product succesfully added to dataBase");
    }
  } catch (error) {
    console.log("Error: ", error);
    Alert.alert("Error: ", error);
  }
}

export const searchProductsByName = async (searchInput: string) => {
  const cleanedInput = searchInput.trim(); 
  const url = `${API_URL}/search/${cleanedInput}`; 

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Error searching products');
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error searching products:', error);
      throw error;
  }
};

export type ProductSearch = {
  productNameInput: string;
  productCategoryId: string;
};


export async function deleteProduct(id: string) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { 
      method: "PATCH", 
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Error deleting product");
      const errorResponse = await response.json(); 
      console.error(errorResponse); 
      throw new Error('Error al eliminar el producto'); 
    }
    
    return await response.json(); 
  } catch (error) {
    console.error("Error en deleteProduct:", error);
  }
}
