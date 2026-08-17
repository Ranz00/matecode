// Ruta que requiere autenticación

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}