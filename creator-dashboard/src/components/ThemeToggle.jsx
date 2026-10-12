////////////     لتبديل الـ Dark Mode والـ Light Mode.   ////////////////////   


export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label="تغيير المظهر"
      title="تغيير المظهر"
    >
      {theme === "dark" ? "☀️  Light Mode" : "🌙  Dark Mode"}
    </button>
  );
}
