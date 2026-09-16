import type { Metadata } from "next"
import Link from "next/link"
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Privacy Protocol — Lumos Optics",
  description: "Our commitment to client confidentiality, ophthalmic prescription security, and digital privacy.",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 max-w-4xl text-left">
      {/* Header */}
      <div className="mb-10 space-y-3 border-b border-border/70 pb-8">
        <Link href="/" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="size-3.5 mr-1.5" /> Back to Storefront
        </Link>
        <span className="text-xs font-semibold uppercase tracking-widest text-primary font-mono block">
          Client Confidentiality &bull; ISO/IEC 27001 Aligned
        </span>
        <h1 className="text-4xl sm:text-5xl font-normal font-serif text-foreground tracking-tight">
          Privacy & Optical Data Protocol
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed max-w-2xl">
          Effective Date: January 1, 2026. At Lumos Optics, we treat optical measurements and client identities with the utmost artisanal discretion and military-grade encryption.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-10 text-sm leading-relaxed text-muted-foreground font-light">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
            <Lock className="size-5 text-primary" /> 1. Ophthalmic Data & Prescription Security
          </h2>
          <p>
            When you commission prescription eyewear from Lumos Optics, your spherical correction, cylindrical axis, pupillary distance (PD), and optometrist records are stored in encrypted medical-grade data vaults. These records are accessible solely to certified dispensing opticians supervising your lens surfacing.
          </p>
          <p>
            We strictly do not share, sell, or monetize ophthalmic records or client biometric measurements with third-party advertising brokers or pharmaceutical data exchanges.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
            <Eye className="size-5 text-primary" /> 2. Information We Collect
          </h2>
          <p>
            In order to deliver bespoke frames to your residence and fulfill statutory warranty obligations, we gather:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-foreground/90">
            <li><strong>Identity & Contact:</strong> Full legal name, verified email address, and WhatsApp/SMS delivery notification number.</li>
            <li><strong>Dispatch Logistics:</strong> Physical residence or office address, postal PIN code, and courier access guidelines.</li>
            <li><strong>Optical Specifications:</strong> Custom lens selection, prescription diopter parameters, and anti-reflective coating tiers.</li>
            <li><strong>Transaction Records:</strong> Tokenized payment authorization receipts. Lumos does not retain credit card CVVs or bank credentials.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" /> 3. RBI & Pan-India Financial Compliance
          </h2>
          <p>
            All electronic payments (UPI, RuPay, Visa, Mastercard, NetBanking) are processed through Reserve Bank of India (RBI) authorized payment gateways featuring 256-bit SSL encryption and mandatory 2-Factor Authentication (OTP).
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold font-serif text-foreground flex items-center gap-2">
            <FileText className="size-5 text-primary" /> 4. Client Rights & Erasure Requests
          </h2>
          <p>
            Clients may request an itemized export of their purchase history or invoke their Right to Erasure at any time by contacting our Data Protection Officer at <code className="text-primary font-mono">privacy@lumosoptics.in</code>.
          </p>
        </section>
      </div>

      <div className="mt-14 pt-8 border-t border-border/60 flex items-center justify-between">
        <Link href="/cookies" className="text-xs text-primary font-medium hover:underline">
          Read Cookie Preferences &rarr;
        </Link>
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
          Return to Lumos Optics Storefront
        </Link>
      </div>
    </div>
  )
}
