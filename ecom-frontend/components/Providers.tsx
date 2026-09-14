"use client"

import * as React from "react"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import { CartProvider, useCart } from "@/context/CartContext"
import { Toaster } from "sonner"
import { CartSheet } from "@/components/CartSheet"
import { CheckoutModal } from "@/components/CheckoutModal"
import { AuthModal } from "@/components/AuthModal"

function GlobalModals() {
  const { isCheckoutOpen, setIsCheckoutOpen } = useCart()
  const { isAuthModalOpen, setIsAuthModalOpen } = useAuth()

  return (
    <>
      <CartSheet />
      <CheckoutModal open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen} />
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </>
  )
}

function ResponsiveToaster() {
  const { isCartOpen } = useCart()

  return (
    <Toaster
      position="top-right"
      richColors
      className={
        isCartOpen
          ? "max-sm:translate-x-0! sm:-translate-x-105! transition-transform duration-300 ease-out"
          : "transition-transform duration-300 ease-out"
      }
    />
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <GlobalModals />
        <ResponsiveToaster />
      </CartProvider>
    </AuthProvider>
  )
}
