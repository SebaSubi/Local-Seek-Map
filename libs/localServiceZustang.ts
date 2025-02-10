import { create } from "zustand";
import { LocalServiceSchedule, Service } from "../schema/GeneralSchema";

interface ServiceSchedule {
  service: Service;
  localCoordinates: string;
  serviceSchedule: LocalServiceSchedule;
  setService: (service: Service) => void;
  setServiceSchedule: (schedule: LocalServiceSchedule) => void;
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
  serviceSchedule: {
    dateFrom: new Date(),
    dayNumber: undefined,
    FirstShiftStart: "",
    FirstShiftFinish: "",
    localService: undefined,
  },
  localCoordinates: "0, 0",

  setService: (service: Service) => {
    set({ service });
  },

  setServiceSchedule: (serviceSchedule: LocalServiceSchedule) => {
    set({ serviceSchedule });
  },

  setLocalCoordinates: (localCoordinates: string) => {
    set({ localCoordinates });
  },
}));
