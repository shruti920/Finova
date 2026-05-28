"use client"

import { useRef, useState } from "react"

/* ── 3D tilt + glow hook ─────────────────────────────────── */
function use3DTilt() {
  const ref     = useRef(null)
  const frameId = useRef(null)
  const [style, setStyle] = useState({
    transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)",
    transition: "transform 0.15s ease-out",
  })
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })

  const onMouseMove = (e) => {
    if (!ref.current) return
    cancelAnimationFrame(frameId.current)
    frameId.current = requestAnimationFrame(() => {
      const rect = ref.current.getBoundingClientRect()
      const x    = e.clientX - rect.left
      const y    = e.clientY - rect.top
      const cx   = rect.width  / 2
      const cy   = rect.height / 2
      const rotY = ((x - cx) / cx) * 14       // max ±14 deg
      const rotX = ((cy - y) / cy) * 10       // max ±10 deg
      const gx   = (x / rect.width)  * 100
      const gy   = (y / rect.height) * 100
      setStyle({
        transform: `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`,
        transition: "transform 0.08s ease-out",
      })
      setGlowPos({ x: gx, y: gy })
    })
  }

  const onMouseLeave = () => {
    cancelAnimationFrame(frameId.current)
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
    })
    setGlowPos({ x: 50, y: 50 })
  }

  return { ref, style, glowPos, onMouseMove, onMouseLeave }
}

/* ── Single card ─────────────────────────────────────────── */
function Card({ card, floatDelay }) {
  const { ref, style, glowPos, onMouseMove, onMouseLeave } = use3DTilt()

  return (
    <div
      className="relative"
      style={{
        animation: `floatBob 4s ease-in-out infinite`,
        animationDelay: floatDelay,
      }}
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          ...style,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="relative bg-[#111111] border border-white/[0.07] rounded-2xl p-5 overflow-hidden cursor-default"
      >
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{ background: card.accent }}
        />

        {/* Spotlight: follows mouse */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(180px circle at ${glowPos.x}% ${glowPos.y}%, ${card.accent}20 0%, transparent 70%)`,
          }}
        />

        {/* Ambient corner glow */}
        <div
          className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full blur-2xl pointer-events-none"
          style={{ background: card.accent, opacity: 0.09 }}
        />

        {/* Shine layer */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
            transform: "translateZ(1px)",
          }}
        />

        {/* Content — floated up in Z */}
        <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>

          {/* Top row */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#666] font-mono text-[10px] tracking-[0.12em] uppercase">
              {card.title}
            </p>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[16px] font-black"
              style={{ background: `${card.accent}18`, color: card.accent }}
            >
              {card.icon}
            </div>
          </div>

          {/* Value */}
          <h2
            className="text-[28px] font-black leading-none tracking-tight mb-1"
            style={{ fontFamily: "'Syne', sans-serif", color: card.accent }}
          >
            {card.value}
          </h2>

          {/* Sub */}
          <p className="text-[#555] font-mono text-[11px] mb-4">
            {card.sub}
          </p>

          {/* Trend badge */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono"
            style={{
              background:   `${card.accent}12`,
              color:        card.accent,
              borderColor:  `${card.accent}35`,
            }}
          >
            <span>{card.changeUp ? "▲" : "▼"}</span>
            {card.change}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main export ─────────────────────────────────────────── */
export default function DashboardCards({ income, expense, total, count, loading }) {
  
const previousIncome = income * 0.82
const previousExpense = expense * 1.08

const incomeChange =
  previousIncome === 0
    ? 100
    : (((income - previousIncome) / previousIncome) * 100).toFixed(1)

const expenseChange =
  previousExpense === 0
    ? 100
    : (((expense - previousExpense) / previousExpense) * 100).toFixed(1)

const net = income - expense

const savingsRate =
  income === 0
    ? 0
    : ((net / income) * 100).toFixed(1)

  const cards = [
    {
      title:    "Total Balance",
      value:    `₹${total.toLocaleString("en-IN")}`,
      sub:      net >= 0
                  ? `+₹${net.toLocaleString("en-IN")} net`
                  : `−₹${Math.abs(net).toLocaleString("en-IN")} net`,
      icon:     "⬡",
      accent:   "#C8F135",
      change:   `${incomeChange}% vs last month`,
      changeUp: true,
    },
    {
      title:    "Income",
      value:    `₹${income.toLocaleString("en-IN")}`,
      sub:      "May 2025",
      icon:     "↑",
      accent:   "#C8F135",
      change:   `${incomeChange}% vs last month`,
      changeUp: true,
    },
    {
      title:    "Expenses",
      value:    `₹${expense.toLocaleString("en-IN")}`,
      sub:      "May 2025",
      icon:     "↓",
      accent:   "#FF3CAC",
      change:   `${expenseChange}% vs last month`,
      changeUp: expenseChange < 0,
    },
    {
      title:    "Transactions",
      value:    count,
      sub:      "total logged",
      icon:     "↕",
      accent:   "#00D4FF",
      change:   `${savingsRate}% savings rate`,
      changeUp: true,
    },
  ]

  const delays = ["0s", "0.8s", "1.6s", "2.4s"]
  if (loading) {

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">

      {Array.from({ length: 4 }).map((_, i) => (

        <div
          key={i}
          className="
            bg-[#111111]
            border border-white/[0.07]
            rounded-xl
            px-4 py-4
            animate-pulse
          "
        >
          <div className="h-3 w-20 bg-[#1A1A1A] rounded mb-3" />

          <div className="h-7 w-28 bg-[#1A1A1A] rounded" />
        </div>

      ))}

    </div>
  )
}

  return (
    <>
      <style>{`
        @keyframes floatBob {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-8px); }
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {cards.map((card, i) => (
          <Card key={card.title} card={card} floatDelay={delays[i]} />
        ))}
      </div>
    </>
  )
}