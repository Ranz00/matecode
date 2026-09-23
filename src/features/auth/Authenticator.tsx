// Estado global de autenticación
// Un solo observer de Firebase compartido por toda la app

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth } from '../../services/firebase'

// Valor compartido por el contexto de autenticación
interface AuthContextValue {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

// Acceso al contexto, solo dentro del provider
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <Authenticator>')
  }
  return context
}

const googleProvider = new GoogleAuthProvider()

// Registro con nombre visible en el perfil
export const registerWithEmail = async (name: string, email: string, password: string) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName: name })
  return credential
}

export const loginWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password)

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider)

export const logoutUser = () => signOut(auth)

// Provider con el único observer de sesión de la app
export function Authenticator({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}
