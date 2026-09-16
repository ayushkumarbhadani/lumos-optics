import type { Metadata } from "next"
import Link from "next/link"
import { Scale, CheckCircle2, ShieldAlert, Sparkles, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Atelier — Lumos Optics",
  description: "Terms and conditions governing bespoke eyewear crafting, prescription lens calibration, and warranty policies.",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 max-w-4xl text-left">
      {/* Header */}
      <div className="mb-10 space-y-3 border-b border-border/70 pb-8">
        <Link href="/" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="size-3.5 mr-1.5" /> Back to Storefront
        </Link>
        <span className="text-xs font-semibold uppercase tracking-widest text-primary font-mono block">
          Legal Framework &bull; Bespoke Contract
        </span>
        <h1 className="text-4xl sm:text-5xl font-normal font-serif text-foreground tracking-tight">
          Terms of the Lumos Atelier
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed max-w-2xl">
          By commissioning handcrafted optical frames or polarized sunglasses from Lumos Optics, you enter into a binding agreement structured under Indian consumer and commercial law.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-10 text-sm leading-relaxed text-muted-foreground font-light">
        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
            <Scale className="size-5 text-primary" /> 1. Bespoke Manufacturing & Lens Surfacing
          </h2>
          <p>
            Because prescription lenses are digitally surfaced and laser-edged to your specific pupillary coordinates and frame curvature, production initiates immediately following order placement. All optical lenses adhere to ANSI Z80.1 and ISO 21987 standards for ophthalmic optics.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
            <Sparkles className="size-5 text-primary" /> 2. 1-Year Comprehensive Atelier Warranty
          </h2>
          <p>
            Every authentic Lumos frame includes a 365-day warranty against manufacturing flaws:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-foreground/90">
            <li><strong>Titanium Temples & Solder Joints:</strong> Lifetime coverage against structural failure or micro-welding defects.</li>
            <li><strong>Mazzucchelli Acetate:</strong> Coverage against discoloration, delamination, or barrel hinge loosening.</li>
            <li><strong>Zeiss Diamond-Coat Lenses:</strong> Complimentary one-time lens replacement in the event of anti-reflective peeling or coating crazing.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
            <ShieldAlert className="size-5 text-primary" /> 3. Order Cancellations & Inventory Rollback
          </h2>
          <p>
            Orders can be cancelled directly through your Lumos account dashboard prior to the order status transitioning to <em>"shipped"</em>. Upon cancellation, your reserved stock count is instantaneously rolled back into the public inventory catalog, and your payment is refunded via the original payment source within 3–5 banking business days.
          </p>
        </section>
      </div>

      <div className="mt-14 pt-8 border-t border-border/60 flex items-center justify-between">
        <Link href="/shipping" className="text-xs text-primary font-medium hover:underline">
          Read Shipping & Returns &rarr;
        </Link>
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
          Return to Lumos Optics Storefront
        </Link>
      </div>
    </div>
  )
}
