"use client"

import { useEffect, useMemo, useState } from "react"
import DashboardCards from "../dashboard-cards"
import MonthlyChart from "../monthly-chart"
import ExpenseChart from "../expense-chart"
import InsightsPanel from "../insights-panel"
import RecommendationsPanel from "./recommendations-panel"

import ParticleField from "../landing/ParticleField"

export default function DashboardAnalyticsClient() {

  const [transactions, setTransactions] =
    useState([])

  const [budgets, setBudgets] =
    useState([])

  const [loading, setLoading] =
    useState(true)


  /* ─────────────────────────────────────────────
     FETCH DATA
  ───────────────────────────────────────────── */
  const fetchTransactions = async () => {

    try {

      setLoading(true)

      const [transRes, budRes] = await Promise.all([
        fetch("/api/transactions"),
        fetch("/api/budgets"),
      ])

      if (!transRes.ok || !budRes.ok) {
        throw new Error(
          "Failed to fetch data"
        )
      }

      const transData = await transRes.json()
      const budData = await budRes.json()

      setTransactions(
        Array.isArray(transData)
          ? transData
          : []
      )

      setBudgets(
        Array.isArray(budData)
          ? budData
          : []
      )

    } catch (error) {

      console.log(error)

      setTransactions([])
      setBudgets([])

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {

    const load = async () => {
      await fetchTransactions()
    }

    load()

  }, [])

  /* ─────────────────────────────────────────────
     CALCULATIONS
  ───────────────────────────────────────────── */
  const {
    totalIncome,
    totalExpense,
    totalBalance,
    savingsRate,
  } = useMemo(() => {

    const income = transactions
      .filter((t) => t.type === "income")
      .reduce(
        (sum, t) =>
          sum + Number(t.amount),
        0
      )

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce(
        (sum, t) =>
          sum + Number(t.amount),
        0
      )

    const balance =
      income - expense

    const savings =
      income > 0
        ? ((balance / income) * 100)
        : 0

    return {
      totalIncome: income,
      totalExpense: expense,
      totalBalance: balance,
      savingsRate: savings,
    }

  }, [transactions])

  /* ─────────────────────────────────────────────
     INSIGHTS
  ───────────────────────────────────────────── */
  const insights = useMemo(() => {

    if (transactions.length === 0) {
      return []
    }

    const expenseTransactions =
      transactions.filter(
        (t) => t.type === "expense"
      )

    const categoryTotals = {}

    expenseTransactions.forEach((tx) => {

      const category =
        tx.category

      categoryTotals[category] =
        (categoryTotals[category] || 0) +
        Number(tx.amount)

    })

    const topCategory =
      Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])[0]

    return [

      {
        title: "Top Spending",
        value: topCategory
          ? topCategory[0]
          : "N/A",

        subtitle: topCategory
          ? `₹${topCategory[1].toLocaleString("en-IN")}`
          : "No expenses",

        color: "#FF3CAC",
      },

      {
        title: "Savings Rate",
        value: `${Math.round(savingsRate)}%`,

        subtitle:
          savingsRate >= 20
            ? "Healthy saving"
            : "Needs improvement",

        color:
          savingsRate >= 20
            ? "#C8F135"
            : "#FF6B35",
      },

      {
        title: "Net Balance",
        value:
          `₹${totalBalance.toLocaleString("en-IN")}`,

        subtitle:
          totalBalance >= 0
            ? "Positive cashflow"
            : "Overspending",

        color:
          totalBalance >= 0
            ? "#00D4FF"
            : "#FF4D4D",
      },

    ]

  }, [
    transactions,
    savingsRate,
    totalBalance,
  ])

  return (

    <div
      className="
        flex min-h-screen
        relative overflow-hidden
        text-white
      "
      style={{
        background: `
          linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
          var(--dark)
        `,
        backgroundSize: "52px 52px",
      }}
    >

      {/* BACKGROUND */}
      <div className="
        absolute inset-0 z-0
        pointer-events-none
      ">
        <ParticleField />
      </div>

      {/* MAIN */}
      <main className="
        relative z-10
        flex-1
        p-5 md:p-8
        overflow-hidden
      ">

        {/* TOPBAR */}
        <div className="
          flex items-center
          justify-between
          mb-8
        ">

          <div>

            <p className="
              text-[#666]
              text-sm
            ">
              Deep financial insights
            </p>

            <h1
              className="
                text-4xl
                font-black
                tracking-tight
              "
              style={{
                fontFamily:
                  "'Syne', sans-serif",
              }}
            >
              Analytics
            </h1>

          </div>

        </div>

        {/* CARDS */}
        <DashboardCards
          income={totalIncome}
          expense={totalExpense}
          total={totalBalance}
          count={transactions.length}
          loading={loading}
        />

        {/* INSIGHTS */}
        <div className="
          grid grid-cols-1
          md:grid-cols-3
          gap-4
          mt-8
        ">

          {insights.map((item) => (

            <div
              key={item.title}
              className="
                bg-[#111111]
                border border-white/[0.07]
                rounded-2xl
                p-5
              "
            >

              <p className="
                text-[#555]
                font-mono
                text-[11px]
                uppercase
                tracking-widest
                mb-3
              ">
                {item.title}
              </p>

              <h2
                className="
                  text-3xl
                  font-black
                  mb-1
                "
                style={{
                  color: item.color,
                  fontFamily:
                    "'Syne', sans-serif",
                }}
              >
                {item.value}
              </h2>

              <p className="
                text-[#777]
                text-sm
                font-mono
              ">
                {item.subtitle}
              </p>

            </div>

          ))}

        </div>

        {/* CHARTS */}
        <MonthlyChart
          transactions={transactions}
        />

        <ExpenseChart
          transactions={transactions}
        />

        {/* INSIGHTS PANEL */}
        <InsightsPanel
          transactions={transactions}
          budgets={budgets}
        />

        <RecommendationsPanel
  transactions={transactions}
  budgets={budgets}
/>

      </main>

    </div>
  )
}