"use client"

import Link from "next/link"
import { ArrowLeft, Calendar, User } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "5 Money Habits Gen Z Should Start Now",
    excerpt: "Building strong financial foundations early can lead to significant wealth accumulation over time. Here are five habits that will transform your financial future.",
    author: "Sarah Johnson",
    date: "May 15, 2026",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Understanding Cashflow: A Beginner's Guide",
    excerpt: "Cashflow is the lifeblood of your finances. Learn how to track it, optimize it, and use it to make better financial decisions.",
    author: "Mike Chen",
    date: "May 10, 2026",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "The Art of Smart Budgeting",
    excerpt: "Forget restrictive budgets. Modern budgeting is about giving every rupee a purpose while still enjoying your life. Discover the budget lanes method.",
    author: "Emma Wilson",
    date: "May 5, 2026",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Subscription Fatigue: How to Find and Cancel Forgotten Services",
    excerpt: "The average person has 12+ forgotten subscriptions costing them thousands annually. Learn how to find them and take back control.",
    author: "Raj Patel",
    date: "April 28, 2026",
    readTime: "4 min read",
  },
  {
    id: 5,
    title: "Goal Setting for Financial Success",
    excerpt: "Setting clear financial goals is the first step to achieving them. We break down how to set SMART financial goals that actually work.",
    author: "Lisa Anderson",
    date: "April 20, 2026",
    readTime: "6 min read",
  },
  {
    id: 6,
    title: "AI and Personal Finance: The Future is Here",
    excerpt: "Artificial intelligence is revolutionizing how we manage our money. Discover how AI can help you make smarter financial decisions.",
    author: "David Kumar",
    date: "April 15, 2026",
    readTime: "8 min read",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-[#c8f135] hover:underline mb-8">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <h1 className="text-5xl font-black mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
          Finova Blog
        </h1>
        <p className="text-[#999] text-lg mb-12">
          Financial tips, stories, and insights for Gen Z money management.
        </p>

        <div className="space-y-6">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="p-6 bg-[#111] border border-[#333] rounded-lg hover:border-[#c8f135]/30 transition group cursor-pointer"
            >
              <h2 className="text-xl font-bold mb-3 group-hover:text-[#c8f135] transition">
                {post.title}
              </h2>

              <p className="text-[#ccc] mb-4 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-[#888]">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User size={14} />
                  <span>{post.author}</span>
                </div>
                <span className="text-[#c8f135]">{post.readTime}</span>
              </div>

              <div className="mt-4 opacity-0 group-hover:opacity-100 transition">
                <span className="text-[#c8f135] font-semibold">Read Article →</span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center p-8 bg-[#111] border border-[#c8f135]/20 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Subscribe to Our Newsletter</h3>
          <p className="text-[#888] mb-6">
            Get weekly financial tips and insights delivered to your inbox.
          </p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-[#666] focus:border-[#c8f135] focus:outline-none transition"
            />
            <button className="px-6 py-2 bg-[#c8f135] text-black font-bold rounded-lg hover:bg-[#e0b800] transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
