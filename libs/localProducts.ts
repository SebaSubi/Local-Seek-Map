import { Alert } from "react-native";
import { LocalProduct } from "../schema/GeneralSchema";

const API_URL = "http://localhost:3000/local-product";

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

export async function getProductsOfLocalByName(id: string, name: string) {
  const url = `${API_URL}/local/${id}?name=${name}`;
  try {
    const rawData = await fetch(url);
    if (!rawData.ok) {
      throw new Error("Failed to fetch local products by name");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting local products by name", error);
  }
}

export async function getMenuProductsOfLocalByNameAndCat(
  id: string,
  name: string,
  category: string
) {
  const url = `${API_URL}/localMenu/${id}/${category}?name=${name}`;

  console.log(url);
  try {
    const rawData = await fetch(url);
    if (!rawData.ok) {
      throw new Error("Failed to fetch local menu products by name and cat");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log(
      "Error getting store local menu products by name and cat",
      error
    );
  }
}

export async function getProductsOfLocalByNameAndCat(
  id: string,
  name: string,
  category: string
) {
  const url = `${API_URL}/local/${id}/${category}?name=${name}`;

  try {
    const rawData = await fetch(url);
    if (!rawData.ok) {
      throw new Error("Failed to fetch local products by name and cat");
    }
    const json = await rawData.json();
    return json;
  } catch (error) {
    console.log("Error getting store local products by name and cat", error);
  }
}

export async function getProductByLocalId(id: string) {
  try {
    const response = await fetch(`${API_URL}/localId/${id}`);

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

export async function getProductIdsOfLocal(id: string) {
  // This call brings even the inactive ones
  try {
    const response = await fetch(`${API_URL}/local/ids/${id}`);

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

export async function deleteProductOfLocal(productId: string) {
  console.log(productId);
  try {
    const response = await fetch(`${API_URL}/removeProduct/${productId}`, {
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

    // return await response.json();
  } catch (error) {
    console.error("Error en deleteProduct:", error);
  }
}

export async function createLocalProduct(localProduct: LocalProduct) {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(localProduct),
    });

    if (!response.ok) {
      Alert.alert("Error", "Failed to create Product");
    } else {
      const data: LocalProduct = await response.json();
      return data;
    }
  } catch (error) {
    console.log("Error: ", error);
    Alert.alert("Error: ", (error as any).message.data.msg);
  }
}

export async function reactivateLocalProduct(id: string) {
  try {
    const response = await fetch(`${API_URL}/reactivateProduct/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Error-1 reactivating products");
      const errorResponse = await response.json();
      console.error(errorResponse);
      throw new Error("Error-2 reactivating products");
    }

    return await response.json();
  } catch (error) {
    console.error("Error-3 reactivating products", error);
  }
}

export async function updateLocalProduct(
  id: string,
  localProduct: LocalProduct
) {
  try {
    const response = await fetch(`${API_URL}/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(localProduct),
    });

    if (!response.ok) {
      Alert.alert("Error", "Failed to update local Product");
    } else {
      const data: LocalProduct = await response.json();
      return data;
    }
  } catch (error) {
    console.log("Error: ", error);
    Alert.alert("Error: ", (error as any).message.data.msg);
  }
}

// ------------------------------------ Categories ------------------------------------

export async function getLocalProductCategories() {
  try {
    const response = await fetch(
      `http://localhost:3000/local-product-categories`
    );

    if (!response.ok) {
      console.error("Error getting local product categories");
      const errorResponse = await response.json();
      console.error(errorResponse);
      throw new Error("Error getting product of local");
    } else {
      return await response.json();
    }
  } catch (error) {
    console.error("Error getting local product categories", error);
  }
}

export async function getLocalProductCategoriesOfLocal(id: string) {
  try {
    const response = await fetch(
      `http://localhost:3000/local-product/lp-categories/${id}`
    );

    if (!response.ok) {
      console.error("Error getting local product categories");
      const errorResponse = await response.json();
      console.error(errorResponse);
      throw new Error("Error getting product of local");
    } else {
      return await response.json();
    }
  } catch (error) {
    console.error("Error getting local product categories", error);
  }
}

// ------------------------------------ Sub Categories ------------------------------------

export async function getLocalProductSubCategoriesOfLocal(
  localId: string,
  catName: string
) {
  try {
    const response = await fetch(
      `http://localhost:3000/local-product-sub-categories/sub-cats/${localId}/${catName}`
    );

    if (!response.ok) {
      console.error("Error getting local product sub categories by category");
      const errorResponse = await response.json();
      console.error(errorResponse);
      throw new Error("Error getting local product sub categories by category");
    } else {
      return await response.json();
    }
  } catch (error) {
    console.error(
      "Error getting local product sub categories by category",
      error
    );
  }
}
