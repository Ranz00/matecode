// Logo como inicio según sesión
// Sin login lleva a login, logueado lleva a tareas

import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Logo } from "./Logo";

interface LogoLinkProps {
    size?: "sm" | "md" | "lg";
}

export function LogoLink({ size = "md" }: LogoLinkProps) {
    const { user, loading } = useAuth();
    if (loading) return <Logo size={size} />;
    return (
        <Link to={user ? "/tasks" : "/login"} aria-label="Ir al inicio">
            <Logo size={size} />
        </Link>
    );
}
