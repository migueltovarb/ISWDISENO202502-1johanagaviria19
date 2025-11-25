"use client"

import { useState, useMemo, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { apiGetOrders, apiUpdateOrder } from "@/lib/api"
import type { Order } from "@/lib/types"
import { Search, Eye, XCircle } from "lucide-react"

export default function HistorialPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [editData, setEditData] = useState<Order | null>(null)
  useEffect(() => {
    const run = async () => {
      const o = await apiGetOrders()
      setOrders(o)
    }
    void run()
  }, [])

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const matchesSearch =
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (order.customerName ?? "").toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [orders, searchQuery])

  const handleCancelOrder = async () => {
    if (orderToCancel) {
      const updatedOrder = { ...orderToCancel, status: "cancelado" as const }
      await apiUpdateOrder(updatedOrder.id, updatedOrder)
      setOrders(await apiGetOrders())
      setOrderToCancel(null)
    }
  }

  const getStatusBadge = (status: Order["status"]) => {
    const variants = {
      pendiente: "secondary",
      en_preparacion: "secondary",
      listo: "secondary",
      entregado: "default",
      completado: "default",
      cancelado: "destructive",
    } as const
    const labels = {
      pendiente: "Pendiente",
      en_preparacion: "En preparación",
      listo: "Listo",
      entregado: "Entregado",
      completado: "Completado",
      cancelado: "Cancelado",
    }
    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-MX", {
      dateStyle: "short",
      timeStyle: "short",
    })
  }

  const canCancelOrder = (order: Order) => {
    return order.status === "pendiente" && user?.role === "admin"
  }

  const canAdvanceStatus = (order: Order) => {
    return user && (user.role === "admin" || user.role === "cajero")
  }

  const canEditOrder = (order: Order) => {
    return order.status === "pendiente" && user && (user.role === "admin" || user.role === "cajero")
  }

  const nextStatus = (status: Order["status"]) => {
    if (status === "pendiente") return "en_preparacion" as const
    if (status === "en_preparacion") return "listo" as const
    if (status === "listo") return "entregado" as const
    return status
  }

  const handleAdvanceStatus = async (order: Order) => {
    const ns = nextStatus(order.status)
    if (ns !== order.status) {
      const updated = { ...order, status: ns }
      await apiUpdateOrder(order.id, updated)
      setOrders(await apiGetOrders())
    }
  }

  const startEdit = (order: Order) => {
    setEditingOrder(order)
    setEditData({ ...order, items: order.items.map(i => ({ ...i })) })
  }

  const updateItemQty = (productId: string, delta: number) => {
    if (!editData) return
    const items = editData.items
      .map((item) => {
        if (item.productId === productId) {
          const newQty = item.quantity + delta
          if (newQty <= 0) return null as any
          return { ...item, quantity: newQty, subtotal: newQty * item.unitPrice }
        }
        return item
      })
      .filter(Boolean) as Order["items"]
    const newTotal = items.reduce((sum, it) => sum + it.subtotal, 0)
    setEditData({ ...editData, items, total: newTotal })
  }

  const removeItem = (productId: string) => {
    if (!editData) return
    const items = editData.items.filter((i) => i.productId !== productId)
    const newTotal = items.reduce((sum, it) => sum + it.subtotal, 0)
    setEditData({ ...editData, items, total: newTotal })
  }

  const saveEdit = async () => {
    if (!editingOrder || !editData) return
    await apiUpdateOrder(editingOrder.id, editData)
    setOrders(await apiGetOrders())
    setEditingOrder(null)
    setEditData(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Historial de Pedidos</h1>
          <p className="text-muted-foreground">Consulta y administra los pedidos realizados</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pedidos</CardTitle>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID, cliente o cajero..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Cajero</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No se encontraron pedidos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">#{order.id.slice(-6)}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>{order.customerName ?? "-"}</TableCell>
                      <TableCell>{order.userName}</TableCell>
                      <TableCell>{order.items.length}</TableCell>
                      <TableCell className="font-medium">${order.total.toLocaleString()}</TableCell>
                      <TableCell className="capitalize">{order.paymentMethod}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canAdvanceStatus(order) && order.status !== "entregado" && order.status !== "cancelado" && (
                            <Button variant="ghost" size="sm" onClick={() => handleAdvanceStatus(order)}>
                              Avanzar Estado
                            </Button>
                          )}
                          {canEditOrder(order) && (
                            <Button variant="ghost" size="sm" onClick={() => startEdit(order)}>
                              Editar
                            </Button>
                          )}
                          {canCancelOrder(order) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => setOrderToCancel(order)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalle del Pedido #{selectedOrder?.id.slice(-6)}</DialogTitle>
            <DialogDescription>{selectedOrder && formatDate(selectedOrder.createdAt)}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.productName}
                    </span>
                    <span>${item.subtotal}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>${selectedOrder.total.toLocaleString()}</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Cliente: {selectedOrder.customerName ?? "-"}</p>
                <p>Cajero: {selectedOrder.userName}</p>
                <p>Método de pago: {selectedOrder.paymentMethod}</p>
                <p>Estado: {selectedOrder.status}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation */}
      <AlertDialog open={!!orderToCancel} onOpenChange={() => setOrderToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción marcará el pedido #{orderToCancel?.id.slice(-6)} como cancelado. Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, mantener</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelOrder}>Sí, cancelar pedido</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Order Dialog */}
      <Dialog open={!!editingOrder} onOpenChange={() => { setEditingOrder(null); setEditData(null) }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Pedido #{editingOrder?.id.slice(-6)}</DialogTitle>
            <DialogDescription>{editingOrder && formatDate(editingOrder.createdAt)}</DialogDescription>
          </DialogHeader>
          {editData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Nombre del cliente"
                  value={editData.customerName ?? ""}
                  onChange={(e) => setEditData({ ...editData, customerName: e.target.value })}
                />
                <Select
                  value={editData.paymentMethod}
                  onValueChange={(v) => setEditData({ ...editData, paymentMethod: v as Order["paymentMethod"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                {editData.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="truncate mr-2">{item.productName}</span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => updateItemQty(item.productId, -1)}>-</Button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => updateItemQty(item.productId, 1)}>+</Button>
                      <Button variant="ghost" size="sm" onClick={() => removeItem(item.productId)}>Quitar</Button>
                      <span className="w-20 text-right">${item.subtotal}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>${editData.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setEditingOrder(null); setEditData(null) }}>Cancelar</Button>
                <Button onClick={saveEdit}>Guardar Cambios</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
