"use client"

import Link from "next/link"
import { ArrowLeft, BookOpen, Zap, Target, Wallet, LogIn } from "lucide-react"

const docs = [
  {
    icon: LogIn,
    title: "Getting Started",
    description: "Create your account and set up Finova in minutes",
    color: "text-[#c8f135]",
  },
  {
    icon: Wallet,
    title: "Tracking Transactions",
    description: "Learn how to log and categorize your spending",
    color: "text-[#00d4ff]",
  },
  {
    icon: Target,
    title: "Setting Budgets",
    description: "Create budget lanes and set spending limits",
    color: "text-[#ff3cac]",
  },
  {
    icon: Zap,
    title: "Goals & Savings",
    description: "Track savings goals and monitor progress",
    color: "text-[#ff6b35]",
  },
  {
    icon: BookOpen,
    title: "AI Insights",
    description: "Understand your cashflow with AI-powered analysis",
    color: "text-[#a78bfa]",
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-[#c8f135] hover:underline mb-8">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <h1 className="text-5xl font-black mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
          Documentation
        </h1>
        <p className="text-[#999] text-lg mb-12">
          Complete guides and tutorials to help you master Finova.
        </p>

        <div className="space-y-6 mb-12">
          {docs.map((doc, index) => {
            const Icon = doc.icon
            return (
              <div
                key={index}
                className="p-6 bg-[#111] border border-[#333] rounded-lg hover:border-[#c8f135]/30 transition cursor-pointer group"
              >
                <div className="flex gap-4 items-start">
                  <div className={`mt-1 ${doc.color}`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-[#c8f135] transition">
                      {doc.title}
                    </h3>
                    <p className="text-[#888]">{doc.description}</p>
                  </div>
                  <span className="text-[#c8f135] opacity-0 group-hover:opacity-100 transition">
                    →
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="p-8 bg-[#111] border border-[#c8f135]/20 rounded-lg mb-12">
          <h2 className="text-2xl font-bold mb-4">Quick Tips</h2>
          <ul className="space-y-3 text-[#ccc]">
            <li className="flex gap-3">
              <span className="text-[#c8f135]">•</span>
              <span>Use receipt scanning to quickly log expenses</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#c8f135]">•</span>
              <span>Set up budget lanes before you start spending</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#c8f135]">•</span>
              <span>Review AI Insights weekly for optimization tips</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#c8f135]">•</span>
              <span>Enable Bill Shield notifications to catch subscriptions</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#c8f135]">•</span>
              <span>Customize goal milestones to stay motivated</span>
            </li>
          </ul>
        </div>

        <div className="p-6 bg-[#1a1a1a] border border-[#333] rounded-lg">
          <h3 className="font-bold mb-2">Need More Help?</h3>
          <p className="text-[#999] mb-4">
            Our comprehensive guides and video tutorials are available in your account dashboard.
          </p>
          <Link href="/contact" className="inline-block px-4 py-2 bg-[#c8f135] text-black font-bold rounded-lg hover:bg-[#e0b800] transition">
            Get Support
          </Link>
        </div>
      </div>
    </div>
  )
}
