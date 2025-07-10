import { create } from "zustand";
import { Service } from "../schema/GeneralSchema";

interface ZustangService {
  service: Service;
  setService: (service: Service) => void;
}

export const useService = create<ZustangService>((set) => ({
  service: {
    id: "",
    name: "",
    imgURL: null,
    dateFrom: new Date(),
    dateTo: null,
    serviceType: undefined,
    serviceTypeId: "",
  },

  setService: (service: Service) => {
    set({ service });
  },
}));
