import { LocalProduct, Product } from "../schema/GeneralSchema";
import { Alert } from "react-native";
import { Platform } from "react-native";

const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/product"
    : "http://localhost:3000/product";

// const API_URL =
//   Platform.OS === "android" ? "http://192.168.0.135:3000/product" : "";
// // Platform.OS === "android" ? "http://192.168.130.1:3000/product" : "";

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

export async function getProductsByCategory(categroyId: string) {
  try {
    const rawData = await fetch(`${API_URL}/category/${categroyId}`);
    if (!rawData.ok) {
      throw new Error("Failed to fetch Products");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting products", error);
  }
}

export async function getProductsByCategoryAndName(
  categoryId: string,
  name: string
) {
  try {
    const rawData = await fetch(
      `${API_URL}/category-name-search?category=${categoryId}&name=${name}`
    );
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
  console.log(productId);
  const url = `${API_URL}/${productId}`;

  try {
    const response = await fetch(url);
    console.log("Response Status:", response.status);
    const text = await response.text();
    console.log("Response Body:", text);

    if (!response.ok) {
      throw new Error(
        // eslint-disable-next-line prettier/prettier
        `Failed to fetch product: ${response.status} ${response.statusText}`
      );
    }

    const product: Product = JSON.parse(text);
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    Alert.alert(
      "Error",
      `Error al obtener el producto: ${(error as any).message.data.msg}`
    );
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

    // console.log(JSON.stringify(product));

    if (!response.ok) {
      Alert.alert("Error", "Failed to create Product");
    } else {
      console.log("We good man");
      const data: Product = await response.json();
      return data;
    }
  } catch (error) {
    console.log("Error: ", error);
    Alert.alert("Error: ", (error as any).message.data.msg);
  }
}

export const searchProductsByName = async (searchInput: string) => {
  try {
    const response = await fetch(`${API_URL}/search?name=${searchInput}`);
    if (!response.ok) {
      throw new Error("Error searching products");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching products:", error);
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
      throw new Error("Error al eliminar el producto");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en deleteProduct:", error);
  }
}

//------------------------------------------------------------Local - Products -------------------------------------------------------

export async function getLocalsOfProduct(id: string) {
  try {
    const response = await fetch(`${API_URL}/locals/${id}`);

    if (!response.ok) {
      console.error("Error getting locals of product");
      const errorResponse = await response.json();
      console.error(errorResponse);
      throw new Error("Error getting locals of product");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting locals of product", error);
  }
}

export async function getProductOfLocal(id: string) {
  try {
    const response = await fetch(`${API_URL}/local-product/${id}`);

    if (!response.ok) {
      console.error("Error getting product of local");
      const errorResponse = await response.json();
      console.error(errorResponse);
      throw new Error("Error getting product of local");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting product of local", error);
  }
}

export async function getLocalProductCategories() {
  try {
    const response = await fetch(
      `http://localhost:3000/local-product-categories`
    );

    if (!response.ok) {
      console.error("Error getting local product categories");
      const errorResponse = await response.json();
      console.error(errorResponse);
      throw new Error("Error getting local product categories");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting local product categories", error);
  }
}

export async function getLocalProductCategoriesByName(name: string) {
  try {
    const response = await fetch(
      `http://localhost:3000/local-product-categories/search-name?name=${name}`
    );

    if (!response.ok) {
      console.error("Error getting local product categories by name");
      const errorResponse = await response.json();
      console.error(errorResponse);
      throw new Error("Error getting local product categories by name");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting local product categories by name", error);
  }
}

export async function getLocalProductSubCategoriesByName(name: string) {
  try {
    const response = await fetch(
      `http://localhost:3000/local-product-sub-categories/search-name?name=${name}`
    );

    if (!response.ok) {
      console.error("Error getting local product sub categories by name");
      const errorResponse = await response.json();
      console.error(errorResponse);
      throw new Error("Error getting local product sub categories by name");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting local product sub categories by name", error);
  }
}

export async function createLocalProduct(localProduct: LocalProduct) {
  try {
    const response = await fetch("http://localhost:3000/local-product/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(localProduct),
    });

    if (!response.ok) {
      Alert.alert("Error", "Failed to create Product");
    } else {
      console.log("We good man");
      const data: Product = await response.json();
      return data;
    }
  } catch (error) {
    console.log("Error: ", error);
    Alert.alert("Error: ", (error as any).message.data.msg);
  }
}
