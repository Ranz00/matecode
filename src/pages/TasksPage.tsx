import { logoutUser } from "../features/auth/Authenticator";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { TodoList } from "../components/TodoList";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
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
                <Logo />
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <ThemeToggle />
                    <span style={{ fontSize: "14px", color: "#6b7280" }}>{user?.displayName ?? user?.email}</span>
                    <button onClick={handleLogout} className="btn btn-danger" style={{ width: "auto" }}>Cerrar Sesión</button>
                </div>
            </header>
            <main style={{ maxWidth: "600px", margin: "0 auto" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>Mis tareas</h2>
                <TodoList />
            </main>
        </div>
    );
}