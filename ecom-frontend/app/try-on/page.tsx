import type { Metadata } from "next"
import Link from "next/link"
import { Glasses, Sparkles, CheckCircle2, ArrowRight, Truck, RotateCcw, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "14-Day Home Try-On Concierge — Lumos Optics",
  description: "Experience 4 handcrafted frames in the comfort of your home. 14 days, zero obligation, complimentary return courier.",
}

export default function TryOnPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 max-w-5xl text-left">
      {/* Header Section */}
      <div className="mb-14 space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary border border-border/80 text-[11px] font-semibold tracking-widest uppercase">
          <Sparkles className="size-3.5 text-amber-500" />
          <span>Bespoke Concierge Fitting</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-normal font-serif text-foreground tracking-tight leading-tight">
          Experience Haute Optometry in Your Own Home
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
          Finding the silhouette that harmonizes with your bone structure takes natural daylight and zero pressure. Select up to 4 frames online; we dispatch our signature velvet chest to your residence for 14 days.
        </p>
        <div className="pt-2 flex justify-center">
          <Link href="/">
            <Button size="lg" className="rounded-xl px-8 py-6 text-sm font-semibold shadow-md cursor-pointer">
              Explore Frames to Select Your 4
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Featured Visual */}
      <div className="relative rounded-3xl overflow-hidden border border-border/80 h-96 sm:h-96 mb-16 shadow-lg bg-muted">
        <img
          src="/images/editorial/try-on-chest.jpg"
          alt="Lumos Signature Home Try-On Chest"
          className="w-full h-full object-cover object-[50%_75%]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent flex items-end p-8 sm:p-12">
          <div className="max-w-md space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
              The Lumos Fitting Chest
            </span>
            <h3 className="text-2xl font-serif font-normal text-foreground">
              Hand-Delivered in Italian Velvet
            </h3>
            <p className="text-xs text-muted-foreground font-light">
              Includes precision optical sizing ruler, microfiber cleaning cloth, and pre-addressed return waybill.
            </p>
          </div>
        </div>
      </div>

      {/* Step by Step Protocol */}
      <div className="space-y-6 mb-16">
        <div className="text-center space-y-1 mb-8">
          <span className="text-xs font-mono font-semibold uppercase text-primary tracking-wider">How It Operates</span>
          <h2 className="text-2xl sm:text-3xl font-serif text-foreground">4 Simple Steps to Clarity</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3">
            <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-xs">
              01
            </span>
            <h3 className="text-base font-bold font-serif text-foreground">Curate Your 4 Frames</h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Explore our portfolio of aviators, wayfarers, and titanium wire frames. Pick up to 4 silhouettes.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3">
            <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-xs">
              02
            </span>
            <h3 className="text-base font-bold font-serif text-foreground">Complimentary Courier</h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              We dispatch your sealed fitting kit directly to your home via insured express transit.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3">
            <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-xs">
              03
            </span>
            <h3 className="text-base font-bold font-serif text-foreground">14 Days of Testing</h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Try your frames throughout the day with your wardrobe and consult friends and family at your leisure.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3">
            <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-xs">
              04
            </span>
            <h3 className="text-base font-bold font-serif text-foreground">Keep One, Return Free</h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Order your prescription lenses for the frame you love. Pack the rest; our courier collects them at zero charge.
            </p>
          </div>
        </div>
      </div>

      {/* Guarantee & CTA Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-secondary/50 border border-border/80 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <h3 className="text-xl font-serif font-bold text-foreground">Zero Security Deposit Required</h3>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Verified Lumos client members enjoy instant home try-on eligibility. Experience luxury optical craftsmanship with zero upfront commitment.
          </p>
        </div>

        <Link href="/">
          <Button size="lg" className="rounded-xl px-8 shadow-xs cursor-pointer">
            <Glasses className="size-4 mr-2" />
            Start Selecting Frames
          </Button>
        </Link>
      </div>
    </div>
  )
}
