export const API_URL = "https://darkcat-8gqf.onrender.com"
//export const API_URL = "http://localhost:8000"

export const API_VERSION        = `${API_URL}/api/v1`;

export const API_IOC            = `${API_VERSION}/ioc`;
export const API_DASHBOARD      = `${API_VERSION}/dashboard`;
export const API_ACTIVE_GROUPS  = `${API_VERSION}/active/groups`;
export const API_WEB_ANALYZE    = `${API_VERSION}/web/analyzer`;
export const API_LEAK_CHECK     = `${API_VERSION}/leak/checker`;
export const API_AUTH           = `${API_VERSION}/auth`;
export const API_CVE            = `${API_VERSION}/cve/reported`;

export const endpoints = {
  ioc:          `${API_IOC}`,
  iocCountry:   `${API_IOC}/country`,
  iocMalware:   `${API_IOC}/malware`,
  iocDate:      `${API_IOC}/date`,

  activeGroups: `${API_ACTIVE_GROUPS}`,
  webAnalyze:   `${API_WEB_ANALYZE}`,
  webAnalyzeD:  `${API_WEB_ANALYZE}/domains`,

  leakCheker:   `${API_LEAK_CHECK}/`,
  cveReported:  `${API_CVE}`,

  summary:      `${API_DASHBOARD}`,
  summarySSE:   `${API_DASHBOARD}/sse`,

  authMe: `${API_AUTH}/me`,
  authLogin: `${API_AUTH}/token`,
  authLogout: `${API_AUTH}/logout`,
};