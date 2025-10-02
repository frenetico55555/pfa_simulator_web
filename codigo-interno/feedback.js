/* feedback.js - módulo diferido para procesamiento adicional de feedback */
export function postProcessPatient(feedbackText){
  // Ejemplo: limpieza o normalización (placeholder para futura lógica avanzada)
  return feedbackText.trim();
}
export function summarizeTechnical(feedbackText){
  // Placeholder: podría hacer extracción de puntajes o generar resumen JSON
  const match = feedbackText.match(/NIVEL ALCANZADO:\s*(\d+)\/5/);
  return { raw: feedbackText, firstScore: match ? parseInt(match[1]) : null };
}
