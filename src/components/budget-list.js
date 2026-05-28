"use client"

import { useMemo } from "react"

const CATEGORY_META = {
  "food & drink": { icon: "🍔", color: "#FF6B35" },
  transport: { icon: "🚗", color: "#00D4FF" },
  housing: { icon: "🏠", color: "#A78BFA" },
  shopping: { icon: "🛒", color: "#C8F135" },
  health: { icon: "💊", color: "#FF3CAC" },
  entertainment: { icon: "🎬", color: "#FB923C" },
  education: { icon: "📚", color: "#34D399" },
  other: { icon: "💸", color: "#888888" },
}

const getMeta = (category = "") => {
  const normalized = category.toLowerCase()

  const key = normalized.split(" & ")[0]

  return (
    CATEGORY_META[normalized] ||
    Object.entries(CATEGORY_META).find(([k]) =>
      k.startsWith(key)
    )?.[1] ||
    CATEGORY_META.other
  )
}

const formatINR = (n) =>
  `₹${Number(n).toLocaleString("en-IN")}`

const formatCompact = (n) =>
  n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : n >= 1000
    ? `₹${(n / 1000).toFixed(0)}K`
    : `₹${n}`

export default function BudgetList({
  budgets = [],
  transactions = [],
  loading = false,
}) {

  /* ─────────────────────────────────────────────
     EXPENSE MAP
  ───────────────────────────────────────────── */

  const expenseMap = useMemo(() => {

    const map = {}

    transactions.forEach((tx) => {

      if (tx.type !== "expense") return

      const category =
        (tx.category || "").toLowerCase()

      map[category] =
        (map[category] || 0) + Number(tx.amount)

    })

    return map

  }, [transactions])

  /* ─────────────────────────────────────────────
     SUMMARY
  ───────────────────────────────────────────── */

  const {
    totalBudgeted,
    totalSpent,
    overCount,
  } = useMemo(() => {

    const totalBudgeted = budgets.reduce(
      (sum, budget) =>
        sum + Number(budget.limit),
      0
    )

    const totalSpent = budgets.reduce(
      (sum, budget) =>
        sum +
        (expenseMap[
          budget.category.toLowerCase()
        ] || 0),
      0
    )

    const overCount = budgets.filter((budget) => {

      const spent =
        expenseMap[
          budget.category.toLowerCase()
        ] || 0

      return spent > Number(budget.limit)

    }).length

    return {
      totalBudgeted,
      totalSpent,
      overCount,
    }

  }, [budgets, expenseMap])

  /* ─────────────────────────────────────────────
     LOADING
  ───────────────────────────────────────────── */

  if (loading) {

    return (

      <div className="mt-8 space-y-4">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          {Array.from({ length: 3 }).map((_, i) => (

            <div
              key={i}
              className="bg-[#111111] border border-white/[0.07] rounded-2xl p-5 animate-pulse"
            >
              <div className="h-3 w-20 bg-[#1A1A1A] rounded mb-4" />
              <div className="h-7 w-28 bg-[#1A1A1A] rounded" />
            </div>

          ))}

        </div>

        <div className="grid gap-4">

          {Array.from({ length: 3 }).map((_, i) => (

            <div
              key={i}
              className="bg-[#111111] border border-white/[0.07] rounded-2xl p-5 animate-pulse h-[180px]"
            />

          ))}

        </div>

      </div>
    )
  }

  /* ─────────────────────────────────────────────
     EMPTY
  ───────────────────────────────────────────── */

  if (budgets.length === 0) {

    return (

      <div className="mt-8 bg-[#111111] border border-white/[0.07] rounded-3xl p-10 text-center">

        <p className="text-5xl mb-4">
          🎯
        </p>

        <h2
          className="text-[#F2F2F2] text-2xl font-black"
          style={{
            fontFamily: "'Syne', sans-serif",
          }}
        >
          No budgets yet
        </h2>

        <p className="text-[#666] font-mono text-sm mt-2">
          Create your first budget to start tracking spending.
        </p>

      </div>
    )
  }

  return (

    <div className="mt-8">

      {/* ─────────────────────────────────────────────
          SUMMARY STRIP
      ───────────────────────────────────────────── */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">

        {[
          {
            label: "Budgeted",
            value: formatCompact(totalBudgeted),
            color: "#C8F135",
          },

          {
            label: "Spent",
            value: formatCompact(totalSpent),
            color: "#FF3CAC",
          },

          {
            label: "Over Budget",
            value: `${overCount} Categories`,
            color:
              overCount > 0
                ? "#FF4D4D"
                : "#00D4FF",
          },

        ].map(({ label, value, color }) => (

          <div
            key={label}
            className="bg-[#111111] border border-white/[0.07] rounded-2xl p-5"
          >

            <p className="text-[#555] font-mono text-[11px] uppercase tracking-[0.12em] mb-2">
              {label}
            </p>

            <h3
              className="text-[28px] font-black leading-none"
              style={{
                fontFamily: "'Syne', sans-serif",
                color,
              }}
            >
              {value}
            </h3>

          </div>

        ))}

      </div>

      {/* ─────────────────────────────────────────────
          BUDGET CARDS
      ───────────────────────────────────────────── */}

      <div className="grid gap-4">

        {budgets.map((budget) => {

          const spent =
            expenseMap[
              budget.category.toLowerCase()
            ] || 0

          const limit =
            Number(budget.limit)

          const rawPct =
            limit > 0
              ? (spent / limit) * 100
              : 0

          const pct =
            Math.min(rawPct, 100)

          const exceeded =
            spent > limit

          const remaining =
            limit - spent

          const meta =
            getMeta(budget.category)

          const barColor =
            exceeded
              ? "#FF4D4D"
              : rawPct >= 70
              ? "#FF6B35"
              : meta.color

          return (

            <div
              key={budget.id}
              className="
                bg-[#111111]
                border border-white/[0.07]
                rounded-3xl
                p-5
                hover:border-white/[0.12]
                transition-all duration-300
                relative overflow-hidden
              "
            >

              {/* glow */}
              <div
                className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-[0.08]"
                style={{
                  background: barColor,
                }}
              />

              {/* TOP */}
              <div className="flex items-start justify-between mb-5">

                <div className="flex items-center gap-4">

                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-[22px]"
                    style={{
                      background: `${meta.color}18`,
                    }}
                  >
                    {meta.icon}
                  </div>

                  <div>

                    <h3
                      className="text-[#F2F2F2] text-[18px] font-black"
                      style={{
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
                      {budget.category}
                    </h3>

                    <p className="text-[#666] text-[12px] font-mono mt-1">
                      {formatINR(spent)} spent of {formatINR(limit)}
                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <div
                    className="text-[30px] font-black leading-none"
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      color: barColor,
                    }}
                  >
                    {Math.round(rawPct)}%
                  </div>

                  <p
                    className="text-[11px] font-mono mt-1"
                    style={{
                      color: barColor,
                    }}
                  >
                    {exceeded ? "Exceeded" : "On Track"}
                  </p>

                </div>

              </div>

              {/* PROGRESS */}
              <div className="h-3 bg-[#1A1A1A] rounded-full overflow-hidden mb-4">

                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: barColor,
                  }}
                />

              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-between">

                <div className="flex gap-2">

                  {[25, 50, 75, 100].map((tick) => (

                    <div
                      key={tick}
                      className="flex items-center gap-1"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background:
                            rawPct >= tick
                              ? barColor
                              : "#222",
                        }}
                      />

                      <span className="text-[#333] text-[9px] font-mono">
                        {tick}
                      </span>

                    </div>

                  ))}

                </div>

                {!exceeded ? (

                  <div
                    className="text-[11px] font-mono px-3 py-1 rounded-full border"
                    style={{
                      background: `${meta.color}10`,
                      borderColor: `${meta.color}25`,
                      color: meta.color,
                    }}
                  >
                    {formatCompact(remaining)} left
                  </div>

                ) : (

                  <div className="text-[11px] font-mono text-[#FF4D4D]">
                    ⚠ Over Budget
                  </div>

                )}

              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}