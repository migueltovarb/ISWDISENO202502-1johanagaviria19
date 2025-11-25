export interface User {
  id: string
  username: string
  password: string
  role: "admin" | "cajero"
  name: string
  active: boolean
  createdAt: string
}

export interface Category {
  id: string
  name: string
  active: boolean
}

export interface Product {
  id: string
  name: string
  price: number
  categoryId: string
  active: boolean
  createdAt: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: string
  customerId?: string
  customerName?: string
  items: OrderItem[]
  total: number
  paymentMethod: "efectivo" | "tarjeta" | "transferencia"
  status: "pendiente" | "en_preparacion" | "listo" | "entregado" | "completado" | "cancelado"
  userId: string
  userName: string
  createdAt: string
}

export interface DailySummary {
  date: string
  totalSales: number
  orderCount: number
  cancelledCount: number
}
