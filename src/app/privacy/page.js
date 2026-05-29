"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-[#c8f135] hover:underline mb-8">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <h1 className="text-5xl font-black mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
          Privacy Policy
        </h1>
        <p className="text-[#888] mb-8">Last updated: May 2026</p>

        <div className="prose prose-invert max-w-none space-y-6 text-[#e0e0e0]">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you create an account, including your name, email address, and financial data you input into Finova.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Account information (name, email, password)</li>
              <li>Financial data (transactions, budgets, goals)</li>
              <li>Usage analytics and device information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide and improve Finova's services</li>
              <li>To send you technical notifications and support</li>
              <li>To analyze usage patterns and optimize performance</li>
              <li>To ensure security and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. Data Security</h2>
            <p>
              We implement industry-standard encryption and security protocols to protect your financial data. Your information is encrypted both in transit and at rest.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Third-Party Services</h2>
            <p>
              Finova does not sell your data to third parties. We may use trusted service providers for hosting, analytics, and security purposes under strict data protection agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">5. Your Rights</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Access your data anytime through your account</li>
              <li>Request data export in standard formats</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of non-essential communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">6. Contact Us</h2>
            <p>
              For privacy concerns or data requests, contact us at <span className="text-[#c8f135]">privacy@finova.app</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
