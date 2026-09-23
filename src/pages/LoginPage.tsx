import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithEmail, loginWithGoogle } from "../features/auth/Authenticator";
import { traducirError, getErrorCode } from "../features/auth/authErrors";
import { validateEmail, validatePassword } from "../utils/validation";
import { PasswordInput } from "../components/PasswordInput";
import { useToast } from "../components/Toast";
import "../styles/pages.css";

export function LoginPage() {
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);
        setEmailError(emailErr);
        setPasswordError(passwordErr);
        if (emailErr || passwordErr) return;
        setLoading(true);
        try {
            await loginWithEmail(email.trim(), password);
            toast("Sesión iniciada, ¡bienvenido!");
            navigate("/tasks");
        } catch (err: unknown) {
            setError(traducirError(getErrorCode(err)));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setLoading(true);
        try {
            await loginWithGoogle();
            toast("Sesión iniciada, ¡bienvenido!");
            navigate("/tasks");
        } catch (err: unknown) {
           setError(traducirError(getErrorCode(err)));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="card">
                <h1 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", marginBottom: "24px" }}>Iniciar Sesión</h1>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit} className="form">
                    <div>
                        <label className="label">Email</label>
                        <input type="email" value={email} onChange={(e) => { const v = e.target.value; setEmail(v); if (emailError && !validateEmail(v)) setEmailError(null); }} onBlur={() => setEmailError(validateEmail(email))} required className="input" />
                        {emailError && <p className="error">{emailError}</p>}
                    </div>
                    <PasswordInput label="Password" value={password} onChange={(v) => { setPassword(v); if (passwordError && !validatePassword(v)) setPasswordError(null); }} error={passwordError} onBlur={() => setPasswordError(validatePassword(password))} />
                    <button type="submit" disabled={loading} className="btn btn-primary">{loading ? "Ingresando..." : "Iniciar Sesión"}</button>
                </form>
                <div style={{ marginTop: "16px" }}>
                    <button onClick={handleGoogleLogin} disabled={loading} className="btn btn-danger">Continuar con Google</button>
                </div>
                <p style={{ textAlign: "center", marginTop: "16px" }}>
                    ¿No tenés cuenta? <Link to="/register" className="link">Registrate</Link>
                </p>
            </div>
        </div>
    );
}