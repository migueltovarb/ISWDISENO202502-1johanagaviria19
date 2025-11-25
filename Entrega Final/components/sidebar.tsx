"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "./auth-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UtensilsCrossed, ShoppingCart, Package, FolderTree, Users, BarChart3, LogOut } from "lucide-react"

const navigation = [
  { name: "Nuevo Pedido", href: "/pedidos/nuevo", icon: ShoppingCart, roles: ["admin", "cajero"] },
  { name: "Historial", href: "/pedidos/historial", icon: Package, roles: ["admin", "cajero"] },
  { name: "Productos", href: "/productos", icon: Package, roles: ["admin"] },
  { name: "Usuarios", href: "/usuarios", icon: Users, roles: ["admin"] },
  { name: "Reportes", href: "/reportes", icon: BarChart3, roles: ["admin"] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const filteredNavigation = navigation.filter((item) => user && item.roles.includes(user.role))

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <UtensilsCrossed className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg">CafeteriaCata</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <div className="mb-3 px-3">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
        </div>
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={logout}>
          <LogOut className="h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
