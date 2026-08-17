import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWithEmail, loginWithGoogle } from "../services/auth";
import { traducirError } from "../utils/errors";
import "../styles/pages.css";

export function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) { setError("Las contraseñas no coinciden"); return; }
        setLoading(true);
        try {
            await registerWithEmail(email, password);
            navigate("/tasks");
        } catch (err: any) {
            setError(traducirError(err.code));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        setError("");
        setLoading(true);
        try {
            await loginWithGoogle();
            navigate("/tasks");
        } catch (err: any) {
            setError(traducirError(err.code));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="card">
                <h1 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", marginBottom: "24px" }}>Crear Cuenta</h1>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit} className="form">
                    <div>
                        <label className="label">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" />
                    </div>
                    <div>
                        <label className="label">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input" />
                    </div>
                    <div>
                        <label className="label">Confirmar Password</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="input" />
                    </div>
                    <button type="submit" disabled={loading} className="btn btn-primary">{loading ? "Creando cuenta..." : "Registrarse"}</button>
                </form>
                <div style={{ marginTop: "16px" }}>
                    <button onClick={handleGoogleRegister} disabled={loading} className="btn btn-danger">Continuar con Google</button>
                </div>
                <p style={{ textAlign: "center", marginTop: "16px" }}>
                    ¿Ya tenés cuenta? <Link to="/login" className="link">Iniciá sesión</Link>
                </p>
            </div>
        </div>
    );
}