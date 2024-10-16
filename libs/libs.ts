import { LocalHours } from "../schema/GeneralSchema";

export function scheduleInputValidation(
  schedule: LocalHours,
): string | boolean {
  if (
    schedule.AMHourFrom > schedule.AMHourTo ||
    schedule.PMHourFrom > schedule.PMHourTo ||
    schedule.PMHourFrom < schedule.PMHourTo
  )
    return "La hora inicial no puede ser mayor a la hora final";

  if (
    !schedule.AMHourFrom.includes(":") ||
    !schedule.AMHourTo.includes(":") ||
    !schedule.PMHourFrom.includes(":") ||
    !schedule.PMHourTo.includes(":")
  )
    return "Las horas deben tener el siguiente formato: ";
}
