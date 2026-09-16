"use client"

import * as React from "react"
import { Package, Calendar, MapPin, XCircle, RefreshCw, ShoppingCart, AlertTriangle, Glasses } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Order } from "@/lib/api"
import { formatINR } from "@/lib/format"

interface OrdersViewProps {
  onGoToStore: () => void
}

export function OrdersView({ onGoToStore }: OrdersViewProps) {
  const { orders, refreshOrders, cancelOrder } = useCart()
  const [cancellingOrder, setCancellingOrder] = React.useState<Order | null>(null)
  const [isCancelling, setIsCancelling] = React.useState(false)

  const handleConfirmCancel = async () => {
    if (!cancellingOrder) return

    setIsCancelling(true)
    const res = await cancelOrder(cancellingOrder.id)
    setIsCancelling(false)
    const orderNum = cancellingOrder.order_number
    setCancellingOrder(null)

    if (res.success) {
      toast.success(`Order ${orderNum} cancelled and inventory has been restored.`)
    } else {
      toast.error(res.message || "Order could not be cancelled.")
    }
  }

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return (
          <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
            Delivered
          </Badge>
        )
      case "shipped":
        return <Badge variant="secondary">In Transit / Shipped</Badge>
      case "processing":
      case "confirmed":
        return <Badge variant="secondary">Lens Crafting & Quality Check</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10">
            Order Placed
          </Badge>
        )
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-heading">Your Order History</h2>
          <p className="text-sm text-muted-foreground">
            Track active frame shipments, lens crafting updates, and past purchase receipts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refreshOrders()} className="rounded-xl">
            <RefreshCw className="size-3.5 mr-1.5" /> Refresh Status
          </Button>
          <Button size="sm" onClick={onGoToStore} className="rounded-xl">
            <ShoppingCart className="size-3.5 mr-1.5" /> Continue Shopping
          </Button>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center py-12 px-4 rounded-2xl">
          <div className="size-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-3">
            <Glasses className="size-8 text-muted-foreground/60" />
          </div>
          <h3 className="font-semibold text-lg text-foreground font-heading">No eyewear orders placed yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-6">
            When you complete checkout, your frames, prescription details, and tracking updates will appear here.
          </p>
          <Button onClick={onGoToStore} className="rounded-xl">Explore Eyewear Catalog</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const canCancel = order.status !== "shipped" && order.status !== "delivered" && order.status !== "cancelled"
            const formattedDate = new Date(order.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })

            return (
              <Card key={order.id} className="overflow-hidden rounded-2xl border-border/80 shadow-2xs">
                <CardHeader className="bg-muted/30 p-4 sm:p-5 border-b border-border/60">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-foreground">
                        {order.order_number}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" /> {formattedDate}
                      </span>
                      <span className="font-extrabold text-base text-foreground font-heading">
                        {formatINR(order.total_amount)}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-5 space-y-4">
                  {/* Items List */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Ordered Frames ({order.items.length})
                    </span>
                    <div className="divide-y divide-border/60">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="py-2.5 flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-lg bg-secondary flex items-center justify-center border border-border/60 shrink-0">
                              <Glasses className="size-4 text-primary" />
                            </div>
                            <div>
                              <span className="font-semibold text-foreground">{item.product_title}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                x {item.quantity} &bull; {formatINR(item.unit_price)} each
                              </span>
                            </div>
                          </div>
                          <span className="font-bold text-foreground">
                            {formatINR(item.subtotal)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Delivery Info & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                    <div className="flex items-start gap-1.5 text-muted-foreground max-w-md">
                      <MapPin className="size-4 shrink-0 mt-0.5 text-primary" />
                      <span>{order.shipping_address}</span>
                    </div>

                    {canCancel && (
                      <Button
                        variant="destructive"
                        size="xs"
                        onClick={() => setCancellingOrder(order)}
                        className="self-start sm:self-auto rounded-lg"
                      >
                        <XCircle className="size-3 mr-1" />
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Alert Dialog replacing window.confirm */}
      <AlertDialog
        open={!!cancellingOrder}
        onOpenChange={(open) => !open && setCancellingOrder(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive font-heading">
              <AlertTriangle className="size-4" /> Cancel Eyewear Order?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel order{" "}
              <strong className="text-foreground">{cancellingOrder?.order_number}</strong>?
              Your reserved frames will be restored to inventory and your payment will be refunded.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Keep Order</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Yes, Cancel Order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
