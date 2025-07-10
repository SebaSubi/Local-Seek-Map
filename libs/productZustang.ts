import { create } from "zustand";
import { Product } from "../schema/GeneralSchema";

interface ZustangProduct {
  product: Product;
  setProduct: (product: Product) => void;
}

export const useProduct = create<ZustangProduct>((set) => ({
  product: {
    id: "",
    name: "",
    updatedAt: undefined,
    brand: "",
    measurement: "",
    imgURL: null,
    price: null,
    description: "",
    dateFrom: new Date(),
    dateTo: null,
    local: [],
    type: undefined,
    productTypeId: "",
  },

  setProduct: (product: Product) => {
    set({ product });
  },
}));
