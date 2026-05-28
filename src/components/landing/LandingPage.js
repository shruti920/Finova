"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  DollarSign,
  PieChart,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react"
import ParticleField from "./ParticleField"

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
}

const proofItems = [
  ["$8,420", "monthly inflow"],
  ["18%", "spend trimmed"],
  ["4 goals", "ahead of pace"],
]

const bars = [34, 58, 46, 78, 54, 92, 68, 84, 62]

const transactions = [
  {
    title: "Salary landed",
    meta: "Direct deposit",
    amount: "+$4,200",
    icon: Wallet,
  },
  {
    title: "Food budget",
    meta: "12 days left",
    amount: "$418 left",
    icon: PieChart,
  },
  {
    title: "Weekend leak",
    meta: "Subscriptions",
    amount: "-$42",
    icon: Activity,
  },
]

const signals = [
  {
    title: "Cashflow pulse",
    copy: "See what is safe to spend before the weekend gets ideas.",
    icon: TrendingUp,
  },
  {
    title: "Budget lanes",
    copy: "Group spending into live limits that turn loud before they break.",
    icon: PieChart,
  },
  {
    title: "Goal mode",
    copy: "Track saving streaks, debt payoff, and the exact next move.",
    icon: BadgeCheck,
  },
  {
    title: "Bill shield",
    copy: "Surface repeat charges early so nothing jumps out of nowhere.",
    icon: ShieldCheck,
  },
]

export default function LandingPage() {
  return (
    <main className="landing-page">
      <ParticleField />

      <div className="site-shell">
        <motion.nav
          className="site-nav"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          aria-label="Main navigation"
        >
          <Link className="brand-lockup" href="/">
            <span className="brand-mark">
              <DollarSign aria-hidden="true" size={18} strokeWidth={3} />
            </span>
            Finova
          </Link>

          <div className="nav-links">
            <a href="#preview">Preview</a>
            <a href="#signals">Signals</a>
            <Link href="/register">Register</Link>
          </div>
        </motion.nav>

        <section className="hero-section" aria-labelledby="landing-title">
          <motion.div
            className="hero-copy"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <motion.p className="eyebrow" variants={fadeUp}>
              <Sparkles aria-hidden="true" />
              Finance tracker / Gen Z edition
            </motion.p>

            <motion.h1
              className="hero-title"
              id="landing-title"
              variants={fadeUp}
            >
              Finova
              <span>money in motion.</span>
            </motion.h1>

            <motion.p className="hero-subtitle" variants={fadeUp}>
              A dark, high-energy command center for budgets, cashflow, goals,
              and the tiny daily money choices that decide the month.
            </motion.p>

            <motion.div className="hero-actions" variants={fadeUp}>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link className="button button-primary" href="/register">
                  Start tracking
                  <ArrowRight aria-hidden="true" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <a className="button button-ghost" href="#preview">
                  View preview
                </a>
              </motion.div>
            </motion.div>

            <motion.div className="hero-proof" variants={container}>
              {proofItems.map(([value, label]) => (
                <motion.div className="proof-chip" variants={fadeUp} key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="dashboard-preview"
            id="preview"
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="preview-topbar">
              <div className="preview-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <span className="preview-mode">live dashboard</span>
            </div>

            <div className="preview-grid">
              <section className="preview-panel balance-panel">
                <div>
                  <p className="panel-label">available balance</p>
                  <motion.p
                    className="balance-value"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.62, duration: 0.5 }}
                  >
                    $12,840
                  </motion.p>
                  <p className="balance-note">+$1,240 vs last month</p>
                </div>

                <div className="mini-bars" aria-hidden="true">
                  {bars.map((height, index) => (
                    <motion.span
                      key={`${height}-${index}`}
                      style={{ height: `${height}%` }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{
                        delay: 0.58 + index * 0.04,
                        duration: 0.45,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>
              </section>

              <section className="preview-panel spend-panel">
                <p className="panel-label">monthly spend map</p>
                <motion.div
                  className="ring-wrap"
                  initial={{ rotate: -18, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.64, duration: 0.58 }}
                >
                  <div className="spend-ring" aria-hidden="true" />
                </motion.div>

                <div className="spend-legend">
                  <div className="legend-row">
                    <i />
                    <span>Essentials</span>
                    <strong>42%</strong>
                  </div>
                  <div className="legend-row">
                    <i />
                    <span>Fun</span>
                    <strong>25%</strong>
                  </div>
                  <div className="legend-row">
                    <i />
                    <span>Savings</span>
                    <strong>16%</strong>
                  </div>
                </div>
              </section>

              <section className="transaction-stack" aria-label="Recent money moves">
                {transactions.map((transaction, index) => {
                  const Icon = transaction.icon

                  return (
                    <motion.div
                      className="transaction-row"
                      drag="x"
                      dragConstraints={{ left: -16, right: 16 }}
                      dragElastic={0.18}
                      whileDrag={{ scale: 1.015 }}
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.76 + index * 0.08,
                        duration: 0.42,
                        ease: "easeOut",
                      }}
                      key={transaction.title}
                    >
                      <div className="transaction-icon">
                        <Icon aria-hidden="true" />
                      </div>
                      <div className="transaction-copy">
                        <strong>{transaction.title}</strong>
                        <span>{transaction.meta}</span>
                      </div>
                      <div className="transaction-amount">
                        <strong>{transaction.amount}</strong>
                        <span>today</span>
                      </div>
                    </motion.div>
                  )
                })}
              </section>
            </div>
          </motion.div>
        </section>

        <motion.section
          className="signal-strip"
          id="signals"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.24 }}
          aria-label="Finance signals"
        >
          {signals.map((signal) => {
            const Icon = signal.icon

            return (
              <motion.article
                className="signal-card"
                variants={fadeUp}
                whileHover={{ y: -6, borderColor: "var(--acid)" }}
                key={signal.title}
              >
                <div className="signal-icon">
                  <Icon aria-hidden="true" />
                </div>
                <h2>{signal.title}</h2>
                <p>{signal.copy}</p>
              </motion.article>
            )
          })}
        </motion.section>
      </div>
    </main>
  )
}
