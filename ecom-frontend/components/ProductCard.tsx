"use client"

import * as React from "react"
import { ShoppingCart, Check, Glasses, Sun, Eye, Sparkles, Focus } from "lucide-react"
import { Product } from "@/lib/api"
import { formatINR } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useCart } from "@/context/CartContext"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, items } = useCart()
  const [isAdding, setIsAdding] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)

  const cartItem = items.find((i) => i.product_id === product.id)
  const qtyInCart = cartItem ? cartItem.quantity : 0
  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= 10

  // Eyewear Silhouette Resolver
  const getEyewearIcon = () => {
    const text = (product.title + " " + (product.category?.name || "")).toLowerCase()
    if (text.includes("sun") || text.includes("aviator") || text.includes("shades")) {
      return <Sun className="size-11 text-amber-500/90" />
    }
    if (text.includes("titanium") || text.includes("luxury")) {
      return <Sparkles className="size-11 text-primary" />
    }
    if (text.includes("blue") || text.includes("screen") || text.includes("computer")) {
      return <Eye className="size-11 text-sky-500" />
    }
    if (text.includes("sport") || text.includes("apex")) {
      return <Focus className="size-11 text-emerald-500" />
    }
    return <Glasses className="size-11 text-primary" />
  }

  const handleAddToCart = async () => {
    if (isOutOfStock) return
    setIsAdding(true)
    const result = await addToCart(product, 1)
    setIsAdding(false)

    if (result.success) {
      toast.success(`${product.title} added to your cart!`)
    } else if (result.message) {
      toast.error(result.message)
    }
  }

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div>
        {/* Visual Frame Presentation Stage - completely flush with top border */}
        <div className="relative h-56 w-full bg-linear-to-b from-muted/50 via-muted/20 to-card flex items-center justify-center overflow-hidden border-b border-border/50">
          {product.image_url && !imageError ? (
            <div className="relative w-full h-full overflow-hidden bg-secondary/20">
              <img
                src={product.image_url}
                alt={product.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-card/60 via-transparent to-black/15 pointer-events-none" />
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-card shadow-xs border border-border/60 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
              {getEyewearIcon()}
            </div>
          )}

          {/* Top Badges Bar - Non-colliding flex layout */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
            {product.category && (
              <Badge
                variant="secondary"
                className="rounded-full text-[10px] font-semibold tracking-wide uppercase px-2.5 py-0.5 bg-background/90 backdrop-blur-md border border-border/80 shadow-2xs pointer-events-auto max-w-[60%] truncate"
                title={product.category.name}
              >
                <span className="truncate">{product.category.name}</span>
              </Badge>
            )}

            <div className="pointer-events-auto shrink-0 ml-auto">
              {isOutOfStock ? (
                <Badge variant="destructive" className="rounded-full text-[10px] font-medium shadow-2xs backdrop-blur-md whitespace-nowrap">
                  Out of Stock
                </Badge>
              ) : isLowStock ? (
                <Badge variant="outline" className="rounded-full text-[10px] font-medium text-amber-600 dark:text-amber-400 border-amber-500/30 bg-background/90 backdrop-blur-md shadow-2xs whitespace-nowrap">
                  Only {product.stock} left
                </Badge>
              ) : (
                <Badge variant="outline" className="rounded-full text-[10px] font-medium text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-background/90 backdrop-blur-md shadow-2xs whitespace-nowrap flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  In Stock
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Frame Info & Typography */}
        <div className="p-5 pb-2">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
              {product.sku}
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Ships in 24h
            </span>
          </div>
          <h3 className="line-clamp-1 text-base font-bold text-foreground group-hover:text-primary transition-colors font-heading">
            {product.title}
          </h3>
          <p className="line-clamp-2 text-xs text-muted-foreground mt-1.5 leading-relaxed font-light">
            {product.description || "Handcrafted premium optical frame with anti-reflective coating and premium case."}
          </p>
        </div>
      </div>

      {/* Pricing Row */}
      <div className="px-5 pt-1 pb-2">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black tracking-tight text-foreground font-heading">
              {formatINR(product.price)}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground">
              Free Case & Lenses
            </span>
          </div>
          {qtyInCart > 0 && (
            <span className="text-[11px] font-semibold text-primary px-2 py-0.5 rounded-md bg-primary/10">
              {qtyInCart} in bag
            </span>
          )}
        </div>
      </div>

      {/* Action Area - Unified styling without border-t or different background */}
      <div className="px-5 pb-5 pt-1">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding || qtyInCart >= product.stock}
          className="w-full flex items-center justify-center gap-2 rounded-xl font-medium shadow-xs cursor-pointer transition-all active:scale-[0.98]"
          variant={qtyInCart > 0 ? "secondary" : "default"}
          size="sm"
        >
          {isAdding ? (
            "Adding to Cart..."
          ) : qtyInCart > 0 ? (
            <>
              <Check className="size-3.5" /> Add Another (+1)
            </>
          ) : isOutOfStock ? (
            "Sold Out"
          ) : (
            <>
              <ShoppingCart className="size-3.5" /> Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
