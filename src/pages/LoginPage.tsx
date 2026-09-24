import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithEmail, loginWithGoogle } from "../features/auth/Authenticator";
import { traducirError, getErrorCode } from "../features/auth/authErrors";
import { validateEmail, validatePassword } from "../utils/validation";
import { PasswordInput } from "../components/PasswordInput";
import { AuthHeader } from "../components/AuthHeader";
import { useToast } from "../components/Toast";
import { FcGoogle } from "react-icons/fc";
import { cardClass, formClass, labelClass, inputClass, primaryBtnClass, dangerBtnClass, errorClass, linkClass } from "../styles/theme";

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
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
            <AuthHeader />
            <div className="flex items-center justify-center px-4 py-8">
            <div className={cardClass}>
                <h1 className="mb-6 text-center text-2xl font-bold text-slate-900 dark:text-white">Iniciar Sesión</h1>
                {error && <div className={errorClass}>{error}</div>}
                <form onSubmit={handleSubmit} className={formClass}>
                    <div>
                        <label className={labelClass}>Email</label>
                        <input type="email" value={email} onChange={(e) => { const v = e.target.value; setEmail(v); if (emailError && !validateEmail(v)) setEmailError(null); }} onBlur={() => setEmailError(validateEmail(email))} required className={inputClass} />
                        {emailError && <p className={errorClass}>{emailError}</p>}
                    </div>
                    <PasswordInput label="Password" value={password} onChange={(v) => { setPassword(v); if (passwordError && !validatePassword(v)) setPasswordError(null); }} error={passwordError} onBlur={() => setPasswordError(validatePassword(password))} />
                    <button type="submit" disabled={loading} className={primaryBtnClass}>{loading ? "Ingresando..." : "Iniciar Sesión"}</button>
                </form>
                <div className="mt-4">
                    <button onClick={handleGoogleLogin} disabled={loading} className={`${dangerBtnClass} flex items-center justify-center gap-2`}><FcGoogle size={20} aria-hidden="true" />Continuar con Google</button>
                </div>
                <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
                    ¿No tenés cuenta? <Link to="/register" className={linkClass}>Registrate</Link>
                </p>
            </div>
            </div>
        </div>
    );
}
