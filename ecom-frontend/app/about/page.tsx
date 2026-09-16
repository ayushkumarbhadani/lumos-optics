import type { Metadata } from "next"
import Link from "next/link"
import { Feather, Gem, Award, ArrowRight, Glasses, MapPin, Sparkles, ShieldCheck, Sun, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Atelier Heritage & Indian Roots — Lumos Optics",
  description: "The story of Lumos Optics: India's premier luxury optical maison. Born in New Delhi, handcrafted with Japanese beta-titanium, Italian acetate, and Zeiss lenses.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 max-w-5xl text-left space-y-16">
      {/* Hero Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary border border-border/80 text-[11px] font-semibold tracking-widest uppercase">
          <Sparkles className="size-3.5 text-amber-500" />
          <span>India&apos;s Haute Optical Maison &bull; Est. New Delhi</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-normal font-serif text-foreground tracking-tight leading-tight">
          Where Indian Artistry Meets Sabae Titanium & Italian Acetate
        </h1>
        <p className="text-sm sm:text-lg text-muted-foreground font-light leading-relaxed">
          Founded in the heritage design quarters of New Delhi, Lumos Optics was born to pioneer world-class luxury eyewear rooted in India. We unite centuries of Indian metallurgical artistry with Japanese aerospace titanium, cured Italian acetate, and Carl Zeiss precision lenses.
        </p>
      </div>

      {/* India Heritage Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2 shadow-2xs">
          <MapPin className="size-5 text-primary" />
          <h3 className="font-serif text-base font-semibold text-foreground">New Delhi & Bengaluru</h3>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Flagship atelier in Delhi and precision lens surfacing lab in Bengaluru.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2 shadow-2xs">
          <Compass className="size-5 text-amber-500" />
          <h3 className="font-serif text-base font-semibold text-foreground">IndoFit™ Ergonomics</h3>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Proprietary nose bridge & temple curvature tailored specifically for Indian facial contours.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2 shadow-2xs">
          <Sun className="size-5 text-amber-600 dark:text-amber-400" />
          <h3 className="font-serif text-base font-semibold text-foreground">Tropical Climate Ready</h3>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Engineered with anti-corrosive, sweat-resistant, and high-UV400 coatings for the Indian climate.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2 shadow-2xs">
          <ShieldCheck className="size-5 text-emerald-500" />
          <h3 className="font-serif text-base font-semibold text-foreground">Pan-India Express</h3>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Insured door-to-door delivery & home try-on across 19,000+ Indian postal codes.
          </p>
        </div>
      </div>

      {/* Story Chapter 1: The Indian Origin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="h-96 rounded-3xl overflow-hidden border border-border/80 shadow-md">
          <img
            src="/images/editorial/craft-titanium.jpg"
            alt="Atelier Craftsmanship and Metallurgical Precision"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <span className="text-xs font-mono font-semibold uppercase text-primary tracking-wider">
            Mehrauli, New Delhi &bull; The Atelier Vision
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-foreground">
            Reclaiming Luxury for the Indian Connoisseur
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
            For generations, Indian patrons were offered either generic imported frames designed for Western ergonomics or fast-fashion synthetic eyewear with fragile hinges. Lumos Optics set out to disrupt this disparity. Drawing inspiration from Jaipur&apos;s royal jewellery metallurgy and Delhi&apos;s architectural symmetry, our designs honor Indian heritage while adhering to the world&apos;s most stringent optical tolerances.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
            Each temple core is delicately wire-drawn, bearing subtle Indian botanical filigree and balanced to sit effortlessly without pressure on the temples or nasal crest.
          </p>
        </div>
      </div>

      {/* Story Chapter 2: Global Materials, Handcrafted in India */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 order-2 md:order-1">
          <span className="text-xs font-mono font-semibold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
            Sabae, Japan &bull; Castiglione, Italy
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-foreground">
            Aerospace Beta-Titanium & Organic Cured Acetate
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
            To achieve featherlight durability, we procure raw beta-titanium from Fukui, Japan and pure cotton cellulose acetate from Mazzucchelli 1849 in northern Italy. In our Indian atelier, these materials undergo 48 hours of precision hand-tumbling with Japanese bamboo chips and Bavarian pumice stone, followed by multi-stage micro-polishing by our master craftsmen.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
            The result is a frame that weighs as little as 12 grams, retains organic warmth against the skin, and withstands the humidity of Mumbai monsoons and the dry heat of Rajasthan without tarnishing.
          </p>
        </div>
        <div className="h-96 rounded-3xl overflow-hidden border border-border/80 shadow-md order-1 md:order-2">
          <img
            src="/images/editorial/craft-acetate.jpg"
            alt="Hand-carved organic cellulose acetate"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Story Chapter 3: German Optics & White-Glove Pan-India Concierge */}
      <div className="p-8 sm:p-14 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-mono font-semibold uppercase text-primary tracking-wider">
            Carl Zeiss Optical Partnership &bull; Bengaluru Lab
          </span>
          <h2 className="text-3xl font-serif text-foreground">
            Precision Laser-Etched Optics, Delivered in ₹
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
            Every Lumos prescription lens and UV400 polarized model is surfaced in Bengaluru with German Carl Zeiss diamond-coat optics. We believe luxury should be completely transparent: no hidden import surcharges, no currency conversion fees. Every frame is priced purely in Indian Rupees (₹) and backed by our comprehensive 1-year anti-scratch warranty.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap gap-4">
          <Link href="/">
            <Button size="lg" className="rounded-xl px-8 shadow-xs cursor-pointer">
              <Glasses className="size-4 mr-2" />
              Explore The Indian Collection
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </Link>
          <Link href="/try-on">
            <Button variant="outline" size="lg" className="rounded-xl px-6 cursor-pointer">
              <Sparkles className="size-4 mr-2 text-amber-500" />
              14-Day Complimentary Home Try-On
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
