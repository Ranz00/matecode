// Traducir códigos de error de Firebase a mensajes legibles

export function traducirError(code: string): string {
    const errores: Record<string, string> = {
        "auth/user-not-found": "No existe una cuenta con este email",
        "auth/wrong-password": "Contraseña incorrecta",
        "auth/email-already-in-use": "Este email ya está registrado",
        "auth/weak-password": "La contraseña debe tener al menos 6 caracteres",
        "auth/invalid-email": "Email no válido",
        "auth/too-many-requests": "Demasiados intentos. Intentá más tarde",
    };
    return errores[code] || "Error. Intentá de nuevo.";
}