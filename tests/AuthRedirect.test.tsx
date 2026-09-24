import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from '../src/components/Toast'
import { LoginPage } from '../src/pages/LoginPage'
import { RegisterPage } from '../src/pages/RegisterPage'

const mockUseAuth = vi.fn()

vi.mock('../src/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

// Rutas mínimas como en AppRouter: el rebote solo se ve cambiando de vista
function renderLogin() {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/tasks" element={<p>Página de tareas</p>} />
        </Routes>
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe('rebote de sesión', () => {
  it('login redirige a tareas si ya hay sesión', () => {
    mockUseAuth.mockReturnValue({
      user: { uid: 'u1', email: 'yo@mail.com' },
      loading: false,
    })
    renderLogin()
    expect(
      screen.queryByRole('heading', { name: 'Iniciar Sesión' }),
    ).not.toBeInTheDocument()
    expect(screen.getByText('Página de tareas')).toBeInTheDocument()
  })

  it('registro redirige a tareas si ya hay sesión', () => {
    mockUseAuth.mockReturnValue({
      user: { uid: 'u1', email: 'yo@mail.com' },
      loading: false,
    })
    render(
      <MemoryRouter initialEntries={['/register']}>
        <ToastProvider>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/tasks" element={<p>Página de tareas</p>} />
          </Routes>
        </ToastProvider>
      </MemoryRouter>,
    )
    expect(
      screen.queryByRole('heading', { name: 'Crear Cuenta' }),
    ).not.toBeInTheDocument()
    expect(screen.getByText('Página de tareas')).toBeInTheDocument()
  })

  it('login muestra el form si no hay sesión', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false })
    renderLogin()
    expect(
      screen.getByRole('heading', { name: 'Iniciar Sesión' }),
    ).toBeInTheDocument()
  })
})
