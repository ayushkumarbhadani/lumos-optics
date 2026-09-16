"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShieldCheck, Package, ArrowRight, UserCheck, LogIn, Glasses } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { OrdersView } from "@/components/OrdersView"

export default function OrdersPage() {
  const router = useRouter()
  const { user, isAdmin, isAuthenticated, isLoading, setIsAuthModalOpen } = useAuth()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
        <p className="text-xs text-muted-foreground font-mono">Synchronizing Lumos Member Profile...</p>
      </div>
    )
  }

  // Admin Guard: Admins don't have personal customer orders here; they manage store orders in /admin
  if (isAdmin) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-16 max-w-2xl text-left">
        <Card className="rounded-3xl border border-border/80 shadow-md overflow-hidden">
          <CardHeader className="bg-primary/5 p-8 border-b border-border/60">
            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <ShieldCheck className="size-6" />
            </div>
            <CardTitle className="text-2xl font-heading">
              Staff Administrator Notice
            </CardTitle>
            <CardDescription className="text-sm">
              You are authenticated as <strong>{user?.full_name}</strong> (Staff Role: <code>{user?.role}</code>).
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed font-light">
              The <strong>My Orders</strong> screen is reserved for client personal purchases. As a staff administrator, order fulfillment, status updates (Mark Shipped, Mark Delivered), stock replenishment, and all storewide client transactions are managed in the <strong>Admin Portal</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={() => router.push("/admin")}
                className="rounded-xl px-6 cursor-pointer"
                size="lg"
              >
                <ShieldCheck className="size-4 mr-2" />
                Go to Admin Portal
                <ArrowRight className="size-4 ml-2" />
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="rounded-xl px-6 cursor-pointer"
                size="lg"
              >
                <Glasses className="size-4 mr-2" />
                Browse Storefront
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Guest State: Prompt to log in
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-20 max-w-md text-center">
        <div className="size-16 rounded-3xl bg-secondary border border-border/80 flex items-center justify-center mx-auto mb-6 shadow-xs">
          <Package className="size-8 text-primary" />
        </div>

        <h1 className="text-3xl font-normal font-serif text-foreground mb-3">
          Track Your Eyewear Orders
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light mb-8">
          Please sign in to your Lumos client account to review bespoke frame orders, verify prescription allocations, and view real-time insured courier tracking.
        </p>

        <div className="space-y-3">
          <Button
            size="lg"
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full rounded-xl cursor-pointer shadow-sm"
          >
            <LogIn className="size-4 mr-2" />
            Sign In with Lumos Account
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/")}
            className="w-full rounded-xl cursor-pointer"
          >
            Explore Eyewear Collections
          </Button>
        </div>
      </div>
    )
  }

  // Customer Orders View
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10">
      <OrdersView onGoToStore={() => router.push("/")} />
    </div>
  )
}
