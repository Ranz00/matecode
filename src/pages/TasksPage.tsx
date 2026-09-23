import { logoutUser } from "../features/auth/Authenticator";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { TodoList } from "../components/TodoList";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";

export function TasksPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4 dark:bg-slate-950">
            <header className="mb-8 flex items-center justify-between">
                <Logo />
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <span className="text-sm text-slate-500 dark:text-slate-400">{user?.displayName ?? user?.email}</span>
                    <button onClick={handleLogout} className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700">Cerrar Sesión</button>
                </div>
            </header>
            <main className="mx-auto max-w-2xl">
                <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Mis tareas</h2>
                <TodoList />
            </main>
        </div>
    );
}
