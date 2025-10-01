"use client";

import { useTheme } from "../context/ThemeContext";

export default function ThemeToggleButton() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-1 py-1 my-4 rounded-md bg-orange-800 text-white cursor-pointer"
    >
      {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}
