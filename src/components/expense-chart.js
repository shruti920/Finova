"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const COLORS = ["#C8F135", "#FF3CAC", "#00D4FF", "#FF6B35", "#A78BFA", "#FB923C", "#34D399"]

const ICONS = {
  food:          "🍔",
  transport:     "🚗",
  housing:       "🏠",
  shopping:      "🛒",
  health:        "💊",
  entertainment: "🎬",
  education:     "📚",
  other:         "💸",
}

const getIcon = (name = "") =>
  ICONS[name.toLowerCase().split(/[\s&]/)[0]] ?? "💸"

const formatINR = (n) =>
  `₹${Number(n).toLocaleString("en-IN")}`

/* ── Custom tooltip ────────────────────────────────────────── */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value, payload: p } = payload[0]
  return (
    <div
      className="bg-[#191919] border border-white/[0.1] rounded-xl px-4 py-3"
      style={{ fontFamily: "'DM Mono', monospace" }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.fill }} />
        <span className="text-[#999] text-[11px] uppercase tracking-widest">{name}</span>
      </div>
      <div className="text-white font-black text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>
        {formatINR(value)}
      </div>
    </div>
  )
}

/* ── Centre label rendered via SVG foreignObject isn't reliable; */
/* use an absolutely-positioned overlay instead ─────────────── */
function DonutCentre({ total }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <p className="text-[#555] font-mono text-[10px] tracking-[0.12em] uppercase mb-1">
        total spent
      </p>
      <p
        className="text-[#C8F135] text-2xl font-black leading-none tracking-tight"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {formatINR(total)}
      </p>
    </div>
  )
}

/* ── Main component ─────────────────────────────────────────── */
export default function ExpenseChart({ transactions = [] }) {
  const expenses = transactions.filter((tx) => tx.type === "expense")

  /* build category map */
  const categoryMap = {}
  expenses.forEach((tx) => {
    const key = tx.category || "Other"
    categoryMap[key] = (categoryMap[key] ?? 0) + Number(tx.amount)
  })

  const data = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const total     = data.reduce((s, d) => s + d.value, 0)
  const maxValue  = data[0]?.value ?? 1

  /* empty state */
  if (data.length === 0) {
    return (
      <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-8 mt-8 text-center">
        <p className="text-4xl mb-3">🫙</p>
        <p className="text-[#F2F2F2] font-black text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>
          No expenses yet
        </p>
        <p className="text-[#555] font-mono text-sm mt-1">Add a transaction to see the breakdown.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6 mt-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[#C8F135] font-mono text-[10px] tracking-[0.12em] uppercase mb-1">
            May 2025
          </p>
          <h2
            className="text-[#F2F2F2] text-2xl font-black leading-tight tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Expense Breakdown
          </h2>
        </div>
        <div className="text-right">
          <p className="text-[#555] font-mono text-[10px] uppercase tracking-widest mb-1">categories</p>
          <p
            className="text-[#00D4FF] text-xl font-black"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {data.length}
          </p>
        </div>
      </div>

      {/* ── Chart + legend two-col layout ── */}
      <div className="flex flex-col lg:flex-row items-center gap-8">

        {/* Donut chart */}
        <div className="relative flex-shrink-0 w-full lg:w-[260px] h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={78}
                outerRadius={118}
                paddingAngle={3}
                strokeWidth={0}
                animationBegin={150}
                animationDuration={900}
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Centre overlay */}
          <DonutCentre total={total} />
        </div>

        {/* Legend list */}
        <div className="flex-1 w-full space-y-3">
          {data.map((item, i) => {
            const color   = COLORS[i % COLORS.length]
            const pct     = ((item.value / total) * 100).toFixed(1)
            const barPct  = ((item.value / maxValue) * 100).toFixed(1)

            return (
              <div key={item.name} className="group">
                {/* Row */}
                <div className="flex items-center gap-3 mb-1.5">
                  {/* Icon */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[15px] flex-shrink-0"
                    style={{ background: `${color}15` }}
                  >
                    {getIcon(item.name)}
                  </div>

                  {/* Name + pct */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[#F2F2F2] text-[13px] font-semibold truncate">
                        {item.name}
                      </span>
                      <span
                        className="text-[13px] font-black ml-3 flex-shrink-0"
                        style={{ fontFamily: "'Syne', sans-serif", color }}
                      >
                        {formatINR(item.value)}
                      </span>
                    </div>
                  </div>

                  {/* Pct badge */}
                  <div
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: `${color}15`, color }}
                  >
                    {pct}%
                  </div>
                </div>

                {/* Progress bar */}
                <div className="ml-11 h-[4px] bg-[#1E1E1E] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${barPct}%`, background: color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}