/* Charts module (lazy-loaded) */
// Carga perezosa de Chart.js y render de gráficos radar

function ensureChartsLibrary() {
  if (window.Chart) return Promise.resolve();
  if (ensureChartsLibrary._p) return ensureChartsLibrary._p;
  ensureChartsLibrary._p = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Fallo al cargar Chart.js'));
    document.head.appendChild(script);
  });
  return ensureChartsLibrary._p;
}

function createRadarChart(canvasId, label, labels, data, color) {
  const el = document.getElementById(canvasId);
  if (!el) return;
  const ctx = el.getContext('2d');
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: color.bg,
        borderColor: color.border,
        borderWidth: 2
      }]
    },
    options: {
      scales: { r: { beginAtZero: true, max: 5, ticks: { stepSize: 1 } } },
      plugins: { legend: { display: false } }
    }
  });
}

export async function renderCharts(sim) {
  await ensureChartsLibrary();
  createRadarChart(
    'patientChart',
    'Evaluación del Paciente',
    ['Empatía', 'Respeto', 'Comunicación', 'Escucha', 'Seguridad', 'Comodidad'],
    sim.getPatientValues(),
    { bg: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' }
  );
  createRadarChart(
    'technicalChart',
    'Evaluación Técnica',
    ['Escucha Activa', 'Reentrenamiento Respiratorio', 'Clasificación Necesidades', 'Derivación Redes', 'Psicoeducación'],
    sim.getTechnicalValues(),
    { bg: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' }
  );
}
