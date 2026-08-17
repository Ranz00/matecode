// Ruta que requiere autenticación

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p>Cargando...</p></div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}