"use client"

import { useMemo, useRef, useState } from "react"
import { detectRecurringExpenses } from "@/utils/recurring"
import { predictBudgetRisk } from "@/utils/budget-risk"
import { calculateHealthScore } from "@/utils/health-score"

import {
  calculateTotals,
  calculateSavingsRate,
  getTopCategories,
  getMonthlyComparison,
} from "@/utils/analytics"

const formatINR = (n) =>
  `₹${Number(n).toLocaleString("en-IN")}`

const formatCompact = (n) =>
  Math.abs(n) >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : Math.abs(n) >= 1000
    ? `₹${(n / 1000).toFixed(0)}K`
    : `₹${n}`

/* ─────────────────────────────────────────────
   3D TILT
───────────────────────────────────────────── */
function use3DTilt() {

  const ref = useRef(null)

  const frameId = useRef(null)

  const [tiltStyle, setTiltStyle] = useState({
    transform:
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)",

    transition:
      "transform 0.15s ease-out",
  })

  const [glowPos, setGlowPos] = useState({
    x: 50,
    y: 50,
  })

  const onMouseMove = (e) => {

    if (!ref.current) return

    cancelAnimationFrame(frameId.current)

    frameId.current = requestAnimationFrame(() => {

      const rect =
        ref.current.getBoundingClientRect()

      const x =
        e.clientX - rect.left

      const y =
        e.clientY - rect.top

      const cx =
        rect.width / 2

      const cy =
        rect.height / 2

      const rotY =
        ((x - cx) / cx) * 12

      const rotX =
        ((cy - y) / cy) * 9

      setTiltStyle({
        transform: `
          perspective(900px)
          rotateX(${rotX}deg)
          rotateY(${rotY}deg)
          scale(1.03)
        `,
        transition:
          "transform 0.08s ease-out",
      })

      setGlowPos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
      })
    })
  }

  const onMouseLeave = () => {

    cancelAnimationFrame(frameId.current)

    setTiltStyle({
      transform:
        "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)",

      transition:
        "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
    })

    setGlowPos({
      x: 50,
      y: 50,
    })
  }

  return {
    ref,
    tiltStyle,
    glowPos,
    onMouseMove,
    onMouseLeave,
  }
}

/* ─────────────────────────────────────────────
   SAVINGS RING
───────────────────────────────────────────── */
function SavingsRing({
  rate,
  color,
}) {

  const size = 56

  const stroke = 4

  const r =
    (size - stroke) / 2

  const circ =
    2 * Math.PI * r

  const progress =
    circ - (rate / 100) * circ

  return (
    <div
      className="relative flex-shrink-0"
      style={{
        width: size,
        height: size,
      }}
    >

      <svg
        width={size}
        height={size}
        style={{
          transform: "rotate(-90deg)",
        }}
      >

        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#1E1E1E"
          strokeWidth={stroke}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={progress}
          strokeLinecap="round"
          style={{
            transition:
              "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)",
          }}
        />

      </svg>

      <div className="absolute inset-0 flex items-center justify-center">

        <span
          className="font-black text-[11px]"
          style={{
            color,
            fontFamily:
              "'Syne', sans-serif",
          }}
        >
          {rate}%
        </span>

      </div>

    </div>
  )
}

/* ─────────────────────────────────────────────
   INSIGHT CARD
───────────────────────────────────────────── */
function InsightCard({
  card,
  floatDelay,
}) {

  const {
    ref,
    tiltStyle,
    glowPos,
    onMouseMove,
    onMouseLeave,
  } = use3DTilt()

  return (

    <div
      style={{
        animation:
          "insightFloat 4.5s ease-in-out infinite",

        animationDelay:
          floatDelay,
      }}
    >

      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          ...tiltStyle,
          transformStyle:
            "preserve-3d",

          willChange:
            "transform",
        }}
        className="
          relative
          bg-[#111111]
          border border-white/[0.07]
          rounded-2xl
          p-5
          overflow-hidden
          cursor-default
          h-full
        "
      >

        {/* top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              card.color,
          }}
        />

        {/* spotlight */}
        <div
          className="
            absolute inset-0
            rounded-2xl
            pointer-events-none
          "
          style={{
            background: `
              radial-gradient(
                160px circle at
                ${glowPos.x}% ${glowPos.y}%,
                ${card.color}1a 0%,
                transparent 70%
              )
            `,
          }}
        />

        {/* glow */}
        <div
          className="
            absolute
            -bottom-8
            -right-8
            w-28
            h-28
            rounded-full
            blur-2xl
            opacity-[0.08]
          "
          style={{
            background:
              card.color,
          }}
        />

        {/* content */}
        <div
          style={{
            transform:
              "translateZ(18px)",
          }}
        >

          {/* top row */}
          <div className="flex items-center justify-between mb-4">

            <div
              className="
                px-2.5 py-1
                rounded-full
                text-[10px]
                font-mono
                uppercase
              "
              style={{
                background:
                  `${card.color}15`,

                color:
                  card.color,
              }}
            >
              {card.status}
            </div>

            <div
              className="
                w-9 h-9
                rounded-xl
                flex items-center justify-center
                text-[18px]
              "
              style={{
                background:
                  `${card.color}18`,
              }}
            >
              {card.icon}
            </div>

          </div>

          {/* title */}
          <p className="
            text-[#555]
            font-mono
            text-[10px]
            uppercase
            tracking-[0.12em]
            mb-2
          ">
            {card.title}
          </p>

          {/* value */}
          <div className="flex items-end justify-between gap-3 mb-3">

            <h3
              className="
                text-[26px]
                font-black
                leading-none
              "
              style={{
                fontFamily:
                  "'Syne', sans-serif",

                color:
                  card.color,
              }}
            >
              {card.value}
            </h3>

            {card.showRing && (
              <SavingsRing
                rate={card.ringRate}
                color={card.color}
              />
            )}

          </div>

          {/* subtitle */}
          <p className="
            text-[#555]
            font-mono
            text-[11px]
            leading-relaxed
            mb-4
          ">
            {card.subtitle}
          </p>

          {/* progress */}
          {card.barPct !== undefined && (

            <div>

              <div className="flex justify-between mb-1.5">

                <span className="
                  text-[#444]
                  font-mono
                  text-[9px]
                  uppercase
                ">
                  Progress
                </span>

                <span
                  className="
                    font-mono
                    text-[9px]
                  "
                  style={{
                    color:
                      card.color,
                  }}
                >
                  {Math.round(card.barPct)}%
                </span>

              </div>

              <div className="
                h-1.5
                bg-[#1A1A1A]
                rounded-full
                overflow-hidden
              ">

                <div
                  className="
                    h-full
                    rounded-full
                  "
                  style={{
                    width:
                      `${Math.min(card.barPct, 100)}%`,

                    background:
                      card.color,
                  }}
                />

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function InsightsPanel({
  transactions = [],
  budgets = [],
}) {

  const insights = useMemo(() => {

    const totals =
      calculateTotals(transactions)

    const savingsRate =
      calculateSavingsRate(transactions)

    const topCats =
      getTopCategories(transactions, 3)

    const comparison =
      getMonthlyComparison(transactions)

    const cards = []

    /* savings rate */
    const healthy =
      savingsRate >= 20

    cards.push({
      title:
        "Savings Rate",

      value:
        `${savingsRate}%`,

      subtitle:
        healthy
          ? "Your financial health looks strong."
          : "Try saving at least 20% monthly.",

      color:
        healthy
          ? "#C8F135"
          : "#FF6B35",

      icon:
        "💰",

      status:
        healthy
          ? "Healthy"
          : "Warning",

      showRing:
        true,

      ringRate:
        savingsRate,
    })

    /* top spending */
    if (topCats.length > 0) {

      const top =
        topCats[0]

      cards.push({
        title:
          "Top Spending",

        value:
          top.category,

        subtitle:
          `${formatINR(top.amount)} spent this month`,

        color:
          "#FF3CAC",

        icon:
          "📊",

        status:
          "Tracked",

        barPct:
          75,
      })
    }

    /* monthly comparison */
    if (comparison) {

      const diff =
        comparison.expenseChange

      const increase =
        diff > 0

      cards.push({
        title:
          increase
            ? "Spending Up"
            : "Spending Down",

        value:
          formatCompact(Math.abs(diff)),

        subtitle:
          `${comparison.previous.label} → ${comparison.current.label}`,

        color:
          increase
            ? "#FF4D4D"
            : "#00D4FF",

        icon:
          increase
            ? "📈"
            : "📉",

        status:
          increase
            ? "Alert"
            : "Improving",
      })
    }

    /* net balance */
    const positive =
      totals.balance >= 0

    cards.push({
      title:
        "Net Balance",

      value:
        formatCompact(totals.balance),

      subtitle:
        positive
          ? "Positive cash flow."
          : "You're overspending.",

      color:
        positive
          ? "#34D399"
          : "#FF4D4D",

      icon:
        positive
          ? "✦"
          : "⚠",

      status:
        positive
          ? "Positive"
          : "Deficit",

      barPct:
        totals.income > 0
          ? (totals.expense / totals.income) * 100
          : 0,
    })

    /* recurring detection */
    const recurring =
      detectRecurringExpenses(transactions)

    if (recurring && recurring.length > 0) {

      const first =
        recurring[0]

      cards.push({
        title:
          "Recurring Expense",

        value:
          first.category,

        subtitle:
          `${formatINR(first.averageAmount)}/month · ${first.count} times`,

        color:
          "#A78BFA",

        icon:
          "🔁",

        status:
          "Detected",

        showRing: false,
      })
    }

    /* budget risk */
    const risks =
  predictBudgetRisk(
    budgets,
    transactions
  )

  if (risks.length > 0) {

  const risk = risks[0]

  cards.push({

    title: "Budget Risk",

    value: risk.category,

    subtitle:
      `Likely to exceed in ${risk.daysLeft} days`,

    color: "#FF4D4D",

    icon: "⚠️",

    status: "Prediction",

    showRing: false,

    barPct:
      (risk.projected / risk.limit) * 100,
  })
}

    /* health score */
    const health =
  calculateHealthScore(
    transactions,
    budgets
  )

  cards.push({

  title: "Financial Health",

  value: `${health.score}/100`,

  subtitle:
    `Status: ${health.status}`,

  color:
    health.score >= 80
      ? "#34D399"
      : health.score >= 60
      ? "#C8F135"
      : "#FF4D4D",

  icon: "🧠",

  status: health.status,

  showRing: true,

  ringRate: health.score,
})
    

    return cards

  }, [transactions, budgets])

  const delays = [
    "0s",
    "0.5s",
    "1s",
    "1.5s",
    "2s",
  ]

  return (

    <div className="mt-10">

      <style>{`
        @keyframes insightFloat {
          0%,100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>

      {/* header */}
      <div className="flex items-end justify-between mb-6">

        <div>

          <h2
            className="
              text-[#F2F2F2]
              text-3xl
              font-black
              tracking-tight
            "
            style={{
              fontFamily:
                "'Syne', sans-serif",
            }}
          >
            Financial Intelligence
          </h2>

        </div>

        <div className="
          flex items-center gap-2
          px-3 py-1.5
          bg-[#111111]
          border border-white/[0.07]
          rounded-full
        ">

          <span className="
            w-2 h-2
            rounded-full
            bg-[#C8F135]
            animate-pulse
          " />

          <span className="
            text-[#C8F135]
            font-mono
            text-[10px]
            uppercase
          ">
            Live
          </span>

        </div>

      </div>

      {/* cards */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-5
      ">

        {insights.map((card, i) => (

          <InsightCard
            key={card.title}
            card={card}
            floatDelay={delays[i]}
          />

        ))}

      </div>

    </div>
  )
}