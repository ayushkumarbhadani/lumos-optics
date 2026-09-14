"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  RefreshCw,
  AlertTriangle,
  ShoppingCart,
  Truck,
  RotateCcw,
  Sparkles,
  Glasses,
  Eye,
  Sun,
  Shield,
  Layers,
  Feather,
  Gem,
  Award,
  ArrowRight,
} from "lucide-react"
import { Category, Product, ProductListResponse, apiFetch } from "@/lib/api"
import { ProductCard } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { formatINR } from "@/lib/format"

function StoreContent() {
  const searchParams = useSearchParams()
  const { addToCart } = useCart()

  // Catalog State
  const [categories, setCategories] = React.useState<Category[]>([])
  const [products, setProducts] = React.useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = React.useState<number | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [inStockOnly, setInStockOnly] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [backendError, setBackendError] = React.useState<string | null>(null)
  const [spotlightAdding, setSpotlightAdding] = React.useState(false)

  const catalogRef = React.useRef<HTMLDivElement>(null)

  // Sync with URL query parameters (e.g. ?search=aviator or ?category=1)
  React.useEffect(() => {
    const urlCategory = searchParams.get("category")
    const urlSearch = searchParams.get("search")
    if (urlCategory) {
      setSelectedCategory(parseInt(urlCategory, 10))
    }
    if (urlSearch) {
      setSearchQuery(urlSearch)
    }
  }, [searchParams])

  // Fetch Categories
  const loadCategories = React.useCallback(async () => {
    try {
      const data = await apiFetch<Category[]>("/categories/")
      setCategories(data)
    } catch (err: unknown) {
      console.error("Categories fetch failed:", err)
    }
  }, [])

  // Fetch Products with Filters
  const loadProducts = React.useCallback(async () => {
    setIsLoading(true)
    setBackendError(null)

    const params = new URLSearchParams()
    if (selectedCategory) params.append("category_id", selectedCategory.toString())
    if (searchQuery.trim()) params.append("search", searchQuery.trim())
    if (inStockOnly) params.append("in_stock_only", "true")
    params.append("limit", "50")

    try {
      const queryStr = params.toString() ? `?${params.toString()}` : ""
      const data = await apiFetch<ProductListResponse>(`/products/${queryStr}`)
      setProducts(data.items || [])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load optical catalog"
      setBackendError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory, searchQuery, inStockOnly])

  React.useEffect(() => {
    loadCategories()
  }, [loadCategories])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts()
    }, 200)
    return () => clearTimeout(timer)
  }, [loadProducts])

  const spotlightProduct = products.find((p) => p.sku === "EYE-AV-001") || products[0]

  const handleSpotlightAddToCart = async () => {
    if (!spotlightProduct) return
    setSpotlightAdding(true)
    const res = await addToCart(spotlightProduct, 1)
    setSpotlightAdding(false)
    if (res.success) {
      toast.success(`${spotlightProduct.title} added to your shopping bag!`)
    } else if (res.message) {
      toast.error(res.message)
    }
  }

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="w-full">
      {/* Backend Connectivity Alert (if any error) */}
      {backendError && (
        <div className="container mx-auto px-4 sm:px-6 pt-6">
          <div className="p-4 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-3 shadow-sm">
            <AlertTriangle className="size-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong className="font-semibold block">Optical Catalog Service Offline</strong>
              <p className="mt-0.5 text-xs text-destructive/90">
                Unable to synchronize with the eyewear inventory servers ({backendError}). Please verify your backend server.
              </p>
              <Button
                variant="outline"
                size="xs"
                onClick={() => {
                  loadCategories()
                  loadProducts()
                }}
                className="mt-2.5 rounded-lg border-destructive/40 bg-background text-foreground"
              >
                <RefreshCw className="size-3 mr-1.5" /> Retry Connection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/80 bg-linear-to-b from-background via-muted/20 to-background py-16 sm:py-24">
        {/* Subtle Ambient Vignettes */}
        <div className="absolute top-0 right-1/4 size-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 size-112.5 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Haute Editorial Story */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-secondary border border-border/80 text-foreground text-[11px] font-semibold tracking-widest uppercase shadow-2xs">
                <Sparkles className="size-3.5 text-amber-600 dark:text-amber-400" />
                <span>Atelier Sabaè &bull; Spring / Summer 2026</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-foreground font-serif leading-[1.08]">
                Sculpted by Hand.<br />
                <span className="italic font-light text-foreground/90">Perfected by Light.</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed font-light">
                Handcrafted from cured Italian Mazzucchelli acetate and Sabae aerospace titanium. Each Lumos silhouette undergoes 120 precision stages of artisanal beveling, fitted with zero-distortion anti-reflective optics.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Button
                  size="lg"
                  onClick={scrollToCatalog}
                  className="rounded-xl px-7 py-6 text-sm font-semibold tracking-wide shadow-md hover:shadow-lg cursor-pointer transition-all active:scale-[0.98]"
                >
                  Explore The Collection
                  <ArrowRight className="size-4 ml-2" />
                </Button>

                <Link href="/try-on">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-xl px-6 py-6 text-sm font-medium border-border/80 hover:bg-secondary cursor-pointer shadow-2xs"
                  >
                    <Glasses className="size-4 mr-2" />
                    Complimentary Home Try-On
                  </Button>
                </Link>
              </div>

              {/* Material Credentials */}
              <div className="pt-6 border-t border-border/60 grid grid-cols-3 gap-4 max-w-lg text-left">
                <div>
                  <span className="block text-xl font-bold font-serif text-foreground">12g</span>
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Japanese Titanium</span>
                </div>
                <div>
                  <span className="block text-xl font-bold font-serif text-foreground">1849</span>
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Italian Mazzucchelli</span>
                </div>
                <div>
                  <span className="block text-xl font-bold font-serif text-foreground">100%</span>
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Zeiss UV400 Clarity</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Spotlight Frame */}
            {spotlightProduct && (
              <div className="lg:col-span-5">
                <div className="relative group">
                  {/* Glow Border Effect */}
                  <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-amber-500/20 via-primary/20 to-amber-500/10 blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />
                  
                  <div className="relative rounded-3xl border border-border/80 bg-card p-7 shadow-xl space-y-6 text-left">
                    {/* Top Card Tag */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 font-mono">
                        Spotlight Silhouette
                      </span>
                      <Badge variant="outline" className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border-border">
                        Limited: 250 Units
                      </Badge>
                    </div>

                    {/* Spotlight Graphic Stage with Real Photography */}
                    <div className="relative h-60 rounded-2xl bg-secondary/30 flex items-center justify-center border border-border/50 overflow-hidden group">
                      {spotlightProduct.image_url ? (
                        <div className="relative w-full h-full">
                          <img
                            src={spotlightProduct.image_url}
                            alt={spotlightProduct.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-card/80 via-transparent to-black/20" />
                        </div>
                      ) : (
                        <div className="size-24 rounded-full bg-card shadow-md flex items-center justify-center border border-border/60 group-hover:scale-105 transition-transform duration-500">
                          <Sun className="size-12 text-amber-500" />
                        </div>
                      )}
                      <span className="absolute bottom-3 right-3 text-[10px] font-mono text-foreground/90 bg-background/85 backdrop-blur-md px-2.5 py-0.5 rounded-full tracking-wider border border-border/70 z-10 shadow-xs">
                        {spotlightProduct.sku}
                      </span>
                    </div>

                    {/* Spotlight Specs */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold font-serif text-foreground">
                        {spotlightProduct.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {spotlightProduct.description}
                      </p>
                    </div>

                    {/* Price & Immediate Add Button */}
                    <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase text-muted-foreground block font-medium">Bespoke Atelier Price</span>
                        <span className="text-2xl font-black font-heading text-foreground tracking-tight">
                          {formatINR(spotlightProduct.price)}
                        </span>
                      </div>

                      <Button
                        onClick={handleSpotlightAddToCart}
                        disabled={spotlightAdding}
                        className="rounded-xl px-5 shadow-xs cursor-pointer"
                        size="sm"
                      >
                        {spotlightAdding ? (
                          "Reserving..."
                        ) : (
                          <>
                            <ShoppingCart className="size-3.5 mr-1.5" /> Quick Reserve
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Editorial Accolades & Press Banner */}
      <section className="border-b border-border/70 bg-card/60 py-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-6 text-center text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground/75 font-serif">
            <span>&bull; VOGUE EYEWEAR 2026 &bull;</span>
            <span>&bull; GQ DESIGN AWARDS &bull;</span>
            <span>&bull; MONOCLE INDEPENDENT OPTICS &bull;</span>
            <span>&bull; ARCHITECTURAL DIGEST &bull;</span>
            <span>&bull; ZEISS CERTIFIED ATELIER &bull;</span>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section ref={catalogRef} className="container mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/70 pb-6 text-left">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary font-mono block mb-1">
              Couture Optics &bull; Hand-Assembled
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal font-serif text-foreground tracking-tight">
              The Optical Portfolio
            </h2>
          </div>
          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
            Every frame includes complimentary custom prescription fitting, Zeiss anti-reflective coating, and our signature magnetic leather hard case.
          </p>
        </div>

        {/* Category Filter Pills & In-Stock Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === null
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border/80 hover:bg-secondary"
              }`}
            >
              All Collections
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card text-muted-foreground hover:text-foreground border border-border/80 hover:bg-secondary"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                inStockOnly
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`size-2 rounded-full ${inStockOnly ? "bg-emerald-500" : "bg-muted-foreground/50"}`} />
              In Stock Only
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-muted/40 animate-pulse border border-border/40" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-border bg-card/50">
            <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Glasses className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg text-foreground font-serif">No optical silhouettes found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
              Try adjusting your collection filter or search parameters to discover other atelier frames.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory(null)
                setSearchQuery("")
                setInStockOnly(false)
              }}
              className="mt-4 rounded-xl cursor-pointer"
            >
              View All Collections
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* The Lumos Atelier Craftsmanship Section */}
      <section className="border-t border-b border-border/80 bg-secondary/30 py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary font-mono">
              Artisanal Provenance &bull; Zero Compromise
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal font-serif text-foreground">
              The Anatomy of a Lumos Frame
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light">
              We circumvent mass manufacturing in favor of boutique multi-generational workshops in Sabae, Japan and Castiglione Olona, Italy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Pillar 1 */}
            <div className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-xs group hover:border-primary/40 transition-all duration-300">
              <div className="h-44 w-full overflow-hidden bg-secondary/30 relative">
                <img
                  src="/images/editorial/craft-titanium.jpg"
                  alt="Aerospace Titanium Craft"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 size-10 rounded-xl bg-card/90 backdrop-blur-md text-primary flex items-center justify-center border border-border/60 shadow-xs">
                  <Feather className="size-5" />
                </div>
              </div>
              <div className="p-6 pt-3 space-y-3">
                <h3 className="text-lg font-bold font-serif text-foreground">
                  Aerospace Titanium from Sabae
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Weighing merely 12 grams, our beta-titanium frames offer exceptional tensile memory, hypoallergenic purity, and zero corrosion over decades of daily wear.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-xs group hover:border-primary/40 transition-all duration-300">
              <div className="h-44 w-full overflow-hidden bg-secondary/30 relative">
                <img
                  src="/images/editorial/craft-acetate.jpg"
                  alt="Mazzucchelli 1849 Italian Acetate"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 size-10 rounded-xl bg-card/90 backdrop-blur-md text-primary flex items-center justify-center border border-border/60 shadow-xs">
                  <Gem className="size-5" />
                </div>
              </div>
              <div className="p-6 pt-3 space-y-3">
                <h3 className="text-lg font-bold font-serif text-foreground">
                  Mazzucchelli 1849 Italian Acetate
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Cured for over 90 days in northern Italy for optimum density and organic luster, then sculpted with custom 5-barrel hinges and tumble-polished in beechwood barrels.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-xs group hover:border-primary/40 transition-all duration-300">
              <div className="h-44 w-full overflow-hidden bg-secondary/30 relative">
                <img
                  src="/images/editorial/craft-lenses.jpg"
                  alt="Zeiss Diamond-Coat Lenses"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 size-10 rounded-xl bg-card/90 backdrop-blur-md text-primary flex items-center justify-center border border-border/60 shadow-xs">
                  <Award className="size-5" />
                </div>
              </div>
              <div className="p-6 pt-3 space-y-3">
                <h3 className="text-lg font-bold font-serif text-foreground">
                  Zeiss Diamond-Coat Lenses
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Every pair is fitted with German Zeiss anti-reflective optical glass offering 100% UV400 filtering, blue-light mitigation, and oleophobic smudge repellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complimentary Home Try-On Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center text-left">
            <div className="lg:col-span-7 p-8 sm:p-14 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 font-mono">
                Bespoke At-Home Concierge
              </span>
              <h2 className="text-3xl sm:text-4xl font-normal font-serif text-foreground leading-tight">
                Experience Haute Optometry at Home
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light max-w-lg">
                Select up to 4 frames online. We will dispatch our signature velvet try-on chest to your doorstep for 14 days. Keep your preferred piece; return the rest with our complimentary prepaid courier pickup.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link href="/try-on">
                  <Button
                    size="lg"
                    className="rounded-xl px-7 py-6 text-sm font-semibold tracking-wide shadow-md shrink-0 cursor-pointer"
                  >
                    <Glasses className="size-4 mr-2" />
                    How Home Try-On Operates
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={scrollToCatalog}
                  className="rounded-xl px-6 py-6 text-sm font-medium border-border/80 cursor-pointer"
                >
                  Browse Frames
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 h-72 lg:h-full min-h-75 relative overflow-hidden bg-muted">
              <img
                src="/images/editorial/try-on-chest.jpg"
                alt="Bespoke Try-on Chest"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-card/60 via-transparent to-transparent lg:bg-linear-to-r lg:from-card lg:via-transparent lg:to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-t border-border/70 py-12 bg-card/40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <Truck className="size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Pan-India Express Courier</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-light">Insured expedited delivery on all orders over ₹1,499.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <Glasses className="size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">14-Day Free Home Try-On</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-light">Test up to 4 frames in natural light with zero obligation.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <Shield className="size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">1-Year Lens & Frame Cover</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-light">Free scratch replacement and precision hinge servicing.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <Eye className="size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Certified Opticians</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-light">Prescription precision verified by master optometrists.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function Home() {
  return (
    <React.Suspense fallback={<div className="min-h-screen py-20 text-center text-xs text-muted-foreground font-mono">Loading Atelier...</div>}>
      <StoreContent />
    </React.Suspense>
  )
}
