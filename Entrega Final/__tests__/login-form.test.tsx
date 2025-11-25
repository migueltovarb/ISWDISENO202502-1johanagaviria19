import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from '@/components/login-form'
import { AuthProvider } from '@/components/auth-provider'

describe('LoginForm', () => {
  const originalFetch = global.fetch as any

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response(JSON.stringify({ id: '1', username: 'admin', role: 'admin', name: 'Administrador', active: true, createdAt: new Date().toISOString() })))))
  })

  afterEach(() => {
    vi.stubGlobal('fetch', originalFetch)
  })

  it('shows error if fields are empty', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    )
    const submit = screen.getByRole('button', { name: /iniciar sesión/i })
    fireEvent.click(submit)
    expect(await screen.findByText(/Por favor ingresa usuario y contraseña/i)).toBeInTheDocument()
  })

  it('logs in via API', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    )
    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'admin' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'admin123' } })
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    const error = screen.queryByText(/Usuario o contraseña incorrectos/i)
    expect(error).toBeNull()
  })
})