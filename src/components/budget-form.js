"use client"

import { useState } from "react"
import toast from "react-hot-toast"

const CATEGORIES = [
  { label: "Food & Drink",    icon: "🍔", color: "#FF6B35" },
  { label: "Transport",       icon: "🚗", color: "#00D4FF" },
  { label: "Housing",         icon: "🏠", color: "#A78BFA" },
  { label: "Shopping",        icon: "🛒", color: "#C8F135" },
  { label: "Health",          icon: "💊", color: "#FF3CAC" },
  { label: "Entertainment",   icon: "🎬", color: "#FB923C" },
  { label: "Education",       icon: "📚", color: "#34D399" },
  { label: "Other",           icon: "💸", color: "#888" },
]

const QUICK_LIMITS = [1000, 3000, 5000, 10000, 20000]

export default function BudgetForm({ onBudgetAdded }) {
  const [category, setCategory] = useState("")
  const [limit, setLimit]       = useState("")
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)

  const selected = CATEGORIES.find((c) => c.label === category)

 const handleSubmit = async (e) => {
  e.preventDefault()

  if (!category || !limit) {
    toast.error("Please fill all fields")
    return
  }

  try {

    setLoading(true)

    const res = await fetch("/api/budgets", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        category,
        limit,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(
        data.message || "Failed to save budget"
      )
    }

    setCategory("")
    setLimit("")

    setDone(true)

    toast.success("Budget saved successfully")

    onBudgetAdded()

    setTimeout(() => {
      setDone(false)
    }, 2000)

  } catch (error) {

    toast.error(error.message)

  } finally {

    setLoading(false)

  }
}

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6 mt-8"
    >

      {/* ── Header ── */}
      <div className="mb-6">
        <p className="text-[#C8F135] font-mono text-[10px] tracking-[0.12em] uppercase mb-1">
          Budget Planner
        </p>
        <h2
          className="text-[#F2F2F2] text-2xl font-black tracking-tight leading-none"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Set a Budget Goal
        </h2>
        <p className="text-[#555] text-sm font-mono mt-1">
          Pick a category and cap your spending.
        </p>
      </div>

      {/* ── Category grid ── */}
      <div className="mb-5">
        <label className="text-[#666] font-mono text-[10px] tracking-[0.1em] uppercase block mb-3">
          Category
        </label>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.label
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => setCategory(cat.label)}
                className={`
                  flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border
                  text-center transition-all duration-200
                  ${isActive
                    ? "border-white/[0.15] bg-[#191919]"
                    : "border-white/[0.05] bg-transparent hover:bg-[#141414] hover:border-white/[0.08]"
                  }
                `}
                style={{
                  boxShadow: isActive ? `0 0 0 1px ${cat.color}40` : "none",
                  borderColor: isActive ? `${cat.color}50` : undefined,
                }}
              >
                {/* Icon circle */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[16px]"
                  style={{ background: isActive ? `${cat.color}20` : "transparent" }}
                >
                  {cat.icon}
                </div>
                <span
                  className="text-[10px] font-mono leading-tight"
                  style={{ color: isActive ? cat.color : "#555" }}
                >
                  {cat.label.split(" ")[0]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Limit input ── */}
      <div className="mb-4">
        <label className="text-[#666] font-mono text-[10px] tracking-[0.1em] uppercase block mb-2">
          Monthly Limit (₹)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555] font-mono text-lg">
            ₹
          </span>
          <input
            type="number"
            placeholder="0"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            required
            className="
              w-full bg-[#191919] border border-white/[0.07]
              rounded-xl pl-9 pr-4 py-3.5
              text-[#F2F2F2] text-2xl font-black tracking-tight
              outline-none placeholder-[#2a2a2a]
              focus:border-[#C8F135]/40 transition-all duration-200
            "
            style={{ fontFamily: "'Syne', sans-serif" }}
          />
        </div>

        {/* Quick-pick amounts */}
        <div className="flex gap-2 mt-2.5 flex-wrap">
          {QUICK_LIMITS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setLimit(String(q))}
              className={`
                px-3 py-1.5 rounded-full border font-mono text-[11px]
                transition-all duration-150
                ${String(limit) === String(q)
                  ? "bg-[#C8F135]/10 border-[#C8F135]/40 text-[#C8F135]"
                  : "bg-transparent border-white/[0.06] text-[#555] hover:border-white/[0.12] hover:text-[#888]"
                }
              `}
            >
              ₹{q >= 1000 ? `${q / 1000}K` : q}
            </button>
          ))}
        </div>
      </div>

      {/* ── Preview pill ── */}
      {category && limit && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl border mb-5"
          style={{
            background:   `${selected?.color ?? "#C8F135"}08`,
            borderColor:  `${selected?.color ?? "#C8F135"}25`,
          }}
        >
          <span className="text-xl">{selected?.icon ?? "💸"}</span>
          <div>
            <p
              className="font-black text-[15px] leading-tight"
              style={{
                fontFamily: "'Syne', sans-serif",
                color: selected?.color ?? "#C8F135",
              }}
            >
              {category}
            </p>
            <p className="text-[#555] font-mono text-[11px]">
              ₹{Number(limit).toLocaleString("en-IN")} / month
            </p>
          </div>
          <div
            className="ml-auto text-[11px] font-mono px-2.5 py-1 rounded-full"
            style={{
              background:  `${selected?.color ?? "#C8F135"}15`,
              color:       selected?.color ?? "#C8F135",
            }}
          >
            Budget set
          </div>
        </div>
      )}

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={loading || !category || !limit}
        className={`
          w-full py-4 rounded-xl font-black text-[15px] tracking-wide
          flex items-center justify-center gap-2
          transition-all duration-200
          ${done
            ? "bg-[#C8F135] text-[#000]"
            : loading || !category || !limit
            ? "bg-[#C8F135]/30 text-[#000]/40 cursor-not-allowed"
            : "bg-[#C8F135] text-[#000] hover:opacity-90 active:scale-[0.98]"
          }
        `}
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {done ? (
          <>✓ Budget Saved!</>
        ) : loading ? (
          <>
            <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            Saving…
          </>
        ) : (
          <>Save Budget →</>
        )}
      </button>

    </form>
  )
}