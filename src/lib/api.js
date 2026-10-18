//export const API_URL = "https://darkcat-8gqf.onrender.com"
export const API_URL = "http://localhost:8000"

export const API_VERSION        = `${API_URL}/api/v1`;

export const API_IOC            = `${API_VERSION}/ioc`;
export const API_DASHBOARD      = `${API_VERSION}/dashboard`;
export const API_ACTIVE_GROUPS  = `${API_VERSION}/active/groups`;
export const API_WEB_ANALYZE    = `${API_VERSION}/web/analyzer`;
export const API_AUTH           = `${API_VERSION}/auth`;
export const API_CVE            = `${API_VERSION}/cve/reported`;

export const endpoints = {
  ioc:             `${API_IOC}`,
  iocCountry:      `${API_IOC}/country`,
  iocMalware:      `${API_IOC}/malware`,
  iocType:         `${API_IOC}/type/ioc`,
  threatType:      `${API_IOC}/type/threat`,
  iocDate:         `${API_IOC}/date`,

  activeGroups:    `${API_ACTIVE_GROUPS}`,
  webAnalyze:      `${API_WEB_ANALYZE}`,
  webAnalyzeD:     `${API_WEB_ANALYZE}/domains`,
  
  cveReported:     `${API_CVE}`,
  cveReportedDate: `${API_CVE}/date`,
  cve_cvss3_1:      `${API_CVE}/cvss/3/1`,
  cve_cvss4_0:      `${API_CVE}/cvss/4/0`,

  summary:         `${API_DASHBOARD}`,
  summarySSE:      `${API_DASHBOARD}/sse`,

  authMe:          `${API_AUTH}/me`,
  authLogin:       `${API_AUTH}/token`,
  authLogout:      `${API_AUTH}/logout`,
};