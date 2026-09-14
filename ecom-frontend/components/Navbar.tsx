"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  ShoppingBag,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  Package,
  Glasses,
  Sparkles,
  Feather,
  Truck,
  Shield,
  FileText,
  ChevronRight,
  LogIn,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"

export function Navbar() {
  const pathname = usePathname()
  const { user, isAdmin, isAuthenticated, logout, setIsAuthModalOpen } = useAuth()
  const { totalItems, setIsCartOpen } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <>
      {/* Top Brand Announcement Banner */}
      <div className="bg-primary text-primary-foreground text-[11px] font-medium py-1.5 px-4 text-center tracking-wide">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <Sparkles className="size-3 text-amber-300 shrink-0" />
          <span>Complimentary Express Delivery Across India &bull; 14-Day Free Home Try-On &bull; 1-Year Anti-Scratch Warranty</span>
        </div>
      </div>

      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/85 transition-all shadow-xs">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 relative">
          {/* Brand & Main Nav */}
          <div className="flex items-center gap-3 sm:gap-8">
            {/* Mobile Navigation Sheet Trigger */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden size-9 rounded-xl border border-border/70 hover:bg-secondary cursor-pointer shrink-0"
              aria-label="Open Navigation Menu"
            >
              <Menu className="size-5 text-foreground" />
            </Button>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetContent
                side="left"
                className="w-75 sm:w-87.5 p-6 flex flex-col justify-between overflow-y-auto"
              >
                <div className="space-y-6">
                  {/* Sheet Header */}
                  <SheetHeader className="text-left space-y-1">
                    <SheetTitle className="flex items-center gap-2.5 font-heading text-lg">
                      <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                        <Glasses className="size-4" />
                      </div>
                      <span>
                        Lumos <span className="font-light text-primary text-xs uppercase tracking-widest">Optics</span>
                      </span>
                    </SheetTitle>
                    <SheetDescription className="text-xs">
                      Haute Eyewear & Bespoke Optical Frames
                    </SheetDescription>
                  </SheetHeader>

                  {/* Navigation Links */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold px-2 block mb-2">
                      Atelier Navigation
                    </span>

                    <Link
                      href="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        pathname === "/"
                          ? "bg-secondary text-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Glasses className="size-4 text-primary" />
                        Frames & Shades
                      </span>
                      <ChevronRight className="size-4 text-muted-foreground/50" />
                    </Link>

                    <Link
                      href="/try-on"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        pathname === "/try-on"
                          ? "bg-secondary text-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Sparkles className="size-4 text-amber-500" />
                        14-Day Home Try-On
                      </span>
                      <ChevronRight className="size-4 text-muted-foreground/50" />
                    </Link>

                    <Link
                      href="/about"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        pathname === "/about"
                          ? "bg-secondary text-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Feather className="size-4 text-primary" />
                        Atelier Story
                      </span>
                      <ChevronRight className="size-4 text-muted-foreground/50" />
                    </Link>

                    {/* Customer Only: My Orders */}
                    {isAuthenticated && !isAdmin && (
                      <Link
                        href="/orders"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          pathname === "/orders"
                            ? "bg-secondary text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Package className="size-4 text-primary" />
                          My Orders
                        </span>
                        <ChevronRight className="size-4 text-muted-foreground/50" />
                      </Link>
                    )}

                    {/* Admin Only: Inventory Portal */}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          pathname === "/admin"
                            ? "bg-primary/10 text-primary font-semibold ring-1 ring-primary/20"
                            : "text-primary/90 hover:text-primary hover:bg-primary/5"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <ShieldCheck className="size-4 text-primary" />
                          Admin Portal
                        </span>
                        <ChevronRight className="size-4 text-primary/50" />
                      </Link>
                    )}
                  </div>

                  <Separator />

                  {/* Client Concierge & Legal Links */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold px-2 block mb-2">
                      Client Concierge
                    </span>

                    <Link
                      href="/shipping"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                    >
                      <Truck className="size-3.5" /> Dispatch & Returns
                    </Link>

                    <Link
                      href="/privacy"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                    >
                      <Shield className="size-3.5" /> Privacy Protocol
                    </Link>

                    <Link
                      href="/terms"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                    >
                      <FileText className="size-3.5" /> Terms of Atelier
                    </Link>
                  </div>
                </div>

                {/* Bottom User Profile inside Sheet */}
                <div className="pt-6 border-t border-border/70 mt-6">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-foreground">{user.full_name}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">{user.email}</p>
                        </div>
                        {user.role === "admin" ? (
                          <Badge variant="default" className="text-[9px] py-0 px-1.5 h-4 gap-0.5">
                            <ShieldCheck className="size-2.5" /> Staff
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[9px] py-0 px-1.5 h-4 gap-0.5">
                            <UserIcon className="size-2.5" /> Member
                          </Badge>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          logout()
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full text-xs text-destructive hover:bg-destructive/10 border-destructive/30 rounded-xl cursor-pointer"
                      >
                        <LogOut className="size-3.5 mr-2" />
                        Sign Out of Lumos
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        setIsAuthModalOpen(true)
                      }}
                      className="w-full rounded-xl cursor-pointer font-medium"
                    >
                      <LogIn className="size-3.5 mr-2" />
                      Sign In / Register
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
                <Glasses className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-foreground flex items-center gap-1.5 font-heading">
                  Lumos
                  <span className="text-primary font-light text-sm tracking-widest uppercase">Optics</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links — Centered */}
          <nav className="hidden md:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
            <Link
              href="/"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-secondary text-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              Frames & Shades
            </Link>

            <Link
              href="/try-on"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/try-on"
                  ? "bg-secondary text-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              Home Try-On
            </Link>

            <Link
              href="/about"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/about"
                  ? "bg-secondary text-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              Atelier Story
            </Link>

            {/* Customer Only: My Orders */}
            {isAuthenticated && !isAdmin && (
              <Link
                href="/orders"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  pathname === "/orders"
                    ? "bg-secondary text-foreground font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <Package className="size-4" />
                My Orders
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 rounded-xl border-border hover:bg-secondary cursor-pointer shadow-2xs"
            >
              <ShoppingBag className="size-4" />
              <span className="hidden sm:inline font-medium">Cart</span>
              {totalItems > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-bold shadow-xs">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Admin Portal Link — Positioned immediately after Cart Separator */}
            {isAdmin && (
              <div className="hidden sm:flex items-center pl-2.5 border-l border-border/80">
                <Link
                  href="/admin"
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    pathname === "/admin"
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "bg-secondary/80 hover:bg-secondary text-foreground border border-border/80 hover:border-primary/40"
                  }`}
                >
                  <ShieldCheck className="size-3.5 text-primary" />
                  <span>Admin Portal</span>
                </Link>
              </div>
            )}

            {/* User Profile / Auth */}
            {user ? (
              <div
                className={`hidden sm:flex items-center gap-2.5 ${
                  !isAdmin ? "pl-2.5 border-l border-border/80" : "pl-1.5"
                }`}
              >
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-foreground max-w-32.5 truncate leading-tight">
                    {user.full_name}
                  </span>
                  {!isAdmin && (
                    <span className="text-[10px] text-muted-foreground flex items-center justify-end gap-1 font-mono">
                      <Badge variant="secondary" className="text-[9px] py-0 px-1.5 h-4 gap-0.5 font-sans">
                        <UserIcon className="size-2.5" /> Member
                      </Badge>
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={logout}
                  title="Sign Out"
                  className="text-muted-foreground hover:text-destructive cursor-pointer rounded-lg"
                >
                  <LogOut className="size-4" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden sm:inline-flex rounded-xl shadow-xs cursor-pointer font-medium"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
