import { create } from "zustand";

interface Schedule {
  localId: string;
  scheduleId: string;
  // fetchLocalId: (localId: string) => void;
  setLocalId: (localId: string) => void;
  setScheduleId: (scheduleId: string) => void;
}

export const useLocalIdStore = create<Schedule>((set, get) => ({
  localId: "",
  scheduleId: "",

  setLocalId: async (localId: string) => {
    set({ localId: localId });
  },

  setScheduleId: (scheduleId: string) => {
    set({ scheduleId: scheduleId });
  },
}));
