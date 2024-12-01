import { LocalHours, LocalServiceSchedule } from "../schema/GeneralSchema";

export function scheduleInputValidation(
  schedule: LocalHours | LocalServiceSchedule,
): string | boolean {
  if (
    schedule.FirstShiftStart > schedule.FirstShiftFinish ||
    schedule.SecondShiftStart > schedule.SecondShiftFinish ||
    schedule.ThirdShiftStart < schedule.ThirdShiftFinish
  )
    return "La hora inicial no puede ser mayor a la hora final";

  if (schedule.dayNumber === null || schedule.dayNumber === 0)
    return "El día no puede estar vacío o ser 0";

  if (schedule.FirstShiftStart === null || schedule.FirstShiftStart === null)
    return "Debe por lo menos tener un horario de mañana";

  return "Correct";
}
