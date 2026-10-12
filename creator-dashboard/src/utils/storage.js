////////////////////////////////////   ده المسؤول عن حفظ المهام والفيديوهات واسترجاعها من المتصفح  /////////////////////////////////////////////


const STORAGE_KEY = "creator-dashboard-v1";
const THEME_KEY = "creator-dashboard-theme";

export function loadVideos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveVideos(videos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
}

export function loadTheme() {
  return localStorage.getItem(THEME_KEY) || "dark";
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
