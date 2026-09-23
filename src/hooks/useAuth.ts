// Hook para leer el estado de autenticación
// Consume el contexto global, no crea observers propios

import { useAuthContext } from "../features/auth/Authenticator";

export function useAuth() {
    const { user, loading } = useAuthContext();
    return { user, loading };
}