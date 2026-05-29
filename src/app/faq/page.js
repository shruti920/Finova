"use client"

import Link from "next/link"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    question: "What is Finova?",
    answer: "Finova is a personal finance management app designed for Gen Z. It combines real-time cashflow tracking, smart budgeting, goal tracking, and AI-powered insights to help you make better financial decisions.",
  },
  {
    question: "Is my financial data secure?",
    answer: "Yes. We use industry-standard encryption for all data in transit and at rest. Your financial information is never shared with third parties, and we comply with strict data protection standards.",
  },
  {
    question: "Can I sync my bank account?",
    answer: "Currently, Finova allows manual transaction entry and receipt scanning. We're working on direct bank integration for seamless syncing in future updates.",
  },
  {
    question: "Is Finova free?",
    answer: "Finova offers a free tier with core features like budget tracking, goal management, and basic analytics. Premium features may be available in the future.",
  },
  {
    question: "How do budget lanes work?",
    answer: "Budget lanes let you group spending into categories with custom limits. When you approach the limit, you'll get alerts. This helps you stay in control of different spending areas.",
  },
  {
    question: "What is the Bill Shield feature?",
    answer: "Bill Shield detects recurring charges and subscriptions, surfacing them early so nothing jumps out of nowhere. It helps you catch forgotten subscriptions and manage monthly commitments.",
  },
  {
    question: "Can I track goals with Finova?",
    answer: "Yes! Set savings goals, debt payoff goals, or investment targets. Finova tracks your progress, shows savings streaks, and suggests the exact next steps to hit your goals.",
  },
  {
    question: "How does AI Insights work?",
    answer: "Our AI analyzes your spending patterns, cashflow trends, and goals to provide personalized recommendations. It learns from your behavior to suggest smarter financial moves.",
  },
  {
    question: "Can I export my data?",
    answer: "Yes. You can export all your financial data in standard formats anytime. We believe your data is yours, and you should have access to it.",
  },
  {
    question: "How do I delete my account?",
    answer: "You can delete your account anytime from your account settings. All your data will be permanently removed from our servers.",
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-[#c8f135] hover:underline mb-8">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <h1 className="text-5xl font-black mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
          Frequently Asked Questions
        </h1>
        <p className="text-[#999] text-lg mb-12">
          Find answers to common questions about Finova and how to get the most out of your financial tracking.
        </p>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-[#333] rounded-lg bg-[#111] hover:border-[#c8f135]/30 transition"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#1a1a1a] transition"
              >
                <h3 className="font-semibold text-lg">{faq.question}</h3>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-[#c8f135] transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4 pt-0 border-t border-[#333] text-[#ccc] leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-[#111] border border-[#333] rounded-lg">
          <h3 className="font-bold mb-2">Still have questions?</h3>
          <p className="text-[#999] mb-4">
            Can't find what you're looking for? Reach out to our support team.
          </p>
          <Link href="/contact" className="inline-block px-4 py-2 bg-[#c8f135] text-black font-bold rounded-lg hover:bg-[#e0b800] transition">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
