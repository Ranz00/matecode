import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWithEmail, loginWithGoogle } from "../features/auth/Authenticator";
import { traducirError, getErrorCode } from "../features/auth/authErrors";
import { validateName, validateEmail, validatePassword, validateConfirm } from "../utils/validation";
import { PasswordInput } from "../components/PasswordInput";
import "../styles/pages.css";

export function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nameError, setNameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmError, setConfirmError] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        const nameErr = validateName(name);
        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);
        const confirmErr = validateConfirm(password, confirmPassword);
        setNameError(nameErr);
        setEmailError(emailErr);
        setPasswordError(passwordErr);
        setConfirmError(confirmErr);
        if (nameErr || emailErr || passwordErr || confirmErr) return;
        setLoading(true);
        try {
            await registerWithEmail(name.trim(), email.trim(), password);
            navigate("/tasks");
       } catch (err: unknown) {
           setError(traducirError(getErrorCode(err)));
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
       } catch (err: unknown) {
           setError(traducirError(getErrorCode(err)));
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
                        <label className="label">Nombre</label>
                        <input type="text" value={name} onChange={(e) => { const v = e.target.value; setName(v); if (nameError && !validateName(v)) setNameError(null); }} onBlur={() => setNameError(validateName(name))} required className="input" />
                        {nameError && <p className="error">{nameError}</p>}
                    </div>
                    <div>
                        <label className="label">Email</label>
                        <input type="email" value={email} onChange={(e) => { const v = e.target.value; setEmail(v); if (emailError && !validateEmail(v)) setEmailError(null); }} onBlur={() => setEmailError(validateEmail(email))} required className="input" />
                        {emailError && <p className="error">{emailError}</p>}
                    </div>
                    <PasswordInput label="Password" value={password} onChange={(v) => { setPassword(v); if (passwordError && !validatePassword(v)) setPasswordError(null); }} error={passwordError} onBlur={() => setPasswordError(validatePassword(password))} />
                    <PasswordInput label="Confirmar Password" value={confirmPassword} onChange={(v) => { setConfirmPassword(v); if (confirmError && !validateConfirm(password, v)) setConfirmError(null); }} error={confirmError} onBlur={() => setConfirmError(validateConfirm(password, confirmPassword))} />
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