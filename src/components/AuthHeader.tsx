// Encabezado superior de las páginas de auth
// Barra a todo ancho, un grado más oscura que la página, con línea completa debajo

import { LogoLink } from "./LogoLink";
import { ThemeToggle } from "./ThemeToggle";

export function AuthHeader() {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-300 bg-slate-200/80 backdrop-blur dark:border-white/20 dark:bg-slate-900/80">
            <div className="flex items-center justify-between px-4 py-3">
                <LogoLink size="lg" />
                <ThemeToggle />
            </div>
        </header>
    );
}
