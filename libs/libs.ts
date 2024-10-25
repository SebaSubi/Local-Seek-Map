import { LocalHours } from "../schema/GeneralSchema";

export function scheduleInputValidation(
  schedule: LocalHours
): string | boolean {
  if (
    schedule.AMHourFrom > schedule.AMHourTo ||
    schedule.PMHourFrom > schedule.PMHourTo ||
    schedule.PMHourFrom < schedule.AMHourTo
  )
    return "La hora inicial no puede ser mayor a la hora final";

  if (schedule.dayNumber === null || schedule.dayNumber === 0)
    return "El día no puede estar vacío o ser 0";

  if (schedule.AMHourFrom === null || schedule.AMHourTo === null)
    return "Debe por lo menos tener un horario de mañana";

  return "Correct";
}
