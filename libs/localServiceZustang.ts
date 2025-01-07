import { create } from "zustand";

interface ServiceSchedule {
  localServiceId: string;
  localCoordinates: string;
  serviceScheduleId: string;
  setLocalServiceId: (localId: string) => void;
  setServiceScheduleId: (scheduleId: string) => void;
  setLocalCoordinates: (localCoordinates: string) => void;
}

export const useLocalServiceIdStore = create<ServiceSchedule>((set, get) => ({
  localServiceId: "",
  serviceScheduleId: "",
  localCoordinates: "0, 0",

  setLocalServiceId: async (localServiceId: string) => {
    set({ localServiceId: localServiceId });
  },

  setServiceScheduleId: (serviceScheduleId: string) => {
    set({ serviceScheduleId: serviceScheduleId });
  },

  setLocalCoordinates: (localCoordinates: string) => {
    set({ localCoordinates: localCoordinates });
  },
}));
