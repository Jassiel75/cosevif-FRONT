// Modelo para la entidad Visit con los nuevos estados
export const VISIT_STATUS = {
  PENDING: "PENDIENTE", // Visita programada pero aún no es hora
  IN_PROGRESS: "EN_PROGRESO", // Visita en curso
  COMPLETED: "COMPLETADO", // Visita finalizada correctamente
  EXPIRED: "CADUCADO", // Visita caducada (pasaron 2 horas y no llegó)
  CANCELLED: "CANCELADO", // Visita cancelada por el residente
}

// Modificar las funciones para manejar correctamente la zona horaria
export function shouldShowQR(visitDateTime) {
  if (!visitDateTime) return false

  const visitDate = new Date(visitDateTime)
  const now = new Date()

  // Calcular la diferencia en milisegundos
  const diffMs = visitDate.getTime() - now.getTime()

  // Convertir a horas
  const diffHours = diffMs / (1000 * 60 * 60)

  // Mostrar QR si falta una hora o menos para la visita
  return diffHours <= 1 && diffHours > -2
}

export function determineVisitStatus(visit) {
  if (!visit || !visit.dateTime) return VISIT_STATUS.PENDING

  // Si ya está cancelada, mantener ese estado
  if (visit.status === VISIT_STATUS.CANCELLED) return VISIT_STATUS.CANCELLED

  const visitDate = new Date(visit.dateTime)
  const now = new Date()

  // Calcular la diferencia en milisegundos
  const diffMs = visitDate.getTime() - now.getTime()

  // Convertir a horas
  const diffHours = diffMs / (1000 * 60 * 60)

  if (diffHours > 1) {
    // La visita aún no ha comenzado
    return VISIT_STATUS.PENDING
  } else if (diffHours >= -2) {
    // La visita está en progreso (desde 1 hora antes hasta 2 horas después)
    return VISIT_STATUS.IN_PROGRESS
  } else {
    // Han pasado más de 2 horas desde la hora programada
    return VISIT_STATUS.EXPIRED
  }
}

// Función para generar un enlace de registro único para la visita
export function generateRegistrationLink(visitId) {
  const baseUrl = window.location.origin
  const uniqueToken = btoa(`visit_${visitId}_${Date.now()}`) // Codificación simple
  return `${baseUrl}/register-visit/${visitId}/${uniqueToken}`
}

