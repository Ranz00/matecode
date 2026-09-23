// Encabezado de las cards de auth
// Marca a la izquierda y tema a la derecha, con línea separadora sutil

import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function AuthHeader() {
    return (
        <header className="mb-6 border-b border-slate-200 pb-4 dark:border-slate-800">
            <div className="flex items-center justify-between">
                <Logo size="sm" />
                <ThemeToggle />
            </div>
        </header>
    );
}
