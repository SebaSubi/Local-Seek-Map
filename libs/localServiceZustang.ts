import { create } from "zustand";
import { Service } from "../schema/GeneralSchema";

interface ServiceSchedule {
  service: Service;
  localCoordinates: string;
  serviceScheduleId: string;
  setService: (service: Service) => void;
  setServiceScheduleId: (scheduleId: string) => void;
  setLocalCoordinates: (localCoordinates: string) => void;
}

export const useLocalServiceIdStore = create<ServiceSchedule>((set) => ({
  service: {
    id: null,
    local: null,
    localId: "",
    name: "",
    location: "",
    address: "",
    reservationNumber: "",
    serviceType: null,
    serviceTypeId: "",
    description: "",
    imgURL: null,
    reservationURL: null,
    dateFrom: new Date(),
    dateTo: null,
    schedule: null,
  },
  serviceScheduleId: "",
  localCoordinates: "0, 0",

  setService: (service: Service) => {
    set({ service });
  },

  setServiceScheduleId: (serviceScheduleId: string) => {
    set({ serviceScheduleId });
  },

  setLocalCoordinates: (localCoordinates: string) => {
    set({ localCoordinates });
  },
}));
