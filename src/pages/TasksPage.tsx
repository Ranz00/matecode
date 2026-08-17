// Página de tareas (placeholder)

import { logoutUser } from "../services/auth";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function TasksPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">MateCode - Mis Tareas</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{user?.email}</span>
                    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Cerrar Sesión
                    </button>
                </div>
            </header>
            <main><p>Las tareas se implementarán en el Hito 6.</p></main>
        </div>
    );
}