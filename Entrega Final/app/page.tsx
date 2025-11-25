"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiGetOrders, apiGetProducts, apiGetCategories } from "@/lib/api"
import type { Order, Product, Category } from "@/lib/types"
import { ShoppingCart, Package, DollarSign, TrendingUp } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (user && user.role === "cajero") {
      router.push("/pedidos/nuevo")
    }
  }, [user, router])

  useEffect(() => {
    const run = async () => {
      const [o, p, c] = await Promise.all([apiGetOrders(), apiGetProducts(), apiGetCategories()])
      setOrders(o)
      setProducts(p)
      setCategories(c)
    }
    void run()
  }, [])

  const today = new Date().toISOString().split("T")[0]
  const { todayOrders, todaySales } = useMemo(() => {
    const tos = orders.filter((o) => o.createdAt?.startsWith(today) && o.status === "completado")
    const ts = tos.reduce((sum, o) => sum + o.total, 0)
    return { todayOrders: tos, todaySales: ts }
  }, [orders, today])

  const stats = [
    {
      title: "Ventas de Hoy",
      value: `$${todaySales.toLocaleString()}`,
      icon: DollarSign,
      description: `${todayOrders.length} pedidos completados`,
    },
    {
      title: "Pedidos Totales",
      value: orders.length,
      icon: ShoppingCart,
      description: "Todos los pedidos",
    },
    {
      title: "Productos Activos",
      value: products.filter((p) => p.active).length,
      icon: Package,
      description: `de ${products.length} productos`,
    },
    {
      title: "Categorías",
      value: categories.filter((c) => c.active).length,
      icon: TrendingUp,
      description: "Categorías activas",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido al sistema de gestión de pedidos</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acceso Rápido</CardTitle>
          <CardDescription>Accede a las funciones principales del sistema</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <a
              href="/pedidos/nuevo"
              className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted transition-colors"
            >
              <ShoppingCart className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Nuevo Pedido</h3>
                <p className="text-sm text-muted-foreground">Crear un nuevo pedido</p>
              </div>
            </a>
            <a
              href="/pedidos/historial"
              className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted transition-colors"
            >
              <Package className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Historial</h3>
                <p className="text-sm text-muted-foreground">Ver pedidos anteriores</p>
              </div>
            </a>
            <a
              href="/reportes"
              className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted transition-colors"
            >
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Reportes</h3>
                <p className="text-sm text-muted-foreground">Ver estadísticas</p>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
