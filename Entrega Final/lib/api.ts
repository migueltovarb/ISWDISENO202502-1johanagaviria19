import type { User, Category, Product, Order } from "./types"

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), 5000)
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    signal: controller.signal,
  })
  clearTimeout(id)
  if (!res.ok) throw new Error(`api_error_${res.status}`)
  if (res.status === 204) {
    return undefined as T
  }
  const text = await res.text()
  if (!text) {
    return undefined as T
  }
  try {
    return JSON.parse(text) as T
  } catch {
    return undefined as T
  }
}

export async function apiLogin(username: string, password: string): Promise<User | null> {
  return await request<User>("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) })
}

export async function apiGetProducts(): Promise<Product[]> {
  return await request<Product[]>("/products", { method: "GET" })
}

export async function apiGetCategories(): Promise<Category[]> {
  return await request<Category[]>("/categories", { method: "GET" })
}

export async function apiGetOrders(): Promise<Order[]> {
  return await request<Order[]>("/orders", { method: "GET" })
}

export async function apiCreateOrder(order: Order): Promise<Order> {
  return await request<Order>("/orders", { method: "POST", body: JSON.stringify(order) })
}

export async function apiUpdateOrder(id: string, order: Order): Promise<Order> {
  return await request<Order>(`/orders/${id}`, { method: "PUT", body: JSON.stringify(order) })
}

export async function apiSaveProduct(product: Product, isEdit: boolean): Promise<Product> {
  if (isEdit) {
    return await request<Product>(`/products/${product.id}`, { method: "PUT", body: JSON.stringify(product) })
  }
  return await request<Product>("/products", { method: "POST", body: JSON.stringify(product) })
}

export async function apiDeleteProduct(id: string): Promise<void> {
  await request<void>(`/products/${id}`, { method: "DELETE" })
}

export async function apiSaveCategory(category: Category, isEdit: boolean): Promise<Category> {
  if (isEdit) {
    return await request<Category>(`/categories/${category.id}`, { method: "PUT", body: JSON.stringify(category) })
  }
  return await request<Category>("/categories", { method: "POST", body: JSON.stringify(category) })
}

export async function apiDeleteCategory(id: string): Promise<void> {
  await request<void>(`/categories/${id}`, { method: "DELETE" })
}

export async function apiGetUsers(): Promise<User[]> {
  return await request<User[]>("/users", { method: "GET" })
}

export async function apiSaveUser(user: User, isEdit: boolean): Promise<User> {
  if (isEdit) {
    return await request<User>(`/users/${user.id}`, { method: "PUT", body: JSON.stringify(user) })
  }
  return await request<User>("/users", { method: "POST", body: JSON.stringify(user) })
}

export async function apiDeleteUser(id: string): Promise<void> {
  await request<void>(`/users/${id}`, { method: "DELETE" })
}

export async function apiSetUserActive(id: string, active: boolean): Promise<User> {
  return await request<User>(`/users/${id}/active`, {
    method: "PATCH",
    body: JSON.stringify({ active }),
  })
}
