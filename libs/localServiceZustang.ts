import { create } from "zustand";

interface ServiceSchedule {
  localServiceId: string;
  serviceScheduleId: string;
  setLocalServiceId: (localId: string) => void;
  setServiceScheduleId: (scheduleId: string) => void;
}

export const useLocalServiceIdStore = create<ServiceSchedule>((set, get) => ({
  localServiceId: "",
  serviceScheduleId: "",

  setLocalServiceId: async (localServiceId: string) => {
    set({ localServiceId: localServiceId });
  },

  setServiceScheduleId: (serviceScheduleId: string) => {
    set({ serviceScheduleId: serviceScheduleId });
  },
}));
