"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ShieldAlert, ShieldCheck, LogIn, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { Category, apiFetch } from "@/lib/api"
import { AdminDashboard } from "@/components/AdminDashboard"

export default function AdminPage() {
  const router = useRouter()
  const { user, isAdmin, isAuthenticated, isLoading, setIsAuthModalOpen } = useAuth()
  const [categories, setCategories] = React.useState<Category[]>([])

  const loadCategories = React.useCallback(async () => {
    try {
      const data = await apiFetch<Category[]>("/categories/")
      setCategories(data)
    } catch (err: unknown) {
      console.error("Failed to load categories for admin", err)
    }
  }, [])

  React.useEffect(() => {
    if (isAdmin) {
      loadCategories()
    }
  }, [isAdmin, loadCategories])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
        <p className="text-xs text-muted-foreground font-mono">Verifying Staff Authorization...</p>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-20 max-w-md text-center">
        <div className="size-16 rounded-3xl bg-secondary border border-border/80 flex items-center justify-center mx-auto mb-6 shadow-xs">
          <ShieldCheck className="size-8 text-primary" />
        </div>

        <h1 className="text-3xl font-normal font-serif text-foreground mb-3">
          Staff Portal Authentication
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light mb-8">
          This portal is restricted to authorized Lumos Optics personnel for inventory management, frame publishing, and order fulfillment.
        </p>

        <div className="space-y-3">
          <Button
            size="lg"
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full rounded-xl cursor-pointer shadow-sm"
          >
            <LogIn className="size-4 mr-2" />
            Sign In with Staff Account
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/")}
            className="w-full rounded-xl cursor-pointer"
          >
            <ArrowLeft className="size-4 mr-2" /> Return to Storefront
          </Button>
        </div>
      </div>
    )
  }

  // Authenticated but NOT admin
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-20 max-w-lg text-center">
        <div className="size-16 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-6 border border-destructive/20 shadow-xs">
          <ShieldAlert className="size-8" />
        </div>

        <h1 className="text-3xl font-normal font-serif text-foreground mb-3">
          Staff Access Restricted
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light mb-8">
          Your account (<strong>{user?.email}</strong>) is registered as a Client Member. Administrative tools, inventory cataloging, and storewide order fulfillment require staff privileges.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            onClick={() => router.push("/orders")}
            className="rounded-xl cursor-pointer shadow-sm"
          >
            Go to My Orders
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/")}
            className="rounded-xl cursor-pointer"
          >
            Return to Storefront
          </Button>
        </div>
      </div>
    )
  }

  // Admin Dashboard View
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10">
      <AdminDashboard
        categories={categories}
        onDataChanged={loadCategories}
      />
    </div>
  )
}
