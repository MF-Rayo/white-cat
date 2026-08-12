import blueBg from "../assets/bg/blue.webp";
import orangeBg from "../assets/bg/orange.webp";
import greenBg from "../assets/bg/green.webp";
import blackBg from "../assets/bg/black.webp";
import purpleBg from "../assets/bg/purple.webp";

export const themes = {
  blue: {
    "--bar-bg": "#161616",
    "--bg-color": "#050810",
    "--card-bg": "#090b0c5b",
    "--primary-color": "#3066f6",
    "--kitty": "#0f0a1a",
    "--image": `url(${blueBg})`,
  },
  purple: {
    "--bar-bg": "#161616",
    "--bg-color": "#090510",
    "--card-bg": "#090b0c5b",
    "--primary-color": "#6B30F6",
    "--kitty": "#0f0a1a",
    "--image": `url(${purpleBg})`,
  },
  orange: {
    "--bar-bg": "#1a1310",
    "--bg-color": "#100a05",
    "--card-bg": "#0c090752",
    "--primary-color": "#f6752b",
    "--kitty": "#1A130A",
    "--image": `url(${orangeBg})`,
  },
  green: {
    "--bar-bg": "#101613",
    "--bg-color": "#050f08",
    "--card-bg": "#090c0a5b",
    "--primary-color": "#20c96b",
    "--kitty": "#0A1A0A",
    "--image": `url(${greenBg})`,
  },
  black: {
    "--bar-bg": "#0d0d0d",
    "--bg-color": "#000000",
    "--card-bg": "#0a0a0a5b",
    "--primary-color": "#4b5563",
    "--kitty": "#0F0F0F",
    "--image": `url(${blackBg})`,
  },
};

export const applyTheme = (themeName) => {
  const theme = themes[themeName];
  if (!theme) return;

  const root = document.documentElement;
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  localStorage.setItem("app-theme", themeName);
};