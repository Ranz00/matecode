// Encabezado superior de las páginas de auth
// Marca grande a la izquierda y tema a la derecha, con línea clara debajo

import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function AuthHeader() {
    return (
        <div className="mx-auto w-full max-w-md px-4 pt-6">
            <div className="flex items-center justify-between border-b border-slate-300 pb-4 dark:border-white/20">
                <Logo size="lg" />
                <ThemeToggle />
            </div>
        </div>
    );
}
