export const API_URL = "https://darkcat-dz0x.onrender.com"
export const API_VERSION = `${API_URL}/api/v1`;

export const API_NEWS = `${API_VERSION}/reported/news`;
export const API_ACTIVE_GROUPS = `${API_VERSION}/active/groups`;
export const API_TREAT = `${API_VERSION}/threat`;
export const API_DASHBOARD = `${API_VERSION}`;
export const API_SANDBOX = `${API_VERSION}/sandbox`;
export const API_AUTH = `${API_VERSION}/auth`;

export const endpoints = {
  summary: `${API_DASHBOARD}/dashboard`,

  news: `${API_NEWS}`,
  newsDates: `${API_NEWS}/dates`,
  newsSources: `${API_NEWS}/sources`,

  activeGroups: `${API_ACTIVE_GROUPS}`,
  activeGroupsDates: `${API_ACTIVE_GROUPS}/dates`,
  activeGroupsGroups: `${API_ACTIVE_GROUPS}/names`,

  threat: `${API_TREAT}`,
  threatDates: `${API_TREAT}/dates`,
  threatCountry: `${API_TREAT}/country`,
  threatName: `${API_TREAT}/name`,

  sandBoxScan: `${API_SANDBOX}`,
  sandBoxDomain: `${API_SANDBOX}/domains`,
  sandBoxPrev: `${API_SANDBOX}/result`,

  checkMail: `${API_VERSION}/check/mail`,

  authLogin: `${API_AUTH}/token`,
  authMe: `${API_AUTH}/me`,
  authLogout: `${API_AUTH}/logout`,
};