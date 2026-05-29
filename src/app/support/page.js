"use client"

import Link from "next/link"
import { ArrowLeft, MessageCircle, Mail, Clock, Zap } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-[#c8f135] hover:underline mb-8">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <h1 className="text-5xl font-black mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
          Support Center
        </h1>
        <p className="text-[#999] text-lg mb-12">
          We're here to help. Find resources or contact our support team.
        </p>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <Link href="/faq" className="p-6 bg-[#111] border border-[#333] rounded-lg hover:border-[#c8f135]/30 transition group">
            <Zap size={24} className="text-[#c8f135] mb-3 group-hover:scale-110 transition" />
            <h3 className="font-bold mb-1">FAQ</h3>
            <p className="text-[#888] text-sm">Browse common questions and answers</p>
          </Link>

          <Link href="/docs" className="p-6 bg-[#111] border border-[#333] rounded-lg hover:border-[#00d4ff]/30 transition group">
            <MessageCircle size={24} className="text-[#00d4ff] mb-3 group-hover:scale-110 transition" />
            <h3 className="font-bold mb-1">Documentation</h3>
            <p className="text-[#888] text-sm">Learn how to use Finova features</p>
          </Link>

          <Link href="/contact" className="p-6 bg-[#111] border border-[#333] rounded-lg hover:border-[#ff3cac]/30 transition group">
            <Mail size={24} className="text-[#ff3cac] mb-3 group-hover:scale-110 transition" />
            <h3 className="font-bold mb-1">Contact Us</h3>
            <p className="text-[#888] text-sm">Get in touch with our team</p>
          </Link>

          <Link href="#" className="p-6 bg-[#111] border border-[#333] rounded-lg hover:border-[#a78bfa]/30 transition group">
            <Clock size={24} className="text-[#a78bfa] mb-3 group-hover:scale-110 transition" />
            <h3 className="font-bold mb-1">Status Page</h3>
            <p className="text-[#888] text-sm">Check system status and uptime</p>
          </Link>
        </div>

        {/* Support Info */}
        <div className="space-y-6 mb-12">
          <div className="p-6 bg-[#1a1a1a] border border-[#333] rounded-lg">
            <h3 className="font-bold text-lg mb-2">Email Support</h3>
            <p className="text-[#888] mb-3">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            <p className="text-[#c8f135] font-semibold">support@finova.app</p>
          </div>

          <div className="p-6 bg-[#1a1a1a] border border-[#333] rounded-lg">
            <h3 className="font-bold text-lg mb-2">Business Hours</h3>
            <ul className="text-[#888] space-y-1">
              <li>Monday - Friday: 9:00 AM - 6:00 PM IST</li>
              <li>Saturday: 10:00 AM - 2:00 PM IST</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>

          <div className="p-6 bg-[#1a1a1a] border border-[#333] rounded-lg">
            <h3 className="font-bold text-lg mb-2">Response Time</h3>
            <ul className="text-[#888] space-y-1">
              <li>Urgent Issues: 2-4 hours</li>
              <li>General Support: 24 hours</li>
              <li>Feature Requests: 48 hours</li>
            </ul>
          </div>
        </div>

        {/* Common Issues */}
        <div className="p-6 bg-[#111] border border-[#c8f135]/20 rounded-lg mb-12">
          <h2 className="text-2xl font-bold mb-6">Common Issues & Solutions</h2>
          
          <div className="space-y-4">
            <details className="group cursor-pointer">
              <summary className="font-semibold flex items-center justify-between hover:text-[#c8f135] transition">
                Can't log in to my account
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-[#888] mt-2 ml-4">
                Try resetting your password using the "Forgot Password" link on the login page. If you still have issues, contact support with your email address.
              </p>
            </details>

            <details className="group cursor-pointer">
              <summary className="font-semibold flex items-center justify-between hover:text-[#c8f135] transition">
                How do I export my data?
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-[#888] mt-2 ml-4">
                Go to Account Settings → Data & Privacy → Export Data. Choose your format (CSV or JSON) and download. This may take a few minutes for large datasets.
              </p>
            </details>

            <details className="group cursor-pointer">
              <summary className="font-semibold flex items-center justify-between hover:text-[#c8f135] transition">
                Why aren't my transactions syncing?
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-[#888] mt-2 ml-4">
                Check your internet connection and try refreshing the page. If transactions still don't appear, try logging out and back in. Contact support if the issue persists.
              </p>
            </details>

            <details className="group cursor-pointer">
              <summary className="font-semibold flex items-center justify-between hover:text-[#c8f135] transition">
                How do I delete my account?
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-[#888] mt-2 ml-4">
                Go to Account Settings → Account Deletion. Note that this action is permanent and cannot be undone. All your data will be deleted.
              </p>
            </details>
          </div>
        </div>

        <div className="text-center p-6 bg-[#111] border border-[#333] rounded-lg">
          <h3 className="font-bold mb-2">Ready to Get Started?</h3>
          <p className="text-[#888] mb-4">
            Have all the info you need? Jump back to Finova and start tracking your finances.
          </p>
          <Link href="/login" className="inline-block px-6 py-2 bg-[#c8f135] text-black font-bold rounded-lg hover:bg-[#e0b800] transition">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
