import { logoutUser } from "../features/auth/Authenticator";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { TodoList } from "../components/TodoList";
import { FiLogOut } from "react-icons/fi";
import { LogoLink } from "../components/LogoLink";
import { ThemeToggle } from "../components/ThemeToggle";

export function TasksPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
            <header className="sticky top-0 z-40 w-full border-b border-slate-300 bg-slate-200/80 backdrop-blur dark:border-white/20 dark:bg-slate-900/80">
                <div className="flex items-center justify-between px-4 py-3">
                    <LogoLink />
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <span className="text-sm text-slate-500 dark:text-slate-400">{user?.displayName ?? user?.email}</span>
                        <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg border border-red-500/60 bg-transparent px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500/10 dark:text-red-400">Cerrar Sesión<FiLogOut size={16} aria-hidden="true" /></button>
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-2xl px-4 py-8">
                <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Mis tareas</h2>
                <TodoList />
            </main>
        </div>
    );
}
