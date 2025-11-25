"use client"

import { useState, useMemo, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { apiGetOrders } from "@/lib/api"
import type { Order } from "@/lib/types"
import { DollarSign, ShoppingCart, XCircle, TrendingUp, Download } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

export default function ReportesPage() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 7)
    return date.toISOString().split("T")[0]
  })
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0])

  const [orders, setOrders] = useState<Order[]>([])
  useEffect(() => {
    const run = async () => {
      const o = await apiGetOrders()
      setOrders(o)
    }
    void run()
  }, [])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = order.createdAt.split("T")[0]
      return orderDate >= startDate && orderDate <= endDate
    })
  }, [orders, startDate, endDate])

  const completedOrders = filteredOrders.filter((o) => o.status === "entregado" || o.status === "completado")
  const cancelledOrders = filteredOrders.filter((o) => o.status === "cancelado")

  const stats = useMemo(() => {
    const totalSales = completedOrders.reduce((sum, o) => sum + o.total, 0)
    const avgTicket = completedOrders.length > 0 ? totalSales / completedOrders.length : 0

    return {
      totalSales,
      orderCount: completedOrders.length,
      cancelledCount: cancelledOrders.length,
      avgTicket,
    }
  }, [completedOrders, cancelledOrders])

  // Daily sales data
  const dailySalesData = useMemo(() => {
    const salesByDay: Record<string, number> = {}
    completedOrders.forEach((order) => {
      const day = order.createdAt.split("T")[0]
      salesByDay[day] = (salesByDay[day] || 0) + order.total
    })

    return Object.entries(salesByDay)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .map(([date, total]) => ({
        date: new Date(date).toLocaleDateString("es-MX", { weekday: "short", day: "numeric" }),
        total,
      }))
  }, [completedOrders])

  // Products sold data
  const productsSoldData = useMemo(() => {
    const productCounts: Record<string, { name: string; count: number; revenue: number }> = {}

    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productCounts[item.productId]) {
          productCounts[item.productId] = { name: item.productName, count: 0, revenue: 0 }
        }
        productCounts[item.productId].count += item.quantity
        productCounts[item.productId].revenue += item.subtotal
      })
    })

    return Object.values(productCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [completedOrders])

  // Payment method data
  const paymentMethodData = useMemo(() => {
    const cash = completedOrders.filter((o) => o.paymentMethod === "efectivo").length
    const card = completedOrders.filter((o) => o.paymentMethod === "tarjeta").length
    const transfer = completedOrders.filter((o) => o.paymentMethod === "transferencia").length
    return [
      { name: "Efectivo", value: cash },
      { name: "Tarjeta", value: card },
      { name: "Transferencia", value: transfer },
    ]
  }, [completedOrders])

  const COLORS = ["hsl(var(--primary))", "hsl(var(--muted-foreground))", "hsl(var(--accent))"]

  // Employee metrics
  const employeeMetrics = useMemo(() => {
    const map: Record<string, { name: string; orders: number; sales: number; avg: number }> = {}
    completedOrders.forEach((o) => {
      const key = o.userName || "-"
      if (!map[key]) map[key] = { name: key, orders: 0, sales: 0, avg: 0 }
      map[key].orders += 1
      map[key].sales += o.total
    })
    Object.values(map).forEach((m) => {
      m.avg = m.orders > 0 ? m.sales / m.orders : 0
    })
    return Object.values(map).sort((a, b) => b.sales - a.sales)
  }, [completedOrders])

  // Shift metrics
  const getShift = (iso: string) => {
    const h = new Date(iso).getHours()
    if (h >= 6 && h < 14) return "Mañana"
    if (h >= 14 && h < 22) return "Tarde"
    return "Noche"
  }
  const shiftMetrics = useMemo(() => {
    const map: Record<string, { shift: string; orders: number; sales: number; avg: number }> = {}
    completedOrders.forEach((o) => {
      const s = getShift(o.createdAt)
      if (!map[s]) map[s] = { shift: s, orders: 0, sales: 0, avg: 0 }
      map[s].orders += 1
      map[s].sales += o.total
    })
    Object.values(map).forEach((m) => {
      m.avg = m.orders > 0 ? m.sales / m.orders : 0
    })
    return Object.values(map)
  }, [completedOrders])

  const exportToCSV = () => {
    const headers = ["ID", "Fecha", "Cajero", "Total", "Método de Pago", "Estado"]
    const rows = filteredOrders.map((order) => [
      order.id,
      new Date(order.createdAt).toLocaleString("es-MX"),
      order.userName,
      order.total,
      order.paymentMethod,
      order.status,
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `reporte_${startDate}_${endDate}.csv`
    link.click()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reportes</h1>
            <p className="text-muted-foreground">Estadísticas y métricas de ventas</p>
          </div>
          <Button onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Date Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filtrar por Fecha</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="startDate">Desde</Label>
                <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Hasta</Label>
                <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSales.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.orderCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cancelledCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.avgTicket.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Día</CardTitle>
              <CardDescription>Total de ventas diarias en el período seleccionado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {dailySalesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailySalesData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        formatter={(value: number) => [`$${value.toLocaleString()}`, "Ventas"]}
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                      />
                      <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No hay datos para mostrar
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pago</CardTitle>
              <CardDescription>Distribución de pedidos por método de pago</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {paymentMethodData.some((d) => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No hay datos para mostrar
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
            <CardDescription>Los 10 productos con más ventas en el período</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsSoldData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No hay datos para mostrar
                    </TableCell>
                  </TableRow>
                ) : (
                  productsSoldData.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">{product.count}</TableCell>
                      <TableCell className="text-right">${product.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sales by Employee */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Empleado</CardTitle>
            <CardDescription>Pedidos e ingresos por cajero</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead className="text-right">Pedidos</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                  <TableHead className="text-right">Ticket Promedio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeMetrics.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No hay datos para mostrar
                    </TableCell>
                  </TableRow>
                ) : (
                  employeeMetrics.map((m, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell className="text-right">{m.orders}</TableCell>
                      <TableCell className="text-right">${m.sales.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${m.avg.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sales by Shift */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Turno</CardTitle>
            <CardDescription>Distribución por turnos del período</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Turno</TableHead>
                  <TableHead className="text-right">Pedidos</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                  <TableHead className="text-right">Ticket Promedio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shiftMetrics.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No hay datos para mostrar
                    </TableCell>
                  </TableRow>
                ) : (
                  shiftMetrics.map((m, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{m.shift}</TableCell>
                      <TableCell className="text-right">{m.orders}</TableCell>
                      <TableCell className="text-right">${m.sales.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${m.avg.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
