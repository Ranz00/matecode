// Página de registro

import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWithEmail, loginWithGoogle } from "../services/auth";
import { traducirError } from "../utils/errors";

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
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Crear Cuenta</h1>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Confirmar Password</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full border rounded px-3 py-2" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                        {loading ? "Creando cuenta..." : "Registrarse"}
                    </button>
                </form>
                <div className="mt-4">
                    <button onClick={handleGoogleRegister} disabled={loading} className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50">
                        Continuar con Google
                    </button>
                </div>
                <p className="text-center mt-4">
                    ¿Ya tenés cuenta? <Link to="/login" className="text-blue-600 hover:underline">Iniciá sesión</Link>
                </p>
            </div>
        </div>
    );
}