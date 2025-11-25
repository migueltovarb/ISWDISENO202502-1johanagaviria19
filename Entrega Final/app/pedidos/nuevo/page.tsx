"use client"

import { useState, useMemo, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { apiGetProducts, apiGetCategories, apiCreateOrder } from "@/lib/api"
import type { Product, OrderItem, Order, Category } from "@/lib/types"
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Check } from "lucide-react"

export default function NuevoPedidoPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [cart, setCart] = useState<OrderItem[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showConfirmCancel, setShowConfirmCancel] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [lastOrder, setLastOrder] = useState<Order | null>(null)

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  useEffect(() => {
    const run = async () => {
      const [p, c] = await Promise.all([apiGetProducts(), apiGetCategories()])
      setProducts(p.filter((x) => x.active))
      setCategories(c.filter((x) => x.active))
    }
    void run()
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || product.categoryId === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, selectedCategory])

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0)
  }, [cart])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id)
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
            : item,
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.price,
          subtotal: product.price,
        },
      ]
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart(
      (prev) =>
        prev
          .map((item) => {
            if (item.productId === productId) {
              const newQuantity = item.quantity + delta
              if (newQuantity <= 0) return null
              return { ...item, quantity: newQuantity, subtotal: newQuantity * item.unitPrice }
            }
            return item
          })
          .filter(Boolean) as OrderItem[],
    )
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }

  const handlePayment = async (method: "efectivo" | "tarjeta" | "transferencia") => {
    const order: Order = {
      id: Date.now().toString(),
      customerId,
      customerName,
      items: cart,
      total: cartTotal,
      paymentMethod: method,
      status: "pendiente",
      userId: user?.id || "",
      userName: user?.name || "",
      createdAt: new Date().toISOString(),
    }
    const saved = await apiCreateOrder(order)
    setLastOrder(saved)
    setCart([])
    setCustomerName("")
    setCustomerId("")
    setShowPaymentDialog(false)
    setShowSuccessDialog(true)
  }

  const printReceipt = () => {
    if (!lastOrder) return
    const w = window.open("", "_blank", "width=400,height=600")
    if (!w) return
    const itemsHtml = lastOrder.items
      .map(i => `<tr><td>${i.productName}</td><td style="text-align:center">${i.quantity}</td><td style="text-align:right">$${i.unitPrice}</td><td style="text-align:right">$${i.subtotal}</td></tr>`)
      .join("")
    w.document.write(`
      <html><head><title>Comprobante ${lastOrder.id}</title>
      <style>body{font-family:Arial;padding:16px} h1{font-size:16px} table{width:100%;border-collapse:collapse} td{padding:4px;border-bottom:1px solid #eee}</style>
      </head><body>
      <h1>Comprobante de Pedido</h1>
      <p><strong>Nº Pedido:</strong> ${lastOrder.id}</p>
      <p><strong>ID Cliente:</strong> ${lastOrder.customerId ?? "-"}</p>
      <p><strong>Cliente:</strong> ${lastOrder.customerName ?? "-"}</p>
      <p><strong>Fecha:</strong> ${new Date(lastOrder.createdAt).toLocaleString()}</p>
      <table><thead><tr><td>Producto</td><td>Cant</td><td>Unit</td><td>Subtotal</td></tr></thead><tbody>
      ${itemsHtml}
      </tbody></table>
      <p style="text-align:right"><strong>Total:</strong> $${lastOrder.total}</p>
      <p><strong>Método de pago:</strong> ${lastOrder.paymentMethod}</p>
      <p><strong>Cajero:</strong> ${lastOrder.userName}</p>
      <script>window.print();</script>
      </body></html>
    `)
    w.document.close()
  }

  const handleCancelOrder = () => {
    setCart([])
    setShowConfirmCancel(false)
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Sin categoría"
  }

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-theme(spacing.12))] gap-6">
        {/* Products Section */}
        <div className="flex-1 flex flex-col">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Nuevo Pedido</h1>
            <p className="text-muted-foreground">Selecciona los productos para el pedido</p>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-80">
              <Input
                placeholder="Nombre del cliente"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div className="w-60">
              <Input
                placeholder="ID del cliente"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => addToCart(product)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-4xl">🍽️</span>
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{getCategoryName(product.categoryId)}</p>
                    <p className="text-lg font-bold text-primary mt-1">${product.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Cart Section */}
        <Card className="w-96 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Pedido Actual</span>
              <Badge variant="secondary">{cart.length} items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 -mx-2 px-2">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No hay productos en el pedido</p>
                  <p className="text-sm">Haz clic en un producto para agregarlo</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">${item.unitPrice} c/u</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-transparent"
                          onClick={() => updateQuantity(item.productId, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-transparent"
                          onClick={() => updateQuantity(item.productId, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="w-16 text-right font-medium text-sm">${item.subtotal}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="mt-4 pt-4 border-t space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${cartTotal.toLocaleString()}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  disabled={cart.length === 0}
                  onClick={() => setShowConfirmCancel(true)}
                >
                  Cancelar
                </Button>
                <Button className="flex-1" disabled={cart.length === 0} onClick={() => setShowPaymentDialog(true)}>
                  Cobrar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Método de Pago</DialogTitle>
            <DialogDescription>Total a cobrar: ${cartTotal.toLocaleString()}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 bg-transparent"
              onClick={() => handlePayment("efectivo")}
            >
              <Banknote className="h-8 w-8" />
              <span>Efectivo</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 bg-transparent"
              onClick={() => handlePayment("tarjeta")}
            >
              <CreditCard className="h-8 w-8" />
              <span>Tarjeta</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 bg-transparent"
              onClick={() => handlePayment("transferencia")}
            >
              <CreditCard className="h-8 w-8" />
              <span>Transferencia</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation */}
      <AlertDialog open={showConfirmCancel} onOpenChange={setShowConfirmCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará todos los productos del pedido actual. ¿Estás seguro?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, continuar</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelOrder}>Sí, cancelar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Pedido Completado
            </DialogTitle>
            <DialogDescription>El pedido ha sido registrado exitosamente.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={printReceipt}>Ver comprobante</Button>
            <Button onClick={() => setShowSuccessDialog(false)}>Continuar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
