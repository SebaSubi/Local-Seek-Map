import {
  LocalProduct,
  LocalProductCategory,
  LocalProductSubCategory,
  Product,
} from "../schema/GeneralSchema";
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
      `${API_URL}/category-name-search/${categoryId}?name=${name}`
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
      method: "PATCH", // I changed all PUT to PATCH -Lucas  TODO: check if it worked
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

//------------------------------------------------------- LocalProduct Category ---------------------------------------------------

const API_URL_2 =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/local-product-categories"
    : "http://localhost:3000/local-product-categories";

export async function getLocalProductCategories() {
  try {
    const response = await fetch(`${API_URL_2}`);

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
    const response = await fetch(`${API_URL_2}/search-name?name=${name}`);

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

export async function createLocalProductCategory(
  localProductCategory: LocalProductCategory
) {
  try {
    const response = await fetch(`${API_URL_2}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(localProductCategory),
    });

    if (!response.ok) {
      Alert.alert("Error", "Failed to create Local Product Category");
    } else {
      const data: LocalProductCategory = await response.json();
      return data;
    }
  } catch (error) {
    console.log("Error: ", error);
    Alert.alert("Error: ", (error as any).message.data.msg);
  }
}

export async function getLPByNameAndCategory(category: string, name: string) {
  try {
    const response = await fetch(
      `${API_URL}/lp-category-name-search/${category}?name=${name}`
    );

    if (!response.ok) {
      console.error("Error getting product of local by cat 1");
      const errorResponse = await response.json();
      console.error(errorResponse);
      throw new Error("Error getting product of local by cat 2");
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting product of local by cat 3", error);
  }
}

//------------------------------------------------------- LocalProduct SubCategory ---------------------------------------------------

const API_URL_3 =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/local-product-sub-categories"
    : "http://localhost:3000/local-product-sub-categories";

export async function getLocalProductSubCategoriesByName(name: string) {
  try {
    const response = await fetch(`${API_URL_3}/search-name?name=${name}`);

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

export async function createLocalProductSubCategory(
  localProductSubCategory: LocalProductSubCategory
) {
  try {
    const response = await fetch(`${API_URL_3}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(localProductSubCategory),
    });

    if (!response.ok) {
      Alert.alert("Error", "Failed to create Local Product Category");
    } else {
      const data: LocalProductCategory = await response.json();
      return data;
    }
  } catch (error) {
    console.log("Error: ", error);
    Alert.alert("Error: ", (error as any).message.data.msg);
  }
}
