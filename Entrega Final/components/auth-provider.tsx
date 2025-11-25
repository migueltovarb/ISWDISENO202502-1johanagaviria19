"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from "@/lib/types"
import { apiLogin } from "@/lib/api"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<User | null>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const TIMEOUT_MS = 30 * 60 * 1000

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("restaurant_current_user") : null
    const currentUser = raw ? (JSON.parse(raw) as User) : null
    setUser(currentUser)
    setLoading(false)

    const updateActivity = () => {
      if (typeof window !== "undefined") {
        localStorage.setItem("restaurant_session_last_activity", String(Date.now()))
      }
    }
    const checkTimeout = () => {
      if (typeof window === "undefined") return
      const lastRaw = localStorage.getItem("restaurant_session_last_activity")
      const last = lastRaw ? Number.parseInt(lastRaw) : Date.now()
      const now = Date.now()
      if (user && now - last >= TIMEOUT_MS) {
        localStorage.removeItem("restaurant_current_user")
        localStorage.removeItem("restaurant_session_last_activity")
        setUser(null)
      }
    }
    if (typeof window !== "undefined") {
      updateActivity()
      const interval = setInterval(checkTimeout, 15000)
      window.addEventListener("click", updateActivity)
      window.addEventListener("keydown", updateActivity)
      window.addEventListener("mousemove", updateActivity)
      return () => {
        clearInterval(interval)
        window.removeEventListener("click", updateActivity)
        window.removeEventListener("keydown", updateActivity)
        window.removeEventListener("mousemove", updateActivity)
      }
    }
  }, [])

  const login = async (username: string, password: string) => {
    const loggedUser = await apiLogin(username, password)
    if (loggedUser && typeof window !== "undefined") {
      localStorage.setItem("restaurant_current_user", JSON.stringify(loggedUser))
      localStorage.setItem("restaurant_session_last_activity", String(Date.now()))
    }
    setUser(loggedUser)
    return loggedUser
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("restaurant_current_user")
    }
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
