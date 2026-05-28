"use client"
 
import { useMemo, useRef, useState } from "react"
import {
  getTopCategories,
  calculateTotals,
} from "@/utils/analytics"
 
const CATEGORY_META = {
  "food":          { icon: "🍔", color: "#FF6B35" },
  "transport":     { icon: "🚗", color: "#00D4FF" },
  "housing":       { icon: "🏠", color: "#A78BFA" },
  "shopping":      { icon: "🛒", color: "#C8F135" },
  "health":        { icon: "💊", color: "#FF3CAC" },
  "entertainment": { icon: "🎬", color: "#FB923C" },
  "education":     { icon: "📚", color: "#34D399" },
  "other":         { icon: "💸", color: "#888"    },
}
 
const FALLBACK_COLORS = ["#C8F135","#FF3CAC","#00D4FF","#A78BFA","#FB923C"]
 
const getMeta = (category = "", index) => {
  const key = category.toLowerCase().split(/[\s&]/)[0]
  return (
    CATEGORY_META[category.toLowerCase()] ??
    Object.entries(CATEGORY_META).find(([k]) => k.startsWith(key))?.[1] ??
    { icon: "💸", color: FALLBACK_COLORS[index % FALLBACK_COLORS.length] }
  )
}
 
const formatINR   = (n) => `₹${Number(n).toLocaleString("en-IN")}`
const formatCompact = (n) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L`
  : n >= 1000  ? `₹${(n / 1000).toFixed(0)}K`
  : `₹${n}`
 
/* ── Row card with hover tilt ─────────────────────────────── */
function CategoryRow({ item, rank, totalExpense }) {
  const ref     = useRef(null)
  const frameId = useRef(null)
  const [tilt, setTilt]     = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
 
  const onMouseMove = (e) => {
    if (!ref.current) return
    cancelAnimationFrame(frameId.current)
    frameId.current = requestAnimationFrame(() => {
      const rect = ref.current.getBoundingClientRect()
      const x    = e.clientX - rect.left
      const y    = e.clientY - rect.top
      setTilt({
        x: ((rect.height / 2 - y) / rect.height) * 6,
        y: ((x - rect.width / 2) / rect.width)   * 10,
      })
      setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 })
    })
  }
 
  const onMouseLeave = () => {
    cancelAnimationFrame(frameId.current)
    setTilt({ x: 0, y: 0 })
    setHovered(false)
    setGlowPos({ x: 50, y: 50 })
  }
 
  const pct        = Number(item.percentage)
  const maxBarPct  = item.isMax ? 100 : pct
  const { icon, color } = item.meta
 
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hovered ? "scale(1.02)" : "scale(1)"}`,
        transition: hovered
          ? "transform 0.08s ease-out"
          : "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className="relative bg-[#111111] border border-white/[0.07] rounded-2xl p-5 overflow-hidden cursor-default"
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        style={{ background: color }}
      />
 
      {/* Mouse spotlight */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(160px circle at ${glowPos.x}% ${glowPos.y}%, ${color}18 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
        }}
      />
 
      {/* Ambient corner glow */}
      <div
        className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-opacity duration-300"
        style={{ background: color, opacity: hovered ? 0.1 : 0.06 }}
      />
 
      {/* Content */}
      <div style={{ transform: "translateZ(14px)", transformStyle: "preserve-3d" }}>
 
        {/* ── Top row ── */}
        <div className="flex items-center gap-4 mb-4">
 
          {/* Rank */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-[12px] flex-shrink-0"
            style={{ background: `${color}18`, color, fontFamily: "'Syne', sans-serif" }}
          >
            #{rank}
          </div>
 
          {/* Icon box */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[20px] flex-shrink-0"
            style={{ background: `${color}15` }}
          >
            {icon}
          </div>
 
          {/* Name + pct */}
          <div className="flex-1 min-w-0">
            <h3
              className="text-[#F2F2F2] font-black text-[17px] leading-none truncate"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {item.category}
            </h3>
            <p className="text-[#555] font-mono text-[11px] mt-1">
              {item.percentage}% of total expenses
            </p>
          </div>
 
          {/* Amount */}
          <div className="text-right flex-shrink-0">
            <div
              className="font-black text-[20px] leading-none"
              style={{ color, fontFamily: "'Syne', sans-serif" }}
            >
              {formatCompact(item.amount)}
            </div>
            <div className="text-[#444] font-mono text-[10px] mt-1">
              {formatINR(item.amount)}
            </div>
          </div>
        </div>
 
        {/* ── Progress bar ── */}
        <div className="mb-3">
          <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full relative"
              style={{
                width: `${pct}%`,
                background: color,
                transition: "width 1s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {/* shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.15] to-transparent rounded-full" />
            </div>
          </div>
        </div>
 
        {/* ── Bottom row: milestone dots + share badge ── */}
        <div className="flex items-center justify-between">
 
          {/* Milestone dots */}
          <div className="flex items-center gap-2">
            {[25, 50, 75, 100].map((tick) => (
              <div key={tick} className="flex items-center gap-1">
                <div
                  className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                  style={{ background: pct >= tick ? color : "#222" }}
                />
                <span className="text-[#2a2a2a] font-mono text-[9px]">{tick}%</span>
              </div>
            ))}
          </div>
 
          {/* Share of wallet badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono"
            style={{
              background:  `${color}10`,
              borderColor: `${color}28`,
              color,
            }}
          >
            {item.isMax ? "🔥 Highest" : `${item.percentage}% share`}
          </div>
        </div>
 
      </div>
    </div>
  )
}
 
/* ── Main component ───────────────────────────────────────── */
export default function CategoryBreakdown({ transactions = [] }) {
 
  const categories = useMemo(() => {
    const top    = getTopCategories(transactions, 5)
    const totals = calculateTotals(transactions)
    const max    = top[0]?.amount ?? 1
 
    return top.map((item, i) => ({
      ...item,
      percentage:
        totals.expense > 0
          ? ((item.amount / totals.expense) * 100).toFixed(1)
          : 0,
      meta:  getMeta(item.category, i),
      isMax: item.amount === max,
    }))
  }, [transactions])
 
  if (categories.length === 0) return null
 
  const topItem  = categories[0]
  const totalAmt = categories.reduce((s, c) => s + c.amount, 0)
 
  return (
    <div className="mt-10">
 
      {/* ── Header ── */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[#C8F135] font-mono text-[10px] tracking-[0.14em] uppercase mb-1">
            Analysis · top 5
          </p>
          <h2
            className="text-[#F2F2F2] text-3xl font-black tracking-tight leading-none"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Spending Breakdown
          </h2>
        </div>
 
        {/* Top category callout */}
        <div
          className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-xl border"
          style={{
            background:  `${topItem.meta.color}0d`,
            borderColor: `${topItem.meta.color}28`,
          }}
        >
          <span className="text-xl">{topItem.meta.icon}</span>
          <div>
            <p className="text-[10px] font-mono text-[#555] uppercase tracking-widest">
              Biggest spend
            </p>
            <p
              className="font-black text-[14px] leading-none"
              style={{ color: topItem.meta.color, fontFamily: "'Syne', sans-serif" }}
            >
              {topItem.category}
            </p>
          </div>
        </div>
      </div>
 
      {/* ── Visual bar overview (thin stacked bar) ── */}
      <div className="flex h-2 rounded-full overflow-hidden mb-6 gap-px">
        {categories.map((item) => (
          <div
            key={item.category}
            className="h-full transition-all duration-700 first:rounded-l-full last:rounded-r-full"
            style={{
              width:      `${item.percentage}%`,
              background: item.meta.color,
            }}
            title={`${item.category}: ${item.percentage}%`}
          />
        ))}
        {/* remainder */}
        <div
          className="h-full flex-1 bg-[#1A1A1A] last:rounded-r-full"
          title="Other"
        />
      </div>
 
      {/* ── Category cards ── */}
      <div className="grid gap-3">
        {categories.map((item, i) => (
          <CategoryRow
            key={item.category}
            item={item}
            rank={i + 1}
            totalExpense={totalAmt}
          />
        ))}
      </div>
 
    </div>
  )
}
 