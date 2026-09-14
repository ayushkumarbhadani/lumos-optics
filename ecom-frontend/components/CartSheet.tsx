"use client"

import * as React from "react"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, AlertTriangle, Glasses } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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
import { toast } from "sonner"
import { useCart } from "@/context/CartContext"
import { formatINR } from "@/lib/format"

interface CartSheetProps {
  onOpenCheckout?: () => void
}

export function CartSheet({ onOpenCheckout }: CartSheetProps) {
  const { items, totalItems, totalAmount, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart, setIsCheckoutOpen } = useCart()
  const [showClearConfirm, setShowClearConfirm] = React.useState(false)

  const handleClearCart = async () => {
    await clearCart()
    setShowClearConfirm(false)
    toast.info("All items have been removed from your shopping cart.")
  }

  const handleRemoveItem = async (productId: number, title: string) => {
    await removeFromCart(productId)
    toast.info(`${title} was removed from your cart.`)
  }

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent>
          <SheetHeader>
            <div className="flex items-center justify-between pr-6">
              <SheetTitle className="flex items-center gap-2">
                <ShoppingBag className="size-5" /> Your Shopping Bag
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary font-semibold text-foreground">
                  {totalItems} {totalItems === 1 ? "frame" : "frames"}
                </span>
              </SheetTitle>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                >
                  Clear Bag
                </button>
              )}
            </div>
            <SheetDescription>
              Review your handcrafted frames, adjust quantities, or proceed to express checkout.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-2 -mx-2 px-2 space-y-3">
            {items.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                <div className="size-16 rounded-full bg-muted/60 flex items-center justify-center mb-3">
                  <Glasses className="size-8 text-muted-foreground/60" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">Your shopping bag is empty</h4>
                <p className="text-xs mt-1 max-w-[220px]">
                  Browse our eyewear collection and select your favorite frames.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-card gap-3 shadow-2xs"
                >
                  {/* Eyewear Thumbnail */}
                  <div className="size-14 rounded-lg overflow-hidden bg-secondary/40 shrink-0 border border-border/60 flex items-center justify-center">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <Glasses className="size-6 text-muted-foreground/70" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground truncate">
                      {item.product.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {formatINR(item.product.price)} each
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        = {formatINR(item.subtotal)}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Adjusters */}
                  <div className="flex items-center gap-1.5 bg-secondary rounded-lg p-0.5 border border-border/60">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="size-6 flex items-center justify-center rounded hover:bg-background text-foreground transition-colors cursor-pointer"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="size-6 flex items-center justify-center rounded hover:bg-background text-foreground transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.product_id, item.product.title)}
                    className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <SheetFooter>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Bag Subtotal</span>
                  <span className="font-medium text-foreground">{formatINR(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Standard Shipping & Hard Case</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">FREE</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between text-base font-bold text-foreground">
                  <span>Total Amount</span>
                  <span className="text-lg font-black text-foreground font-heading">{formatINR(totalAmount)}</span>
                </div>
              </div>

              <Button
                onClick={() => {
                  setIsCartOpen(false)
                  if (onOpenCheckout) {
                    onOpenCheckout()
                  } else {
                    setIsCheckoutOpen(true)
                  }
                }}
                className="w-full flex items-center justify-center gap-2 mt-3 cursor-pointer rounded-xl font-medium shadow-sm"
                size="lg"
              >
                Proceed to Checkout ({formatINR(totalAmount)})
                <ArrowRight className="size-4" />
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      {/* Alert Dialog replacing window.confirm for Clearing Cart */}
      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-4" /> Clear Shopping Bag?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove all {totalItems} frame(s) from your bag?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Frames</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleClearCart}>
              Clear Bag
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
