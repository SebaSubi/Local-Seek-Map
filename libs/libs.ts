import { specificDate } from "../constants/consts";
import {
  Local,
  LocalSchedule,
  LocalServiceSchedule,
} from "../schema/GeneralSchema";

export type LocalProductStats = {
  _count: {
    localProductId: number;
  };
  localProductId: string;
  product: {
    name: string;
  };
};

type localSat = {
  localId: string;
  count: number;
};

export type GlobalStats = {
  locals: localSat[];
  mostPop: Local;
};

export type GlobalProductStats = {
  productId: string;
  count: number;
  name: string;
  type: {
    name: string;
  };
};

export function bringDayName(dayNumber: number) {
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  return days[dayNumber - 1];
}

export function isNumeric(str: string) {
  return !isNaN(parseFloat(str)) && isFinite(Number(str));
}

export function getPlaceholders(category: string): string {
  // console.log(category);
  switch (category) {
    case "Item Menu" || "cm6axgrmi0000at8nx3p6oblt":
      return "https://orders.goodthymes.ca/assets/img/goodthymes/default-menu-image-placeholder.png";

    case "Yerba Mate" || "cm19y0b2p0008iz2pjmgymw9d":
      return "https://us.123rf.com/450wm/rraya/rraya2111/rraya211100058/176769306-hand-drawn-yerba-mate-set-vector-background-sketch-illustration.jpg";

    case "Lacteos" || "cm19y0b2r0009iz2pcctzrfr5":
      return "https://t4.ftcdn.net/jpg/03/28/74/97/360_F_328749732_dWFmfh2HLvAuNWdFXV0wWG726ogGbQo5.jpg";

    case "Utiles Escolares" || "cm19y0b2u000biz2p5ktv682f":
      return "https://img.freepik.com/premium-vector/hand-drawn-school-doodle-vector-set_484148-164.jpg";

    case "Agua Saborizada" || "cm19y0b2x000diz2pgaac0vhb":
      return "https://img.freepik.com/premium-vector/drinks-set-hand-drawn-ink-sketches_659215-119.jpg";

    case "Gaseosas" || "cm19y0b2z000eiz2p10f2lj03":
      return "https://www.shutterstock.com/image-vector/hand-drawing-soda-soft-drink-600nw-665445703.jpg";

    case "Productos Sin TACC" || "cm19yv94e000fpy0x4wypgga4":
      return "https://img.freepik.com/premium-vector/gluten-free-symbol_1274264-19851.jpg";

    case "Galletitas" || "cm19yv94h000gpy0x40huijgw":
      return "https://static.vecteezy.com/system/resources/previews/025/797/739/non_2x/cookies-sketch-line-drawing-black-on-white-vector.jpg";

    default:
      return "https://i0.wp.com/mikeyarce.com/wp-content/uploads/2021/09/woocommerce-placeholder.png?ssl=1";
  }
}

export function createDateWithTime(time: string): Date {
  const [hours, minutes] = time.split(":").map(Number); // Extract hours and minutes
  const today = new Date(); // Get today's date
  today.setHours(hours, minutes, 0, 0); // Set the time while keeping the current date
  return today;
}

export function FirstShiftInputValidation(
  firstShiftStart: Date | undefined,
  firstShiftFinish: Date | undefined
): string {
  if (
    firstShiftStart?.toDateString() === "23:02" ||
    firstShiftFinish?.toDateString() === "23:02"
  ) {
    return "Se debe completar como minimo el primer turno";
  }
  if (firstShiftStart === specificDate || firstShiftFinish === specificDate) {
    return "Se debe completar como minimo el primer turno";
  } else return "Correct";
}

type error =
  | "day"
  | "firstEnd"
  | "secondEnd"
  | "secondStart"
  | "required"
  | "thirdStart"
  | "thirdFinish"
  | "";

export function scheduleInputValidation(
  schedule: LocalSchedule | LocalServiceSchedule
): { type: error; message: string } {
  if (
    (schedule.dayNumber || schedule.dayNumber === 0) &&
    (schedule.dayNumber < 1 || schedule.dayNumber > 7)
  ) {
    return {
      type: "day",
      message: "*El día debe ser entre 1 (domingo) y 7 (sábado)",
    };
  }

  if (
    schedule.FirstShiftStart === "23:02" ||
    schedule.FirstShiftFinish === "23:02"
  ) {
    return {
      type: "required",
      message: "*Debe completar todos los campos obligatorios",
    };
  }
  if (schedule.FirstShiftStart > schedule.FirstShiftFinish) {
    return {
      type: "firstEnd",
      message: "*La hora final no puede ser anterior a la hora inicial",
    };
  }
  if (
    schedule.SecondShiftStart &&
    (!schedule.SecondShiftFinish || schedule.SecondShiftFinish === "23:02")
  ) {
    return {
      type: "secondEnd",
      message: "*Se debe indicar tanto la hora de apertura como de cierre",
    };
  }
  if (
    schedule.SecondShiftStart &&
    schedule.SecondShiftFinish &&
    schedule.SecondShiftStart > schedule.SecondShiftFinish
  ) {
    return {
      type: "secondEnd",
      message: "*La hora final no puede ser anterior a la hora inicial",
    };
  }

  if (schedule.ThirdShiftFinish === "00:00") {
    return { type: "", message: "Correct" };
  }
  // else if (
  //   schedule.ThirdShiftStart &&
  //   schedule.ThirdShiftFinish &&
  //   schedule.ThirdShiftStart > schedule.ThirdShiftFinish
  // ) {
  //   return "La hora inicial no puede ser mayor a la hora final (Tercer turno)";
  // }

  if (schedule.FirstShiftStart === null || schedule.FirstShiftFinish === null) {
    return {
      type: "required",
      message: "*Debe por lo menos tener un horario de mañana",
    };
  }

  if (
    schedule.SecondShiftStart &&
    schedule.SecondShiftStart < schedule.FirstShiftFinish
  ) {
    return {
      type: "secondStart",
      message:
        "*El horario de comienzo de segundo turno no puede ser menor al cierre del primero",
    };
  }

  if (
    schedule.ThirdShiftStart &&
    schedule.SecondShiftFinish &&
    (schedule.ThirdShiftStart < schedule.SecondShiftFinish ||
      schedule.ThirdShiftStart < schedule.FirstShiftFinish)
  ) {
    return {
      type: "thirdStart",
      message:
        "*El horario de comienzo de turno nocturno no puede ser menor al cierre del segundo o primero",
    };
  }
  if (
    schedule.ThirdShiftStart &&
    (!schedule.ThirdShiftFinish || schedule.ThirdShiftFinish === "23:02")
  ) {
    return {
      type: "thirdFinish",
      message: "*Se debe indicar tanto la hora de apertura como de cierre",
    };
  }

  // if (
  //   schedule.ThirdShiftStart &&
  //   schedule.SecondShiftFinish &&
  //   schedule.ThirdShiftStart < schedule.SecondShiftFinish
  // ) {
  //   return "El horario de comienzo del turno nocturno no puede ser menor al cierre del segundo";
  // }

  return { type: "", message: "Correct" };
}
