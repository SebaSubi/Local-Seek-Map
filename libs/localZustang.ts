import { create } from "zustand";
import { Local, LocalSchedule } from "../schema/GeneralSchema";

interface LocalStore {
  local: Local;
  setLocal: (local: Local) => void;
}

export const useLocalIdStore = create<LocalStore>((set) => ({
  local: {
    id: "",
    name: "",
    location: "",
    address: "",
    whatsapp: null,
    instagram: "",
    facebook: null,
    webpage: "",
    imgURL: "",
    dateTo: null,
    localTypeID: "",
  },

  setLocal: (local: Local) => {
    set({ local });
  },
}));
