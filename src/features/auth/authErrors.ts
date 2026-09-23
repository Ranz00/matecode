// Traducir códigos de error de Firebase a mensajes legibles

export function traducirError(code: string): string {
    const errores: Record<string, string> = {
        "auth/user-not-found": "No existe una cuenta con este email",
        "auth/wrong-password": "Contraseña incorrecta",
        "auth/email-already-in-use": "Este email ya está registrado",
        "auth/weak-password": "La contraseña debe tener al menos 6 caracteres",
        "auth/invalid-email": "Email no válido",
        "auth/too-many-requests": "Demasiados intentos. Intentá más tarde",
        // Login moderno y ventana de Google
        "auth/invalid-credential": "Credenciales inválidas, revisá tus datos",
        "auth/user-disabled": "Cuenta deshabilitada, contactá al administrador",
        "auth/operation-not-allowed": "Este método de acceso no está habilitado",
        "auth/popup-closed-by-user": "Cerraste la ventana de Google, intentá de nuevo",
        "auth/popup-blocked": "El navegador bloqueó la ventana, permitila e intentá de nuevo",
    };
    return errores[code] || "Error. Intentá de nuevo.";
}

// Helper para acceder a err.code de forma segura sin usar any
export function getErrorCode(err: unknown): string {
    if (err && typeof err === "object" && "code" in err) {
        return (err as { code: string }).code;
    }
    return "unknown";
}