"use client"

import { useMemo } from "react"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

const formatINR = (n) =>
  n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : n >= 1000
    ? `₹${(n / 1000).toFixed(0)}K`
    : `₹${n}`

/* ─────────────────────────────────────────────
   CUSTOM TOOLTIP
───────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  const income =
    payload.find((p) => p.dataKey === "income")?.value ?? 0

  const expense =
    payload.find((p) => p.dataKey === "expense")?.value ?? 0

  const net = income - expense

  return (
    <div
      className="
        bg-[#161616]
        border border-white/[0.1]
        rounded-2xl
        p-4
        shadow-xl
        min-w-[170px]
      "
      style={{
        fontFamily: "'DM Mono', monospace",
      }}
    >
      <p className="text-[#666] text-[10px] tracking-[0.12em] uppercase mb-3">
        {label}
      </p>

      <div className="space-y-2">

        {/* Income */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#C8F135]" />
            <span className="text-[#999] text-[11px]">
              Income
            </span>
          </div>

          <span className="text-[#C8F135] text-[13px] font-medium">
            {formatINR(income)}
          </span>
        </div>

        {/* Expense */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF3CAC]" />
            <span className="text-[#999] text-[11px]">
              Expense
            </span>
          </div>

          <span className="text-[#FF3CAC] text-[13px] font-medium">
            {formatINR(expense)}
          </span>
        </div>

        {/* Net */}
        <div
          className="
            border-t border-white/[0.06]
            pt-2
            flex items-center justify-between gap-6
          "
        >
          <span className="text-[#666] text-[11px]">
            Net
          </span>

          <span
            className="text-[13px] font-medium"
            style={{
              color:
                net >= 0
                  ? "#C8F135"
                  : "#FF3CAC",
            }}
          >
            {net >= 0 ? "+" : "−"}
            {formatINR(Math.abs(net))}
          </span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   CUSTOM DOT
───────────────────────────────────────────── */
function CustomDot({
  cx,
  cy,
  fill,
  r = 5,
}) {
  return (
    <g>
      {/* outer glow */}
      <circle
        cx={cx}
        cy={cy}
        r={r + 3}
        fill={fill}
        fillOpacity={0.15}
      />

      {/* main dot */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        stroke="#111"
        strokeWidth={2}
      />
    </g>
  )
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function MonthlyChart({
  transactions = [],
  loading,
}) {

  /* ─────────────────────────────────────────
     MEMOIZED MONTHLY AGGREGATION
  ───────────────────────────────────────── */
  const {
    data,
    totalIncome,
    totalExpense,
    bestMonth,
  } = useMemo(() => {

    const monthlyMap = {}

    transactions.forEach((tx) => {

      if (!tx.createdAt) return

      const date = new Date(tx.createdAt)

      const year  = date.getFullYear()
      const month = date.getMonth()

      /*
        Unique key prevents:
        Jan 2024 + Jan 2025 collision
      */
      const key = `${year}-${month}`

      if (!monthlyMap[key]) {

        monthlyMap[key] = {

          /*
            used for proper sorting
          */
          sortKey: new Date(
            year,
            month,
            1
          ).getTime(),

          /*
            short month
          */
          month: date.toLocaleString(
            "en-US",
            {
              month: "short",
            }
          ),

          /*
            display label
          */
          label: date.toLocaleString(
            "en-US",
            {
              month: "short",
              year: "numeric",
            }
          ),

          income: 0,
          expense: 0,
        }
      }

      if (tx.type === "income") {

        monthlyMap[key].income +=
          Number(tx.amount)

      } else {

        monthlyMap[key].expense +=
          Number(tx.amount)
      }
    })

    /*
      SORT MONTHS CORRECTLY
    */
    const data = Object
      .values(monthlyMap)
      .sort(
        (a, b) =>
          a.sortKey - b.sortKey
      )

    /*
      TOTALS
    */
    const totalIncome = data.reduce(
      (sum, item) =>
        sum + item.income,
      0
    )

    const totalExpense = data.reduce(
      (sum, item) =>
        sum + item.expense,
      0
    )

    /*
      BEST MONTH
    */
    const bestMonth = [...data]
      .sort(
        (a, b) =>
          (b.income - b.expense) -
          (a.income - a.expense)
      )[0]

    return {
      data,
      totalIncome,
      totalExpense,
      bestMonth,
    }

  }, [transactions])

  if (loading) {

  return (

    <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6 mt-8">

      {/* header */}
      <div className="flex items-center justify-between mb-6 animate-pulse">

        <div>
          <div className="h-3 w-24 bg-[#1A1A1A] rounded mb-3" />
          <div className="h-8 w-48 bg-[#1A1A1A] rounded" />
        </div>

        <div className="flex gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 w-16 bg-[#1A1A1A] rounded mb-2" />
              <div className="h-6 w-20 bg-[#1A1A1A] rounded" />
            </div>
          ))}
        </div>

      </div>

      {/* fake chart */}
      <div className="h-[300px] rounded-2xl bg-[#151515] animate-pulse" />

    </div>
  )
}

  /* ─────────────────────────────────────────
     EMPTY STATE
  ───────────────────────────────────────── */
  if (data.length === 0) {
    return (
      <div
        className="
          bg-[#111111]
          border border-white/[0.07]
          rounded-2xl
          p-8
          mt-8
          text-center
        "
      >
        <p className="text-4xl mb-3">
          📉
        </p>

        <p
          className="
            text-[#F2F2F2]
            font-black
            text-lg
          "
          style={{
            fontFamily:
              "'Syne', sans-serif",
          }}
        >
          No data yet
        </p>

        <p
          className="
            text-[#555]
            font-mono
            text-sm
            mt-1
          "
        >
          Transactions will appear here once added.
        </p>
      </div>
    )
  }

  /*
    moved outside JSX
  */
  const incomeDot =
    <CustomDot fill="#C8F135" />

  const expenseDot =
    <CustomDot fill="#FF3CAC" />

  return (
    <div
      className="
        bg-[#111111]
        border border-white/[0.07]
        rounded-2xl
        p-6
        mt-8
      "
    >

      {/* ─────────────────────────────────
         HEADER
      ───────────────────────────────── */}
      <div
        className="
          flex flex-col
          sm:flex-row sm:items-start
          justify-between
          gap-4
          mb-6
        "
      >

        {/* left */}
        <div>
          <p
            className="
              text-[#C8F135]
              font-mono
              text-[10px]
              tracking-[0.12em]
              uppercase
              mb-1
            "
          >
            Cash flow
          </p>

          <h2
            className="
              text-[#F2F2F2]
              text-2xl
              font-black
              leading-tight
              tracking-tight
            "
            style={{
              fontFamily:
                "'Syne', sans-serif",
            }}
          >
            Monthly Overview
          </h2>
        </div>

        {/* KPI STRIP */}
        <div className="flex gap-4 flex-shrink-0">

          {/* Income */}
          <div className="text-right">
            <p
              className="
                text-[#555]
                font-mono
                text-[10px]
                tracking-widest
                uppercase
                mb-0.5
              "
            >
              Income
            </p>

            <p
              className="
                text-[#C8F135]
                text-[17px]
                font-black
                leading-none
              "
              style={{
                fontFamily:
                  "'Syne', sans-serif",
              }}
            >
              {formatINR(totalIncome)}
            </p>
          </div>

          <div className="w-px bg-white/[0.06] self-stretch" />

          {/* Expense */}
          <div className="text-right">
            <p
              className="
                text-[#555]
                font-mono
                text-[10px]
                tracking-widest
                uppercase
                mb-0.5
              "
            >
              Spent
            </p>

            <p
              className="
                text-[#FF3CAC]
                text-[17px]
                font-black
                leading-none
              "
              style={{
                fontFamily:
                  "'Syne', sans-serif",
              }}
            >
              {formatINR(totalExpense)}
            </p>
          </div>

          {/* Best month */}
          {bestMonth && (
            <>
              <div className="w-px bg-white/[0.06] self-stretch" />

              <div className="text-right">
                <p
                  className="
                    text-[#555]
                    font-mono
                    text-[10px]
                    tracking-widest
                    uppercase
                    mb-0.5
                  "
                >
                  Best
                </p>

                <p
                  className="
                    text-[#00D4FF]
                    text-[17px]
                    font-black
                    leading-none
                  "
                  style={{
                    fontFamily:
                      "'Syne', sans-serif",
                  }}
                >
                  {bestMonth.label}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────
         LEGEND
      ───────────────────────────────── */}
      <div className="flex gap-3 mb-5">

        {[
          {
            color: "#C8F135",
            label: "Income",
          },
          {
            color: "#FF3CAC",
            label: "Expense",
          },
        ].map(({ color, label }) => (

          <div
            key={label}
            className="
              flex items-center gap-2
              px-3 py-1.5
              rounded-full
              border
              text-[11px]
              font-mono
            "
            style={{
              background: `${color}10`,
              borderColor: `${color}30`,
              color,
            }}
          >
            <span
              className="w-5 h-px block"
              style={{
                background: color,
              }}
            />

            {label}
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────
         CHART
      ───────────────────────────────── */}
      <div className="h-[300px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 4,
              left: 0,
              bottom: 0,
            }}
          >

            {/* gradients */}
            <defs>

              <linearGradient
                id="incomeGrad"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#C8F135"
                  stopOpacity={0.2}
                />

                <stop
                  offset="95%"
                  stopColor="#C8F135"
                  stopOpacity={0}
                />
              </linearGradient>

              <linearGradient
                id="expenseGrad"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#FF3CAC"
                  stopOpacity={0.15}
                />

                <stop
                  offset="95%"
                  stopColor="#FF3CAC"
                  stopOpacity={0}
                />
              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              interval="preserveStartEnd"
              minTickGap={30}
              axisLine={false}
              tickLine={false}
              dy={8}
              tick={{
                fill: "#555",
                fontFamily:
                  "'DM Mono', monospace",
                fontSize: 11,
              }}
            />

            <YAxis
              tickFormatter={formatINR}
              axisLine={false}
              tickLine={false}
              width={65}
              tick={{
                fill: "#555",
                fontFamily:
                  "'DM Mono', monospace",
                fontSize: 10,
              }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke:
                  "rgba(255,255,255,0.08)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />

            {/* Income */}
            <Area
              type="monotone"
              dataKey="income"
              stroke="#C8F135"
              strokeWidth={2.5}
              fill="url(#incomeGrad)"
              dot={incomeDot}
              activeDot={{
                r: 6,
                fill: "#C8F135",
                stroke: "#111",
                strokeWidth: 2,
              }}
              animationDuration={1000}
              animationEasing="ease-out"
            />

            {/* Expense */}
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#FF3CAC"
              strokeWidth={2.5}
              fill="url(#expenseGrad)"
              dot={expenseDot}
              activeDot={{
                r: 6,
                fill: "#FF3CAC",
                stroke: "#111",
                strokeWidth: 2,
              }}
              animationDuration={1200}
              animationEasing="ease-out"
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}