import type { Metadata } from "next"
import Link from "next/link"
import { Truck, RotateCcw, ShieldCheck, MapPin, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Dispatch & Returns — Lumos Optics",
  description: "Expedited insured courier transit across India, signature packaging, and our 14-day return protocol.",
}

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 max-w-4xl text-left">
      {/* Header */}
      <div className="mb-10 space-y-3 border-b border-border/70 pb-8">
        <Link href="/" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="size-3.5 mr-1.5" /> Back to Storefront
        </Link>
        <span className="text-xs font-semibold uppercase tracking-widest text-primary font-mono block">
          Logistics & Concierge &bull; Pan-India Coverage
        </span>
        <h1 className="text-4xl sm:text-5xl font-normal font-serif text-foreground tracking-tight">
          Dispatch, Transit & Returns Protocol
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed max-w-2xl">
          Complimentary insured express courier on every eyewear order exceeding ₹1,499. Every parcel is hand-inspected and sealed in our signature temperature-controlled transit casket.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-10 text-sm leading-relaxed text-muted-foreground font-light">
        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
            <Truck className="size-5 text-primary" /> 1. Dispatch Timelines & Optical Calibration
          </h2>
          <p>
            Because Lumos frames receive individual optical calibration, our handling timelines are structured as follows:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl border border-border/80 bg-card space-y-1">
              <span className="font-semibold text-foreground text-sm">Non-Prescription Sunglasses</span>
              <p className="text-xs text-muted-foreground">Dispatched within 24 hours via air express courier.</p>
            </div>
            <div className="p-4 rounded-2xl border border-border/80 bg-card space-y-1">
              <span className="font-semibold text-foreground text-sm">Custom Prescription & Blue-Light</span>
              <p className="text-xs text-muted-foreground">Dispatched in 48–72 hours following Zeiss digital surfacing & optical QC.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
            <MapPin className="size-5 text-primary" /> 2. Metropolitan Transit Windows
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-foreground/90">
            <li><strong>Tier-1 Metros (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata):</strong> 24–48 hours transit.</li>
            <li><strong>Tier-2 & Pan-India Towns:</strong> 3–4 business days with end-to-end SMS tracking.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
            <RotateCcw className="size-5 text-primary" /> 3. 14-Day Complimentary Returns
          </h2>
          <p>
            If a frame silhouette does not suit your facial anatomy or style preference, simply initiate a return from your <strong>My Orders</strong> page or contact our concierge within 14 days of receipt. We will dispatch a courier partner to pick up the frame at zero additional cost to you.
          </p>
        </section>
      </div>

      <div className="mt-14 pt-8 border-t border-border/60 flex items-center justify-between">
        <Link href="/try-on" className="text-xs text-primary font-medium hover:underline">
          Explore Home Try-On Service &rarr;
        </Link>
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
          Return to Lumos Optics Storefront
        </Link>
      </div>
    </div>
  )
}
