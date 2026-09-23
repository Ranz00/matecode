import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWithEmail, loginWithGoogle } from "../features/auth/Authenticator";
import { traducirError, getErrorCode } from "../features/auth/authErrors";
import { validateName, validateEmail, validatePassword, validateConfirm } from "../utils/validation";
import { PasswordInput } from "../components/PasswordInput";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import { useToast } from "../components/Toast";
import { pageClass, cardClass, formClass, labelClass, inputClass, primaryBtnClass, dangerBtnClass, errorClass, linkClass } from "../styles/theme";

export function RegisterPage() {
    const { toast } = useToast();
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
            toast("Cuenta creada, ¡bienvenido!");
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
            toast("Sesión iniciada, ¡bienvenido!");
            navigate("/tasks");
        } catch (err: unknown) {
            setError(traducirError(getErrorCode(err)));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={pageClass}>
            <div className={cardClass}>
                <div className="mb-6 flex items-center justify-between">
                    <Logo size="sm" />
                    <ThemeToggle />
                </div>
                <h1 className="mb-6 text-center text-2xl font-bold text-slate-900 dark:text-white">Crear Cuenta</h1>
                {error && <div className={errorClass}>{error}</div>}
                <form onSubmit={handleSubmit} className={formClass}>
                    <div>
                        <label className={labelClass}>Nombre</label>
                        <input type="text" value={name} onChange={(e) => { const v = e.target.value; setName(v); if (nameError && !validateName(v)) setNameError(null); }} onBlur={() => setNameError(validateName(name))} required className={inputClass} />
                        {nameError && <p className={errorClass}>{nameError}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>Email</label>
                        <input type="email" value={email} onChange={(e) => { const v = e.target.value; setEmail(v); if (emailError && !validateEmail(v)) setEmailError(null); }} onBlur={() => setEmailError(validateEmail(email))} required className={inputClass} />
                        {emailError && <p className={errorClass}>{emailError}</p>}
                    </div>
                    <PasswordInput label="Password" value={password} onChange={(v) => { setPassword(v); if (passwordError && !validatePassword(v)) setPasswordError(null); }} error={passwordError} onBlur={() => setPasswordError(validatePassword(password))} />
                    <PasswordInput label="Confirmar Password" value={confirmPassword} onChange={(v) => { setConfirmPassword(v); if (confirmError && !validateConfirm(password, v)) setConfirmError(null); }} error={confirmError} onBlur={() => setConfirmError(validateConfirm(password, confirmPassword))} />
                    <button type="submit" disabled={loading} className={primaryBtnClass}>{loading ? "Creando cuenta..." : "Registrarse"}</button>
                </form>
                <div className="mt-4">
                    <button onClick={handleGoogleRegister} disabled={loading} className={dangerBtnClass}>Continuar con Google</button>
                </div>
                <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
                    ¿Ya tenés cuenta? <Link to="/login" className={linkClass}>Iniciá sesión</Link>
                </p>
            </div>
        </div>
    );
}
