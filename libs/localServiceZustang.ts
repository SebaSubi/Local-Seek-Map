import { create } from "zustand";
import {
  LocalService,
  LocalServiceSchedule,
  Service,
} from "../schema/GeneralSchema";

interface ServiceSchedule {
  localService: LocalService;
  localCoordinates: string;
  serviceSchedule: LocalServiceSchedule;
  setLocalService: (service: LocalService) => void;
  setServiceSchedule: (schedule: LocalServiceSchedule) => void;
  setLocalCoordinates: (localCoordinates: string) => void;
}

export const useLocalServiceIdStore = create<ServiceSchedule>((set) => ({
  localService: {
    localId: "", // Required field
    serviceId: "", // Required field
    location: "", // Required field
    address: "", // Required field
    reservationNumber: "", // Required field
    description: "", // Required field
    localServiceCategoryId: "", // Required field
    dateFrom: new Date(), // Required field (defaults to current date)
  },
  serviceSchedule: {
    localServiceId: "",
    dateFrom: new Date(),
    dayNumber: undefined,
    FirstShiftStart: "",
    FirstShiftFinish: "",
    localService: undefined,
  },
  localCoordinates: "0, 0",

  setLocalService: (localService: LocalService) => {
    set({ localService });
  },

  setServiceSchedule: (serviceSchedule: LocalServiceSchedule) => {
    set({ serviceSchedule });
  },

  setLocalCoordinates: (localCoordinates: string) => {
    set({ localCoordinates });
  },
}));
