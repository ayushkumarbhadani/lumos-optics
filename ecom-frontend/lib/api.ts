export interface User {
  id: number
  email: string
  full_name: string
  role: "admin" | "customer"
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  is_active: boolean
  created_at: string
}

export interface Product {
  id: number
  title: string
  slug: string
  description?: string
  price: number
  stock: number
  sku: string
  image_url?: string | null
  is_active: boolean
  category_id: number
  category?: Category
  created_at: string
  updated_at: string
}

export interface ProductListResponse {
  items: Product[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface CartItem {
  id: number
  user_id: number
  product_id: number
  quantity: number
  subtotal: number
  product: {
    id: number
    title: string
    price: number
    stock: number
    sku: string
    image_url?: string | null
    is_active: boolean
  }
  created_at: string
  updated_at: string
}

export interface CartResponse {
  items: CartItem[]
  total_items: number
  total_amount: number
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  product_title: string
  unit_price: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: number
  order_number: string
  user_id: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  payment_status: "pending" | "paid" | "failed" | "refunded"
  total_amount: number
  shipping_address: string
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export interface OrderListResponse {
  items: Order[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"

// Token Helpers
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}

export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token)
  }
}

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token")
  }
}

// Fetch Wrapper connecting directly to FastAPI backend
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers = new Headers(options.headers || {})
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const url = `${API_BASE_URL}${endpoint}`
  const res = await fetch(url, {
    ...options,
    headers,
  })

  if (!res.ok) {
    let errorDetail = `Request failed (${res.status} ${res.statusText})`
    try {
      const errorData = await res.json()
      if (typeof errorData.detail === "string") {
        errorDetail = errorData.detail
      } else if (Array.isArray(errorData.detail)) {
        errorDetail = errorData.detail.map((d: { msg?: string }) => d.msg).join(", ")
      }
    } catch {
      // Non-JSON response
    }
    throw new Error(errorDetail)
  }

  return res.json()
}
