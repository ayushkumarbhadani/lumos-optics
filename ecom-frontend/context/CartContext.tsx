"use client"

import * as React from "react"
import { CartItem, Product, Order, apiFetch, CartResponse, OrderListResponse } from "@/lib/api"
import { useAuth } from "./AuthContext"

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  isCheckoutOpen: boolean
  setIsCheckoutOpen: (open: boolean) => void
  addToCart: (product: Product, quantity?: number) => Promise<{ success: boolean; message?: string }>
  updateQuantity: (productId: number, quantity: number) => Promise<{ success: boolean; message?: string }>
  removeFromCart: (productId: number) => Promise<void>
  clearCart: () => Promise<void>
  checkout: (shippingAddress: string) => Promise<{ success: boolean; order?: Order; message?: string }>
  orders: Order[]
  refreshOrders: () => Promise<void>
  refreshCart: () => Promise<void>
  cancelOrder: (orderId: number) => Promise<{ success: boolean; message?: string }>
  updateOrderStatus: (orderId: number, status: Order["status"]) => Promise<{ success: boolean; message?: string }>
}

const CartContext = React.createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = React.useState<CartItem[]>([])
  const [totalItems, setTotalItems] = React.useState(0)
  const [totalAmount, setTotalAmount] = React.useState(0)
  const [isCartOpen, setIsCartOpen] = React.useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false)
  const [orders, setOrders] = React.useState<Order[]>([])

  const fetchCart = React.useCallback(async () => {
    if (!isAuthenticated) {
      setItems([])
      setTotalItems(0)
      setTotalAmount(0)
      return
    }
    try {
      const data = await apiFetch<CartResponse>("/cart/")
      setItems(data.items || [])
      setTotalItems(data.total_items || 0)
      setTotalAmount(data.total_amount || 0)
    } catch {
      setItems([])
      setTotalItems(0)
      setTotalAmount(0)
    }
  }, [isAuthenticated])

  const fetchOrders = React.useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([])
      return
    }
    try {
      const data = await apiFetch<OrderListResponse>("/orders/")
      setOrders(data.items || [])
    } catch {
      setOrders([])
    }
  }, [isAuthenticated])

  React.useEffect(() => {
    fetchCart()
    fetchOrders()
  }, [fetchCart, fetchOrders])

  const addToCart = async (product: Product, quantity = 1) => {
    if (!isAuthenticated) {
      return {
        success: false,
        message: "Please sign in to add items to your shopping cart.",
      }
    }

    try {
      await apiFetch("/cart/items", {
        method: "POST",
        body: JSON.stringify({ product_id: product.id, quantity }),
      })
      await fetchCart()
      setIsCartOpen(true)
      return { success: true }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add item to cart"
      return { success: false, message: msg }
    }
  }

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId)
      return { success: true }
    }

    try {
      await apiFetch(`/cart/items/${productId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      })
      await fetchCart()
      return { success: true }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update quantity"
      return { success: false, message: msg }
    }
  }

  const removeFromCart = async (productId: number) => {
    try {
      await apiFetch(`/cart/items/${productId}`, { method: "DELETE" })
      await fetchCart()
    } catch {
      // Ignored
    }
  }

  const clearCart = async () => {
    try {
      await apiFetch("/cart/", { method: "DELETE" })
      setItems([])
      setTotalItems(0)
      setTotalAmount(0)
    } catch {
      // Ignored
    }
  }

  const checkout = async (shippingAddress: string) => {
    try {
      const order = await apiFetch<Order>("/orders/checkout", {
        method: "POST",
        body: JSON.stringify({ shipping_address: shippingAddress }),
      })
      await fetchCart()
      await fetchOrders()
      return { success: true, order }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Checkout failed"
      return { success: false, message: msg }
    }
  }

  const cancelOrder = async (orderId: number) => {
    try {
      await apiFetch<Order>(`/orders/${orderId}/cancel`, { method: "POST" })
      await fetchOrders()
      await fetchCart()
      return { success: true }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Cancellation failed"
      return { success: false, message: msg }
    }
  }

  const updateOrderStatus = async (orderId: number, status: Order["status"]) => {
    try {
      await apiFetch<Order>(`/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      })
      await fetchOrders()
      return { success: true }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update order status"
      return { success: false, message: msg }
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        checkout,
        orders,
        refreshOrders: fetchOrders,
        refreshCart: fetchCart,
        cancelOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = React.useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
