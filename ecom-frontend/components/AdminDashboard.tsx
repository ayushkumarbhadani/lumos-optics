"use client"

import * as React from "react"
import {
  PackagePlus,
  FolderPlus,
  ListOrdered,
  CheckCircle2,
  AlertCircle,
  Glasses,
  UploadCloud,
  ImageIcon,
  Loader2,
  X,
  Link2,
  Cloud,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { toast } from "sonner"
import { productSchema, categorySchema, ProductFormData, CategoryFormData } from "@/lib/validations/product"
import { Category, Order, apiFetch, OrderListResponse } from "@/lib/api"
import { formatINR } from "@/lib/format"

interface AdminDashboardProps {
  categories: Category[]
  onDataChanged: () => void
}

export function AdminDashboard({ categories, onDataChanged }: AdminDashboardProps) {
  const [tab, setTab] = React.useState<"products" | "categories" | "orders">("products")

  // Product Form State (Validated with Zod)
  const [productForm, setProductForm] = React.useState<Partial<ProductFormData>>({
    title: "",
    description: "",
    price: 0,
    stock: 0,
    sku: "",
    category_id: categories[0]?.id || 1,
  })
  const [productErrors, setProductErrors] = React.useState<Record<string, string>>({})
  const [productSuccess, setProductSuccess] = React.useState<string | null>(null)
  const [isSubmittingProduct, setIsSubmittingProduct] = React.useState(false)
  const [isUploadingImage, setIsUploadingImage] = React.useState(false)
  const [showManualUrl, setShowManualUrl] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch("http://127.0.0.1:8000/api/v1/products/upload-image", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to upload image")
      }

      const data = await res.json()
      setProductForm((prev) => ({ ...prev, image_url: data.url }))
      if (data.provider === "cloudinary") {
        toast.success("Frame photograph uploaded to Cloudinary CDN!")
      } else {
        toast.success("Frame photograph uploaded successfully!")
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload frame photograph"
      toast.error(msg)
    } finally {
      setIsUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // Category Form State (Validated with Zod)
  const [categoryForm, setCategoryForm] = React.useState<CategoryFormData>({
    name: "",
    description: "",
  })
  const [categoryErrors, setCategoryErrors] = React.useState<Record<string, string>>({})
  const [categorySuccess, setCategorySuccess] = React.useState<string | null>(null)
  const [isSubmittingCategory, setIsSubmittingCategory] = React.useState(false)

  // Orders Management State
  const [allOrders, setAllOrders] = React.useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = React.useState(false)

  const fetchAllOrders = React.useCallback(async () => {
    setLoadingOrders(true)
    try {
      const data = await apiFetch<OrderListResponse>("/orders/?limit=100")
      setAllOrders(data.items || [])
    } catch (err: unknown) {
      console.error("Failed to load admin orders", err)
    } finally {
      setLoadingOrders(false)
    }
  }, [])

  React.useEffect(() => {
    if (tab === "orders") {
      fetchAllOrders()
    }
  }, [tab, fetchAllOrders])

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProductErrors({})
    setProductSuccess(null)

    // Validate with Zod
    const validation = productSchema.safeParse({
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      category_id: Number(productForm.category_id),
    })

    if (!validation.success) {
      const errMap: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as string
        if (!errMap[path]) errMap[path] = issue.message
      })
      setProductErrors(errMap)
      toast.error("Please check the product fields.")
      return
    }

    setIsSubmittingProduct(true)
    try {
      await apiFetch("/products/", {
        method: "POST",
        body: JSON.stringify(validation.data),
      })
      const successMsg = `Frame '${validation.data.title}' added to the catalog!`
      setProductSuccess(successMsg)
      toast.success(successMsg)
      setProductForm({
        title: "",
        description: "",
        price: 0,
        stock: 0,
        sku: "",
        category_id: categories[0]?.id || 1,
      })
      onDataChanged()
      setTimeout(() => setProductSuccess(null), 5000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create product"
      setProductErrors({ form: msg })
      toast.error(msg)
    } finally {
      setIsSubmittingProduct(false)
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCategoryErrors({})
    setCategorySuccess(null)

    // Validate with Zod
    const validation = categorySchema.safeParse(categoryForm)
    if (!validation.success) {
      const errMap: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as string
        if (!errMap[path]) errMap[path] = issue.message
      })
      setCategoryErrors(errMap)
      toast.error("Please enter a valid category name.")
      return
    }

    setIsSubmittingCategory(true)
    try {
      await apiFetch("/categories/", {
        method: "POST",
        body: JSON.stringify(validation.data),
      })
      const successMsg = `Category '${validation.data.name}' added successfully!`
      setCategorySuccess(successMsg)
      toast.success(successMsg)
      setCategoryForm({ name: "", description: "" })
      onDataChanged()
      setTimeout(() => setCategorySuccess(null), 5000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create category"
      setCategoryErrors({ form: msg })
      toast.error(msg)
    } finally {
      setIsSubmittingCategory(false)
    }
  }

  const handleUpdateStatus = async (orderId: number, newStatus: Order["status"]) => {
    try {
      await apiFetch(`/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      })
      toast.success(`Order #${orderId} updated to ${newStatus}.`)
      fetchAllOrders()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update status"
      toast.error(msg)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-heading">Inventory & Operations Management</h2>
        <p className="text-sm text-muted-foreground">
          Manage handcrafted frame inventory, optical categories, and customer lens fulfillment.
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "products" | "categories" | "orders")}>
        <div className="w-full overflow-x-auto pb-1 scrollbar-none">
          <TabsList className="inline-flex w-full sm:w-auto h-auto min-h-11 p-1.5 rounded-xl bg-muted/60 gap-1.5 justify-start">
            <TabsTrigger
              value="products"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium shrink-0 cursor-pointer data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
            >
              <PackagePlus className="size-4 shrink-0 text-primary" />
              <span>Add Frame</span>
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium shrink-0 cursor-pointer data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
            >
              <FolderPlus className="size-4 shrink-0 text-primary" />
              <span>Add Collection</span>
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium shrink-0 cursor-pointer data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
            >
              <ListOrdered className="size-4 shrink-0 text-primary" />
              <span className="hidden sm:inline">All Customer Orders</span>
              <span className="sm:hidden">Customer Orders</span>
              {allOrders.length > 0 && (
                <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4 ml-0.5">
                  {allOrders.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Add Product (Zod Validated) */}
        <TabsContent value="products">
          <Card className="max-w-2xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Add New Eyewear Frame</CardTitle>
              <CardDescription>
                Validated with Zod schema and published live to the Lumos Optics storefront.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {productSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium border border-emerald-500/20 flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0" />
                  {productSuccess}
                </div>
              )}

              {productErrors.form && (
                <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  {productErrors.form}
                </div>
              )}

              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="prod-title">
                      Model / Frame Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="prod-title"
                      value={productForm.title || ""}
                      onChange={(e) => setProductForm((p) => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Lumos Aviator Brushed Gold"
                    />
                    {productErrors.title && <p className="text-xs text-destructive mt-1">{productErrors.title}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="prod-sku">
                      SKU Code <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="prod-sku"
                      value={productForm.sku || ""}
                      onChange={(e) => setProductForm((p) => ({ ...p, sku: e.target.value.toUpperCase() }))}
                      placeholder="e.g. EYE-AV-009"
                    />
                    {productErrors.sku && <p className="text-xs text-destructive mt-1">{productErrors.sku}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="prod-price">
                      Retail Price (₹) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="prod-price"
                      type="number"
                      step="1"
                      value={productForm.price ?? ""}
                      onChange={(e) => setProductForm((p) => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                      placeholder="2999"
                    />
                    {productErrors.price && <p className="text-xs text-destructive mt-1">{productErrors.price}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="prod-stock">
                      Stock Count <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="prod-stock"
                      type="number"
                      step="1"
                      value={productForm.stock ?? ""}
                      onChange={(e) => setProductForm((p) => ({ ...p, stock: parseInt(e.target.value, 10) || 0 }))}
                      placeholder="50"
                    />
                    {productErrors.stock && <p className="text-xs text-destructive mt-1">{productErrors.stock}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="prod-category">
                      Collection <span className="text-destructive">*</span>
                    </Label>
                    <select
                      id="prod-category"
                      value={productForm.category_id || categories[0]?.id || 1}
                      onChange={(e) => setProductForm((p) => ({ ...p, category_id: parseInt(e.target.value, 10) }))}
                      className="flex h-8 w-full rounded-lg border border-input bg-card px-2.5 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id} className="bg-background text-foreground">
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {productErrors.category_id && (
                      <p className="mt-1 text-xs font-medium text-destructive">{productErrors.category_id}</p>
                    )}
                  </div>
                </div>

                {/* Cloudinary Image Uploader */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="prod-image-upload" className="flex items-center gap-1.5">
                      <ImageIcon className="size-4 text-primary" />
                      <span>Eyewear Photograph</span>
                      <span className="text-xs text-muted-foreground font-normal">(Cloudinary CDN / Local)</span>
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowManualUrl(!showManualUrl)}
                      className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Link2 className="size-3" />
                      {showManualUrl ? "Use File Upload" : "Enter Direct URL"}
                    </button>
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    id="prod-image-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />

                  {!showManualUrl ? (
                    <div>
                      {productForm.image_url ? (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border/80">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="size-14 rounded-lg overflow-hidden bg-card shrink-0 border border-border shadow-xs">
                              <img
                                src={productForm.image_url}
                                alt="Frame Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.style.display = "none")}
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-foreground">Uploaded Photograph</span>
                                <Badge variant="secondary" className="text-[9px] py-0 px-1.5 h-4 gap-0.5">
                                  <Cloud className="size-2.5 text-sky-500" />
                                  {productForm.image_url.includes("cloudinary") ? "Cloudinary CDN" : "Hosted Asset"}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-muted-foreground truncate font-mono mt-0.5 max-w-xs">
                                {productForm.image_url}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={isUploadingImage}
                              onClick={() => fileInputRef.current?.click()}
                              className="text-xs rounded-lg cursor-pointer h-8"
                            >
                              Replace
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setProductForm((p) => ({ ...p, image_url: "" }))}
                              className="text-muted-foreground hover:text-destructive cursor-pointer rounded-lg h-8 w-8"
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                            isUploadingImage
                              ? "border-primary/50 bg-primary/5 cursor-wait"
                              : "border-border hover:border-primary/60 hover:bg-secondary/30 bg-card/50"
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center space-y-2">
                            {isUploadingImage ? (
                              <>
                                <Loader2 className="size-8 text-primary animate-spin" />
                                <div className="space-y-0.5">
                                  <p className="text-xs font-semibold text-foreground">Uploading Frame Photograph...</p>
                                  <p className="text-[11px] text-muted-foreground">Optimizing & distributing to Cloudinary CDN</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-xs">
                                  <UploadCloud className="size-5" />
                                </div>
                                <div className="space-y-0.5">
                                  <p className="text-xs font-semibold text-foreground">
                                    Click or drop eyewear image to upload
                                  </p>
                                  <p className="text-[11px] text-muted-foreground">
                                    Supports JPG, PNG, WebP up to 10MB &bull; Automated Cloudinary CDN hosting
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        id="prod-image-manual"
                        value={productForm.image_url || ""}
                        onChange={(e) => setProductForm((p) => ({ ...p, image_url: e.target.value }))}
                        placeholder="https://res.cloudinary.com/... or https://..."
                        className="rounded-xl"
                      />
                      {productForm.image_url && (
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-secondary/50 border border-border/60">
                          <div className="size-12 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                            <img
                              src={productForm.image_url}
                              alt="Frame Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground truncate font-mono">
                            {productForm.image_url}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {productErrors.image_url && (
                    <p className="text-xs text-destructive mt-1">{productErrors.image_url}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="prod-desc">
                    Frame Specifications & Lens Coating <span className="text-destructive">*</span>
                  </Label>
                  <textarea
                    id="prod-desc"
                    rows={3}
                    value={productForm.description || ""}
                    onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Handcrafted acetate, polarized UV400 lenses, stainless steel 5-barrel hinges..."
                    className="flex w-full rounded-xl border border-input bg-card px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  {productErrors.description && (
                    <p className="mt-1 text-xs font-medium text-destructive">{productErrors.description}</p>
                  )}
                </div>

                <Button type="submit" disabled={isSubmittingProduct} className="w-full sm:w-auto cursor-pointer rounded-xl">
                  {isSubmittingProduct ? "Publishing Frame..." : "Publish Frame to Storefront"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Add Category (Zod Validated) */}
        <TabsContent value="categories">
          <Card className="max-w-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Add Eyewear Collection</CardTitle>
              <CardDescription>
                Create optical categories with automatic slug generation for storefront navigation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categorySuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium border border-emerald-500/20 flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0" />
                  {categorySuccess}
                </div>
              )}

              {categoryErrors.form && (
                <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  {categoryErrors.form}
                </div>
              )}

              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="cat-name">
                    Collection Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="cat-name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm((c) => ({ ...c, name: e.target.value }))}
                    placeholder="e.g. Aviator & Pilot Frames"
                  />
                  {categoryErrors.name && <p className="text-xs text-destructive mt-1">{categoryErrors.name}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cat-desc">Description (Optional)</Label>
                  <Input
                    id="cat-desc"
                    value={categoryForm.description || ""}
                    onChange={(e) => setCategoryForm((c) => ({ ...c, description: e.target.value }))}
                    placeholder="Premium polarized sunglasses engineered for outdoor sun glare"
                  />
                </div>

                <Button type="submit" disabled={isSubmittingCategory} className="w-full sm:w-auto cursor-pointer rounded-xl">
                  {isSubmittingCategory ? "Saving Collection..." : "Save Collection"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: All Customer Orders */}
        <TabsContent value="orders">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Customer Orders & Fulfillment</CardTitle>
              <CardDescription>
                Live order tracking, customer prescriptions, and delivery dispatch states.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingOrders ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Loading orders from backend...
                </div>
              ) : allOrders.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No orders placed yet across the platform.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount (₹)</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Delivery Address</TableHead>
                      <TableHead className="text-right">Fulfillment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allOrders.map((ord) => (
                      <TableRow key={ord.id}>
                        <TableCell className="font-mono font-semibold text-xs">
                          {ord.order_number}
                        </TableCell>
                        <TableCell className="text-xs">
                          User #{ord.user_id}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              ord.status === "cancelled"
                                ? "destructive"
                                : ord.status === "delivered"
                                ? "outline"
                                : "secondary"
                            }
                            className={`text-[10px] uppercase font-mono ${
                              ord.status === "delivered"
                                ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                                : ord.status === "pending"
                                ? "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10"
                                : ""
                            }`}
                          >
                            {ord.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-xs">
                          {formatINR(ord.total_amount)}
                        </TableCell>
                        <TableCell className="text-xs">
                          {ord.items.length} frame(s)
                        </TableCell>
                        <TableCell className="text-xs max-w-[200px] truncate text-muted-foreground">
                          {ord.shipping_address}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {ord.status === "pending" && (
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={() => handleUpdateStatus(ord.id, "processing")}
                                className="rounded-lg"
                              >
                                Craft Lenses
                              </Button>
                            )}
                            {(ord.status === "pending" || ord.status === "processing") && (
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={() => handleUpdateStatus(ord.id, "shipped")}
                                className="rounded-lg"
                              >
                                Ship Order
                              </Button>
                            )}
                            {ord.status === "shipped" && (
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={() => handleUpdateStatus(ord.id, "delivered")}
                                className="rounded-lg"
                              >
                                Mark Delivered
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
