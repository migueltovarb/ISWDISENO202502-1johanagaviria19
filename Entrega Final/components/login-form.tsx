"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UtensilsCrossed } from "lucide-react"

export function LoginForm() {
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const now = Date.now()
    const luRaw = typeof window !== "undefined" ? localStorage.getItem("restaurant_login_lock_until") : null
    const lu = luRaw ? Number.parseInt(luRaw) : 0
    if (lu && now < lu) {
      setLockedUntil(lu)
      setError("Cuenta bloqueada por intentos fallidos. Intenta más tarde.")
      return
    }

    if (!username || !password) {
      setError("Por favor ingresa usuario y contraseña")
      return
    }

    const user = await login(username, password)
    if (!user) {
      setError("Usuario o contraseña incorrectos")
      if (typeof window !== "undefined") {
        const attemptsRaw = localStorage.getItem("restaurant_login_attempts")
        const attempts = attemptsRaw ? Number.parseInt(attemptsRaw) : 0
        const next = attempts + 1
        if (next >= 3) {
          const lockUntil = Date.now() + 5 * 60 * 1000
          localStorage.setItem("restaurant_login_lock_until", String(lockUntil))
          localStorage.setItem("restaurant_login_attempts", "0")
          setLockedUntil(lockUntil)
        } else {
          localStorage.setItem("restaurant_login_attempts", String(next))
        }
      }
    }
    if (user && typeof window !== "undefined") {
      localStorage.removeItem("restaurant_login_lock_until")
      localStorage.removeItem("restaurant_login_attempts")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
            <UtensilsCrossed className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Sistema de Pedidos</CardTitle>
          <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
              />
            </div>
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
            <div className="text-center text-sm text-muted-foreground mt-4">
              {lockedUntil && (
                <p>Bloqueo activo hasta {new Date(lockedUntil).toLocaleTimeString()}</p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
