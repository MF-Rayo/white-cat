const SEVERITIES = {
  CRITICAL: { name: "Critical", color: "var(--danger-color)" },
  HIGH:     { name: "High",     color: "var(--warning-color)" },
  MEDIUM:   { name: "Medium",   color: "var(--info-color)" },
  LOW:      { name: "Low",      color: "var(--success-color)" },
  UNRATED:  { name: "Unrated",  color: "var(--muted)" },
};
const SEVERITY_ORDER = Object.keys(SEVERITIES);

// NVD da las fechas en UTC pero sin la Z final
function toDate(text) {
  return new Date(text.endsWith("Z") ? text : text + "Z");
}

function formatDate(text) {
  return toDate(text).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
}

// Busca el puntaje CVSS. NVD puede traer varias versiones
function getCvss(cve) {
  const versions = ["cvssMetricV40", "cvssMetricV31", "cvssMetricV30", "cvssMetricV2"];

  for (const version of versions) {
    const list = cve.metrics?.[version]; //si no existe devuelve undefined
    if (!list || list.length === 0) continue;

    const metric = list[0];
    const data = metric.cvssData;
    const level = (data.baseSeverity || metric.baseSeverity || "").toUpperCase();

    return {
      severity: SEVERITIES[level] ? level : "UNRATED",
      score: data.baseScore,
      version: data.version,
      vector: data.vectorString,
      attackVector: data.attackVector || data.accessVector || "—",
      exploitability: metric.exploitabilityScore ?? "—",
      impact: metric.impactScore ?? "—",
    };
  }

  return {
    severity: "UNRATED",
    score: null,
    version: null,
    vector: null,
    attackVector: "—",
    exploitability: "—",
    impact: "—",
  };
}

// Lista de debilidades sin repetir ["CWE-79", "CWE-89"]
function getCwes(cve) {
  const result = [];
  for (const weakness of cve.weaknesses || []) {
    for (const item of weakness.description) {
      if (!result.includes(item.value)) result.push(item.value);
    }
  }
  return result;
}

// Convierte un CVE crudo de NVD en un objeto simple con todo lo que necesitamos
function parseCve(item) {
  const cve = item.cve;
  const cvss = getCvss(cve);
  const english = (cve.descriptions || []).find((d) => d.lang === "en");

  return {
    id: cve.id,
    description: english ? english.value : "",
    published: cve.published,
    publishedText: formatDate(cve.published),
    status: cve.vulnStatus,
    cwes: getCwes(cve),
    references: cve.references || [],
    inKev: Boolean(cve.cisaExploitAdd),
    kevDueDate: cve.cisaActionDue,
    severityName: SEVERITIES[cvss.severity].name,
    color: SEVERITIES[cvss.severity].color,
    ...cvss,
  };
}

export function buildStats(raw) {
  //Quedarse solo con los CVEs de hoy
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const cves = [];
  for (const item of raw?.vulnerabilities || []) {
    const cve = parseCve(item);
    if (toDate(cve.published) >= startOfToday) cves.push(cve);
  }

  //Contar cuántos CVEs hay de cada severidad
  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, UNRATED: 0 };
  for (const cve of cves) counts[cve.severity]++;

  //Datos de la dona (y sus colores, en el mismo orden)
  const donut = [];
  const donutColors = [];
  for (const level of SEVERITY_ORDER) {
    if (counts[level] === 0) continue;
    donut.push({ id: level, label: SEVERITIES[level].name, value: counts[level] });
    donutColors.push(SEVERITIES[level].color);
  }

  // Porcentaje de Critical + High
  const scored = cves.length - counts.UNRATED;
  const percent = scored > 0 ? Math.round(((counts.CRITICAL + counts.HIGH) / scored) * 100) : 0;
  const centerValue = scored > 0 ? percent + "%" : "—";

  // Top de CWEs contar cuántas veces aparece cada uno
  const cweCount = {};
  for (const cve of cves) {
    for (const cwe of cve.cwes) {
      cweCount[cwe] = (cweCount[cwe] || 0) + 1;
    }
  }
  const topCwe = Object.entries(cweCount)
    .filter(([name]) => !name.startsWith("NVD-CWE")) // ignorar noinfo u otros
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([cwe, total]) => ({ cwe, total }));

  //Tabla
  const rows = cves.map((cve) => ({
    cve: cve.id,
    severity: cve.severityName,
    cvss: cve.score ?? "—",
    attackVector: cve.attackVector,
    published: cve.publishedText,
  }));

  //Búsqueda por id, para que la fila expandida encuentre los datos completos
  const byId = {};
  for (const cve of cves) byId[cve.id] = cve;

  return { donut, donutColors, centerValue, topCwe, rows, byId };
}