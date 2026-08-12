export const API_URL = import.meta.env.VITE_API_URL;

export const endpoints = {
  news: `${API_URL}/news`,
  newsDates: `${API_URL}/news/dates`,
  newsSources: `${API_URL}/news/sources`,

  activeGroups: `${API_URL}/activegroups`,
  activeGroupsDates: `${API_URL}/activegroups/dates`,
  activeGroupsGroups: `${API_URL}/activegroups/groupname`,

  ioc: `${API_URL}/ioc`,
  iocDates: `${API_URL}/ioc/dates`,
  iocCountry: `${API_URL}/ioc/countries`,

  summary: `${API_URL}/summary`,
};