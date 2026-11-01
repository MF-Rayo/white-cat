//export const API_URL = "https://darkcat-uddn.onrender.com"
export const API_URL = "http://localhost:8000"

export const API_VERSION        = `${API_URL}/api/v1`;

export const API_IOC            = `${API_VERSION}/ioc`;
export const API_DASHBOARD      = `${API_VERSION}/dashboard`;
export const API_ACTIVE_GROUPS  = `${API_VERSION}/active/groups`;
export const API_CVE            = `${API_VERSION}/cve/reported`;

export const endpoints = {
  ioc:             `${API_IOC}`,
  iocCountry:      `${API_IOC}/country`,
  iocMalware:      `${API_IOC}/malware`,
  iocType:         `${API_IOC}/type`,
  threatType:      `${API_IOC}/threat/types`,
  iocDate:         `${API_IOC}/date`,
  iocStatus:       `${API_IOC}/status`,
  iocHour:         `${API_IOC}/hour`,
  iocConfidence:   `${API_IOC}/confidence/level`,

  activeGroups:    `${API_ACTIVE_GROUPS}`,

  cveReported:     `${API_CVE}`,
  cveReportedDate: `${API_CVE}/date`,
  cve_cvss3_1:      `${API_CVE}/cvss/3/1`,
  cve_cvss4_0:      `${API_CVE}/cvss/4/0`,

  summary:         `${API_DASHBOARD}`,
  summarySSE:      `${API_DASHBOARD}/sse`,
};