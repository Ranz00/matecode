import { logoutUser } from "../services/auth";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../styles/pages.css";

export function TasksPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate("/login");
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "16px" }}>
            <header className="tasks-header">
                <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>MateCode - Mis Tareas</h1>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ fontSize: "14px", color: "#6b7280" }}>{user?.email}</span>
                    <button onClick={handleLogout} className="btn btn-danger" style={{ width: "auto" }}>Cerrar Sesión</button>
                </div>
            </header>
            <main><p>Las tareas se implementarán en el Hito 6.</p></main>
        </div>
    );
}