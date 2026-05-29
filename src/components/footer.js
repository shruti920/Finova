"use client"

import Link from "next/link"
import { DollarSign } from "lucide-react"

export default function Footer() {
  return (
    <footer className="dashboard-footer">
      <div className="footer-wrapper">
        {/* Brand & Description */}
        <div className="footer-brand">
          <div className="footer-brand-name">
            <DollarSign size={18} strokeWidth={3} />
            <span>Finova</span>
          </div>
          <p>Financial command center for Gen Z</p>
        </div>

        {/* Links Grid */}
        <div className="footer-links-grid">
          <div>
            <h4>Product</h4>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/dashboard/analytics">Analytics</Link>
            <Link href="/dashboard/transactions">Transactions</Link>
          </div>
          <div>
            <h4>Resources</h4>
            <Link href="/support">Support</Link>
            <Link href="/docs">Documentation</Link>
            <Link href="/faq">FAQ</Link>
          </div>
          <div>
            <h4>Account</h4>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>© 2026 Finova. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
