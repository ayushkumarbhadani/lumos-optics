import type { Metadata } from "next"
import Link from "next/link"
import { Cookie, Settings, Shield, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Cookie Protocol — Lumos Optics",
  description: "Learn how Lumos Optics uses functional and session cookies to preserve your bespoke shopping bag and preferences.",
}

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 max-w-4xl text-left">
      {/* Header */}
      <div className="mb-10 space-y-3 border-b border-border/70 pb-8">
        <Link href="/" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="size-3.5 mr-1.5" /> Back to Storefront
        </Link>
        <span className="text-xs font-semibold uppercase tracking-widest text-primary font-mono block">
          Digital Architecture &bull; Cookie Protocol
        </span>
        <h1 className="text-4xl sm:text-5xl font-normal font-serif text-foreground tracking-tight">
          Cookie & Session Preferences
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed max-w-2xl">
          We use minimal, high-efficiency functional cookies to power seamless bag synchronization, JWT token authentication, and currency conversion without invasive tracking.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-10 text-sm leading-relaxed text-muted-foreground font-light">
        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
            <Cookie className="size-5 text-primary" /> 1. What Are Digital Cookies?
          </h2>
          <p>
            Cookies are microscopic alphanumeric data packets placed temporarily in your local browser sandbox. They enable our web application to recognize your active eyewear cart, preserve filter state, and keep you securely signed in as you browse our collections.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
            <Settings className="size-5 text-primary" /> 2. Categories of Cookies We Employ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">Strictly Essential</span>
              <h3 className="text-base font-bold text-foreground">Authentication & Token Security</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Maintains your signed-in JWT session and protects form submissions against cross-site request forgery (CSRF). Cannot be toggled off.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Functional Experience</span>
              <h3 className="text-base font-bold text-foreground">Shopping Bag & Lens Selections</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Preserves items added to your Lumos shopping bag and home try-on reservations across page navigation and browser reloads.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
            <Shield className="size-5 text-primary" /> 3. Managing Local Cookie Storage
          </h2>
          <p>
            You may adjust your local storage preferences or clear stored session tokens at any time via your browser settings (Chrome, Safari, Firefox, or Edge). Note that clearing local storage will log you out of your Lumos account and reset your active shopping bag.
          </p>
        </section>
      </div>

      <div className="mt-14 pt-8 border-t border-border/60 flex items-center justify-between">
        <Link href="/terms" className="text-xs text-primary font-medium hover:underline">
          Read Terms of Atelier &rarr;
        </Link>
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
          Return to Lumos Optics Storefront
        </Link>
      </div>
    </div>
  )
}
