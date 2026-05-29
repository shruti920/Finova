"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-[#c8f135] hover:underline mb-8">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <h1 className="text-5xl font-black mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
          About Finova
        </h1>

        <div className="prose prose-invert max-w-none space-y-6 text-[#e0e0e0]">
          <p className="text-lg leading-relaxed">
            Finova is a financial command center built for Gen Z. We believe managing money doesn't have to be boring, complicated, or detached from reality.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
            <p>
              We're reimagining personal finance for the generation that grew up digital-first. Finova combines dark aesthetics, real-time insights, and a focus on the small daily decisions that compound into financial health.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">What We Offer</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Real-time cashflow tracking and balance alerts</li>
              <li>Smart budget management with visual spend maps</li>
              <li>Goal tracking with achievement streaks</li>
              <li>Recurring charge detection to catch subscriptions</li>
              <li>AI-powered financial insights and recommendations</li>
              <li>Receipt scanning for automated expense tracking</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Why Finova?</h2>
            <p>
              We don't believe in one-size-fits-all finance apps. Finova is built from the ground up for people who:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Want to actually understand their money flow</li>
              <li>Appreciate high-energy, modern design</li>
              <li>Need to make quick financial decisions</li>
              <li>Are building wealth, not just managing debt</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Built for You</h2>
            <p>
              Every feature in Finova is designed with real user feedback. We're continuously evolving based on what matters to you, because your financial health is our mission.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
