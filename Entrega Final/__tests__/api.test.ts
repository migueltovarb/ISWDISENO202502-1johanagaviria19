import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiGetProducts, apiGetCategories, apiGetOrders, apiLogin, apiCreateOrder } from '@/lib/api'

describe('API client', () => {
  const originalFetch = global.fetch as any

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn((url: string, init?: RequestInit) => {
      if (url.includes('/products')) return Promise.resolve(new Response(JSON.stringify([{ id: '1', name: 'P', price: 1, categoryId: 'c', active: true, createdAt: new Date().toISOString() }])))
      if (url.includes('/categories')) return Promise.resolve(new Response(JSON.stringify([{ id: 'c', name: 'Cat', active: true }])))
      if (url.includes('/orders') && (!init || init.method === 'GET')) return Promise.resolve(new Response(JSON.stringify([])))
      if (url.includes('/auth/login')) return Promise.resolve(new Response(JSON.stringify({ id: '1', username: 'admin', role: 'admin', name: 'Administrador', active: true, createdAt: new Date().toISOString() })))
      if (url.includes('/orders')) return Promise.resolve(new Response(JSON.stringify({ id: 'o1' })))
      return Promise.resolve(new Response('[]'))
    }))
  })

  afterEach(() => {
    vi.stubGlobal('fetch', originalFetch)
  })

  it('gets products', async () => {
    const products = await apiGetProducts()
    expect(products.length).toBeGreaterThan(0)
  })

  it('gets categories', async () => {
    const categories = await apiGetCategories()
    expect(categories.length).toBeGreaterThan(0)
  })

  it('gets orders', async () => {
    const orders = await apiGetOrders()
    expect(Array.isArray(orders)).toBe(true)
  })

  it('logs in via API', async () => {
    const user = await apiLogin('admin', 'admin123')
    expect(user?.username).toBe('admin')
  })

  it('creates order via API', async () => {
    const o = {
      id: Date.now().toString(),
      items: [],
      total: 0,
      paymentMethod: 'efectivo' as const,
      status: 'completado' as const,
      userId: '1',
      userName: 'Administrador',
      createdAt: new Date().toISOString(),
    }
    const saved = await apiCreateOrder(o)
    expect(saved).toBeTruthy()
  })
})