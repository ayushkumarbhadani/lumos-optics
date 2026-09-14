"use client"

import * as React from "react"
import { Lock, UserCheck, ShieldCheck } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from "@/lib/validations/auth"
import { useAuth } from "@/context/AuthContext"

interface AuthModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AuthModal({ open: propOpen, onOpenChange: propOnOpenChange }: AuthModalProps = {}) {
  const { login, register, isAuthModalOpen, setIsAuthModalOpen } = useAuth()
  const open = propOpen !== undefined ? propOpen : isAuthModalOpen
  const onOpenChange = propOnOpenChange || setIsAuthModalOpen
  const [tab, setTab] = React.useState<"login" | "register">("login")

  // Login State
  const [loginData, setLoginData] = React.useState<LoginFormData>({
    email: "customer@ecommerce.com",
    password: "customerpassword123",
  })
  const [loginErrors, setLoginErrors] = React.useState<Record<string, string>>({})

  // Register State
  const [registerData, setRegisterData] = React.useState<RegisterFormData>({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  })
  const [registerErrors, setRegisterErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginErrors({})

    const validation = loginSchema.safeParse(loginData)
    if (!validation.success) {
      const errorsMap: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as string
        if (!errorsMap[path]) errorsMap[path] = issue.message
      })
      setLoginErrors(errorsMap)
      return
    }

    setIsSubmitting(true)
    try {
      await login(validation.data.email, validation.data.password)
      onOpenChange(false)
      toast.success("Authenticated successfully with JWT!")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Incorrect email or password"
      setLoginErrors({ form: msg })
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterErrors({})

    const validation = registerSchema.safeParse(registerData)
    if (!validation.success) {
      const errorsMap: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as string
        if (!errorsMap[path]) errorsMap[path] = issue.message
      })
      setRegisterErrors(errorsMap)
      return
    }

    setIsSubmitting(true)
    try {
      await register({
        full_name: validation.data.full_name,
        email: validation.data.email,
        password: validation.data.password,
        role: validation.data.role,
      })
      onOpenChange(false)
      toast.success(`Welcome to ShopPulse, ${validation.data.full_name}!`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed. Email might already exist."
      setRegisterErrors({ form: msg })
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillDemo = (role: "admin" | "customer") => {
    if (role === "admin") {
      setLoginData({
        email: "admin@ecommerce.com",
        password: "adminpassword123",
      })
      toast.info("Admin demo credentials filled.")
    } else {
      setLoginData({
        email: "customer@ecommerce.com",
        password: "customerpassword123",
      })
      toast.info("Customer demo credentials filled.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="size-5" /> Account Portal
          </DialogTitle>
          <DialogDescription>
            Sign in or create an account to manage orders, carts, and preferences.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")}>
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Create Account</TabsTrigger>
          </TabsList>

          {/* Sign In Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {loginErrors.form && (
                <div className="p-2.5 rounded-md bg-destructive/10 text-destructive text-xs font-medium">
                  {loginErrors.form}
                </div>
              )}

              <div className="space-y-1 text-left">
                <Label htmlFor="login-email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="name@example.com"
                />
                {loginErrors.email && <p className="text-xs text-destructive">{loginErrors.email}</p>}
              </div>

              <div className="space-y-1 text-left">
                <Label htmlFor="login-password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                />
                {loginErrors.password && <p className="text-xs text-destructive">{loginErrors.password}</p>}
              </div>

              {/* Quick Demo Fills */}
              <div className="pt-1">
                <span className="text-[11px] text-muted-foreground block mb-1.5 text-left font-medium">
                  Quick Fill Seeded Accounts:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemo("customer")}
                    className="flex items-center justify-center gap-1.5 p-1.5 rounded border border-border bg-muted/40 hover:bg-muted text-xs font-medium text-foreground transition-colors cursor-pointer"
                  >
                    <UserCheck className="size-3.5" /> Customer Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemo("admin")}
                    className="flex items-center justify-center gap-1.5 p-1.5 rounded border border-border bg-muted/40 hover:bg-muted text-xs font-medium text-foreground transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="size-3.5" /> Admin Demo
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full mt-3 cursor-pointer">
                {isSubmitting ? "Signing in..." : "Sign In with JWT"}
              </Button>
            </form>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-left">
              {registerErrors.form && (
                <div className="p-2.5 rounded-md bg-destructive/10 text-destructive text-xs font-medium">
                  {registerErrors.form}
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="reg-name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="reg-name"
                  value={registerData.full_name}
                  onChange={(e) => setRegisterData((p) => ({ ...p, full_name: e.target.value }))}
                  placeholder="Your Name"
                />
                {registerErrors.full_name && <p className="text-xs text-destructive">{registerErrors.full_name}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="reg-email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData((p) => ({ ...p, email: e.target.value }))}
                  placeholder="your.email@example.com"
                />
                {registerErrors.email && <p className="text-xs text-destructive">{registerErrors.email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="reg-password">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData((p) => ({ ...p, password: e.target.value }))}
                    placeholder="Min 6 chars"
                  />
                  {registerErrors.password && <p className="text-xs text-destructive">{registerErrors.password}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="reg-confirm">
                    Confirm <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData((p) => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="Repeat pass"
                  />
                  {registerErrors.confirmPassword && (
                    <p className="text-xs text-destructive">{registerErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full mt-2 cursor-pointer">
                {isSubmitting ? "Creating..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
