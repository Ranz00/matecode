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
    // Nombre de 2 a 30 letras, con espacios, guion o apóstrofe solo entre palabras
    // Mínimo 2 para no excluir nombres reales cortos como "Li", "Jo" o "Al"
    const trimmed = name.trim();
    if (trimmed.length < 2) return "Ingresá tu nombre (mínimo 2 caracteres)";
    if (trimmed.length > 30) return "Ingresá tu nombre (máximo 30 caracteres)";
    if (!/^[\p{L}\p{M}]+(?:[ '\-][\p{L}\p{M}]+)*$/u.test(trimmed)) {
        return "Solo letras, con un espacio, guion o apóstrofe entre palabras";
    }
    return null;
}

export function validateConfirm(password: string, confirm: string): string | null {
    if (password !== confirm) return "Las contraseñas no coinciden";
    return null;
}
