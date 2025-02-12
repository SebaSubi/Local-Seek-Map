import { specificDate } from "../constants/consts";
import { LocalSchedule, LocalServiceSchedule } from "../schema/GeneralSchema";

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

export function getPlaceholders(category: string): string {
  // console.log(category);
  switch (category) {
    case "Item Menu":
      return "https://orders.goodthymes.ca/assets/img/goodthymes/default-menu-image-placeholder.png";

    default:
      return "";
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
  if (!firstShiftStart || !firstShiftFinish) {
    return "Se debe completar como minimo el primer turno";
  }
  if (firstShiftStart === specificDate || firstShiftFinish === specificDate) {
    return "Se debe completar como minimo el primer turno";
  } else return "Correct";
}

export function scheduleInputValidation(
  schedule: LocalSchedule | LocalServiceSchedule
): string | boolean {
  // if(schedule.FirstShiftStart === "")
  if (schedule.FirstShiftStart > schedule.FirstShiftFinish) {
    return "La hora inicial no puede ser mayor a la hora final (Primer turno)";
  }

  if (
    schedule.SecondShiftStart &&
    schedule.SecondShiftFinish &&
    schedule.SecondShiftStart > schedule.SecondShiftFinish
  ) {
    return "La hora inicial no puede ser mayor a la hora final (Segundo turno)";
  }

  if (schedule.ThirdShiftFinish === "00:00") {
    return "Correct";
  }
  // else if (
  //   schedule.ThirdShiftStart &&
  //   schedule.ThirdShiftFinish &&
  //   schedule.ThirdShiftStart > schedule.ThirdShiftFinish
  // ) {
  //   return "La hora inicial no puede ser mayor a la hora final (Tercer turno)";
  // }
  if (schedule.dayNumber === null || schedule.dayNumber === 0)
    return "El día no puede estar vacío o ser 0";

  if (schedule.FirstShiftStart === null || schedule.FirstShiftFinish === null)
    return "Debe por lo menos tener un horario de mañana";

  if (
    schedule.SecondShiftStart &&
    schedule.SecondShiftStart < schedule.FirstShiftFinish
  ) {
    return "El horario de comienzo de segundo turno no puede ser menor al cierre del primero";
  }

  if (
    schedule.ThirdShiftStart &&
    schedule.SecondShiftFinish &&
    schedule.ThirdShiftStart < schedule.SecondShiftFinish
  ) {
    return "El horario de comienzo del turno nocturno no puede ser menor al cierre del segundo";
  }

  return "Correct";
}
