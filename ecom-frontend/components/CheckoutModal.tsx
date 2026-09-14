"use client"

import * as React from "react"
import { CheckCircle2, Truck, CreditCard, ShieldCheck, ShoppingCart, Smartphone, PackageCheck } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { checkoutSchema, CheckoutFormData } from "@/lib/validations/checkout"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { Order } from "@/lib/api"
import { formatINR } from "@/lib/format"

import { useRouter } from "next/navigation"

interface CheckoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOrderSuccess?: (order: Order) => void
}

export function CheckoutModal({ open, onOpenChange, onOrderSuccess }: CheckoutModalProps) {
  const router = useRouter()
  const { items, totalAmount, checkout } = useCart()
  const { user } = useAuth()

  const [formData, setFormData] = React.useState<CheckoutFormData>({
    fullName: user?.full_name || "Aarav Sharma",
    email: user?.email || "customer@ecommerce.com",
    shipping_address: "Flat 402, Sea Green Apartments, Linking Road",
    city: "Mumbai",
    postalCode: "400050",
    phone: "+91 98765 43210",
    paymentMethod: "credit_card",
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [createdOrder, setCreatedOrder] = React.useState<Order | null>(null)

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validate with Zod
    const validation = checkoutSchema.safeParse(formData)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as string
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message
        }
      })
      setErrors(fieldErrors)
      toast.error("Please fill in all required shipping details correctly.")
      return
    }

    setIsSubmitting(true)
    const fullAddress = `${validation.data.shipping_address}, ${validation.data.city} - ${validation.data.postalCode}. Recipient: ${validation.data.fullName} (Tel: ${validation.data.phone})`

    const res = await checkout(fullAddress)
    setIsSubmitting(false)

    if (res.success && res.order) {
      setCreatedOrder(res.order)
      if (onOrderSuccess) onOrderSuccess(res.order)
      toast.success(`Order ${res.order.order_number} confirmed!`)
    } else {
      const errorMsg = res.message || "Failed to place order. Please review your bag."
      setErrors({ form: errorMsg })
      toast.error(errorMsg)
    }
  }

  const handleClose = () => {
    setCreatedOrder(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {createdOrder ? (
          <div className="text-center py-4 space-y-4">
            <div className="size-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="size-10" />
            </div>

            <DialogHeader className="text-center sm:text-center">
              <DialogTitle className="text-xl font-heading">Order Placed Successfully!</DialogTitle>
              <DialogDescription>
                Your eyewear order has been confirmed and queued for custom lens crafting and dispatch.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-muted/50 border border-border rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Ref:</span>
                <span className="font-mono font-bold text-foreground">{createdOrder.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="outline" className="uppercase text-[10px] text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10">
                  {createdOrder.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-bold text-foreground text-sm">{formatINR(createdOrder.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items:</span>
                <span>{createdOrder.items.length} frame(s)</span>
              </div>
              <Separator className="my-1.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <strong>Delivery Address:</strong> {createdOrder.shipping_address}
              </p>
            </div>

            <Button
              onClick={() => {
                handleClose()
                router.push("/orders")
              }}
              className="w-full rounded-xl cursor-pointer"
              size="lg"
            >
              View Order Details & Track Shipment
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-heading">
                <Truck className="size-5 text-primary" /> Delivery & Payment
              </DialogTitle>
              <DialogDescription>
                Provide delivery destination and select payment method for expedited shipping.
              </DialogDescription>
            </DialogHeader>

            {errors.form && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
                {errors.form}
              </div>
            )}

            {/* Form Fields Validated with Zod */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div className="space-y-1">
                <Label htmlFor="fullName">
                  Recipient Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Full name"
                />
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">
                  Email Receipt <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="name@example.com"
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-1 text-left">
              <Label htmlFor="shipping_address">
                Delivery Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="shipping_address"
                value={formData.shipping_address}
                onChange={(e) => handleChange("shipping_address", e.target.value)}
                placeholder="House / Flat No., Building, Street"
              />
              {errors.shipping_address && <p className="text-xs text-destructive">{errors.shipping_address}</p>}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
              <div className="space-y-1">
                <Label htmlFor="city">
                  City <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="e.g. Mumbai"
                />
                {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="postalCode">
                  PIN Code <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleChange("postalCode", e.target.value)}
                  placeholder="400050"
                />
                {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode}</p>}
              </div>

              <div className="space-y-1 col-span-2 sm:col-span-1">
                <Label htmlFor="phone">
                  Phone (WhatsApp) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
            </div>

            <div className="space-y-1.5 text-left pt-1">
              <Label>Payment Mode</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "credit_card", label: "Credit/Debit Card", icon: CreditCard },
                  { id: "digital_wallet", label: "UPI / GPay / NetBanking", icon: Smartphone },
                  { id: "cash_on_delivery", label: "Cash on Delivery", icon: PackageCheck },
                ].map((mode) => {
                  const Icon = mode.icon
                  const isSelected = formData.paymentMethod === mode.id
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => handleChange("paymentMethod", mode.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                          : "border-border hover:bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <Icon className="size-4 mb-1" />
                      <span className="text-[10px] text-center leading-tight">{mode.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="bg-muted/40 p-3.5 rounded-xl border border-border/80 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-foreground">{items.length} frame(s) in bag</span>
                <span className="text-muted-foreground block text-[11px]">Free delivery & insurance included</span>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground block text-[10px]">Total to Pay</span>
                <span className="text-base font-black text-foreground font-heading">{formatINR(totalAmount)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 rounded-xl"
              >
                Back to Bag
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="flex-1 rounded-xl shadow-xs"
              >
                {isSubmitting ? "Processing..." : `Place Order (${formatINR(totalAmount)})`}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
