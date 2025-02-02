import { LocalSchedule, LocalServiceSchedule } from "../schema/GeneralSchema";

export function scheduleInputValidation(
  schedule: LocalSchedule | LocalServiceSchedule
): string | boolean {
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
  } else if (
    schedule.ThirdShiftStart &&
    schedule.ThirdShiftFinish &&
    schedule.ThirdShiftStart > schedule.ThirdShiftFinish
  ) {
    return "La hora inicial no puede ser mayor a la hora final (Tercer turno)";
  }
  if (schedule.dayNumber === null || schedule.dayNumber === 0)
    return "El día no puede estar vacío o ser 0";

  if (schedule.FirstShiftStart === null || schedule.FirstShiftStart === null)
    return "Debe por lo menos tener un horario de mañana";

  return "Correct";
}
