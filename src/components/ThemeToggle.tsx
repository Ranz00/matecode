// Botón para alternar tema claro y oscuro
// Iconos sol y luna en SVG, sin dependencias

import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const dark = theme === "dark";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
            title={dark ? "Tema claro" : "Tema oscuro"}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
        >
            {dark ? <FiSun size={20} aria-hidden="true" /> : <FiMoon size={20} aria-hidden="true" />}
        </button>
    );
}
