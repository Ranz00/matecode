// Validaciones de formularios con mensaje de causa
// Retornan el mensaje o null si el valor es válido

export function validateEmail(email: string): string | null {
    const trimmed = email.trim();
    if (!trimmed) return "Ingresá tu email";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Email inválido, revisá el formato";
    return null;
}

export function validatePassword(password: string): string | null {
    if (!password) return "Ingresá tu contraseña";
    if (password.length < 6) return "Mínimo 6 caracteres";
    return null;
}

export function validateName(name: string): string | null {
    if (name.trim().length < 2) return "Ingresá tu nombre (mínimo 2 caracteres)";
    return null;
}

export function validateConfirm(password: string, confirm: string): string | null {
    if (password !== confirm) return "Las contraseñas no coinciden";
    return null;
}
