"use client"

import * as React from "react"
import Link from "next/link"
import { Glasses, Sparkles, Shield, Truck, RotateCcw, MapPin, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"

function CurrentYear() {
  return <>{new Date().getFullYear()}</>
}

export function Footer() {
  const { isAdmin, isAuthenticated } = useAuth()
  const [email, setEmail] = React.useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.")
      return
    }
    toast.success("Subscribed to the Lumos Private Atelier registry.")
    setEmail("")
  }

  return (
    <footer className="border-t border-border/80 bg-card py-16 text-foreground text-left mt-auto">
      <div className="container mx-auto px-4 sm:px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Intro */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Glasses className="size-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-foreground font-heading">
                Lumos <span className="font-light text-primary text-xs uppercase tracking-widest">Optics</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed font-light max-w-sm">
              Artisanal eyewear sculpted from Sabae aerospace titanium and 90-day cured Italian Mazzucchelli acetate. Fitted exclusively with certified Zeiss anti-reflective optics.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5 font-light">
                <MapPin className="size-3.5 text-primary" /> Sabae &bull; Milan &bull; Mumbai
              </span>
            </div>
          </div>

          {/* Optical Collections */}
          <div className="space-y-3 text-xs">
            <h5 className="font-semibold uppercase tracking-wider text-foreground font-mono text-[11px]">
              Atelier Collections
            </h5>
            <ul className="space-y-2 text-muted-foreground font-light">
              <li>
                <Link href="/?category=1" className="hover:text-foreground transition-colors">
                  Polarized Sunglasses
                </Link>
              </li>
              <li>
                <Link href="/?category=2" className="hover:text-foreground transition-colors">
                  Prescription Eyeglasses
                </Link>
              </li>
              <li>
                <Link href="/?category=3" className="hover:text-foreground transition-colors">
                  Titanium & Luxury Frames
                </Link>
              </li>
              <li>
                <Link href="/?category=4" className="hover:text-foreground transition-colors">
                  Reading & Blue Light Specs
                </Link>
              </li>
              <li>
                <Link href="/try-on" className="hover:text-primary font-medium transition-colors flex items-center gap-1 text-primary">
                  <Sparkles className="size-3" /> 14-Day Home Try-On
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div className="space-y-3 text-xs">
            <h5 className="font-semibold uppercase tracking-wider text-foreground font-mono text-[11px]">
              Client Concierge
            </h5>
            <ul className="space-y-2 text-muted-foreground font-light">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  Our Heritage & Sabae Story
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-foreground transition-colors">
                  Shipping, Courier & Returns
                </Link>
              </li>
              {isAuthenticated && !isAdmin && (
                <li>
                  <Link href="/orders" className="hover:text-foreground transition-colors">
                    Track My Order Status
                  </Link>
                </li>
              )}
              {isAdmin && (
                <li>
                  <Link href="/admin" className="text-primary font-medium hover:underline">
                    Staff Inventory Management
                  </Link>
                </li>
              )}
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  1-Year Lens Warranty
                </Link>
              </li>
            </ul>
          </div>

          {/* Private Atelier Newsletter */}
          <div className="space-y-3 text-xs">
            <h5 className="font-semibold uppercase tracking-wider text-foreground font-mono text-[11px]">
              Private Atelier Registry
            </h5>
            <p className="text-muted-foreground text-[11px] font-light leading-relaxed">
              Receive private invitations to limited artisan runs, custom fittings, and private sales.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 pt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@atelier.com"
                className="w-full h-8 px-3 rounded-lg border border-input bg-background text-xs outline-none focus:ring-1 focus:ring-ring"
              />
              <Button type="submit" size="xs" className="rounded-lg shrink-0 cursor-pointer">
                Join
              </Button>
            </form>
          </div>
        </div>

        {/* Legal & Compliance Links */}
        <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-light">
          <span>
            &copy;{" "}
            <React.Suspense fallback={<span>2026</span>}>
              <CurrentYear />
            </React.Suspense>{" "}
            Lumos Optics Private Limited. All rights reserved.
          </span>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Protocol
            </Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              Cookie Preferences
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Atelier
            </Link>
            <Link href="/shipping" className="hover:text-foreground transition-colors">
              Dispatch & Delivery
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
