"use client"

import { useEffect, useMemo, useState } from "react"
import ParticleField from "./landing/ParticleField"
import Aiinsights from "./ai-insights-panel"

const formatINR = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN")}`

const formatCompact = (n) => {

  const num = Number(n || 0)

  return num >= 100000
    ? `₹${(num / 100000).toFixed(1)}L`
    : num >= 1000
    ? `₹${(num / 1000).toFixed(0)}K`
    : `₹${num}`
}

export default function DashboardClient({ user }) {

  const [transactions, setTransactions] =
    useState([])

  const [budgets, setBudgets] =
    useState([])

  const [goals, setGoals] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  /* ─────────────────────────────────────────────
     FETCH DATA
  ───────────────────────────────────────────── */

  const refreshData = async (
    showLoader = true
  ) => {

    try {

      if (showLoader) {
        setLoading(true)
      }

      setError("")

      const [
        transactionsRes,
        budgetsRes,
        goalsRes,
      ] = await Promise.all([

        fetch("/api/transactions"),
        fetch("/api/budgets"),
        fetch("/api/goals"),

      ])

      if (
        !transactionsRes.ok ||
        !budgetsRes.ok ||
        !goalsRes.ok
      ) {
        throw new Error(
          "Failed to load dashboard data"
        )
      }

      const transactionsData =
        await transactionsRes.json()

      const budgetsData =
        await budgetsRes.json()

      const goalsData =
        await goalsRes.json()

      setTransactions(
        Array.isArray(transactionsData)
          ? transactionsData
          : []
      )

      setBudgets(
        Array.isArray(budgetsData)
          ? budgetsData
          : []
      )

      setGoals(
        Array.isArray(goalsData)
          ? goalsData
          : []
      )

    } catch (error) {

      console.log(error)

      setError(
        "Unable to load dashboard data."
      )

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {

    refreshData()

  }, [])

  /* ─────────────────────────────────────────────
     ANALYTICS
  ───────────────────────────────────────────── */

  const analytics = useMemo(() => {

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

    const savingsRate =
      income > 0
        ? Math.round(
            ((income - expense) /
              income) *
              100
          )
        : 0

    const recentTransactions =
      [...transactions]
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .slice(0, 5)

    const overBudgets =
      budgets.filter((budget) => {

        const spent =
          transactions
            .filter(
              (t) =>
                t.type ===
                  "expense" &&
                t.category.toLowerCase() ===
                  budget.category.toLowerCase()
            )
            .reduce(
              (sum, t) =>
                sum +
                Number(t.amount),
              0
            )

        return (
          spent >
          Number(budget.limit)
        )
      })

    const completedGoals =
      goals.filter((goal) => {

        const pct =
          (Number(goal.savedAmount) /
            Number(
              goal.targetAmount
            )) *
          100

        return pct >= 100
      })

    return {
      income,
      expense,
      balance,
      savingsRate,
      recentTransactions,
      overBudgets,
      completedGoals,
    }

  }, [
    transactions,
    budgets,
    goals,
  ])

  /* ─────────────────────────────────────────────
     LOADING
  ───────────────────────────────────────────── */

  if (loading) {

    return (

      <div className="
        min-h-screen
        flex items-center
        justify-center
        text-white
      ">

        Loading dashboard...

      </div>
    )
  }

  /* ─────────────────────────────────────────────
     ERROR
  ───────────────────────────────────────────── */

  if (error) {

    return (

      <div className="
        min-h-screen
        flex items-center
        justify-center
        text-red-400
      ">

        {error}

      </div>
    )
  }

  /* ─────────────────────────────────────────────
     HEALTH SCORE
  ───────────────────────────────────────────── */

  const healthScore = Math.min(
    100,
    Math.max(
      20,
      analytics.savingsRate +
        50 -
        analytics.overBudgets.length *
          10
    )
  )

  return (

    <div
      className="
        relative
        text-white
        min-h-screen
      "
      style={{
        background: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
          var(--dark)
        `,
        backgroundSize: "52px 52px",
      }}
    >

      {/* particles */}
      <div className="
        absolute inset-0
        z-0
        pointer-events-none
      ">
        <ParticleField />
      </div>

      {/* content */}
      <div className="
        relative z-10
        p-6
      ">

        {/* hero */}
        <div className="mb-10">

          <p className="
            text-[#666]
            text-sm
          ">
            Welcome back
          </p>

          <h1
            className="
              text-5xl
              font-black
              mt-1
            "
            style={{
              fontFamily:
                "'Syne', sans-serif",
            }}
          >
            {user.name}
          </h1>

        </div>

        {/* HEALTH CARD */}
        <div
          className="
            bg-[#111111]
            border border-white/[0.07]
            rounded-3xl
            p-8
            mb-8
            relative
            overflow-hidden
          "
        >

          <div className="
            absolute
            -top-20
            -right-20
            w-72 h-72
            rounded-full
            blur-3xl
            opacity-10
            bg-[#C8F135]
          " />

          <p className="
            text-[#C8F135]
            font-mono
            text-[11px]
            uppercase
            tracking-[0.12em]
            mb-3
          ">
            AI Financial Intelligence
          </p>

          <div className="
            flex flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-8
          ">

            <div>

              <h2
                className="
                  text-6xl
                  font-black
                  mb-3
                "
                style={{
                  fontFamily:
                    "'Syne', sans-serif",
                }}
              >
                {healthScore}/100
              </h2>

              <p className="
                text-[#777]
                max-w-2xl
              ">
                Your financial system is
                actively analyzing income,
                expenses, budgets and goals.
              </p>

            </div>

            <div className="
              space-y-3
              min-w-[300px]
            ">

              <div className="
                bg-[#161616]
                rounded-2xl
                px-4 py-3
              ">
                ✅ Savings rate:
                {" "}
                {analytics.savingsRate}%
              </div>

              <div className="
                bg-[#161616]
                rounded-2xl
                px-4 py-3
              ">
                ⚠ Over budgets:
                {" "}
                {
                  analytics.overBudgets
                    .length
                }
              </div>

              <div className="
                bg-[#161616]
                rounded-2xl
                px-4 py-3
              ">
                🎯 Goals completed:
                {" "}
                {
                  analytics.completedGoals
                    .length
                }
              </div>

            </div>

          </div>

        </div>

        {/* QUICK STATS */}
        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-5
          mb-10
        ">

          {[
            {
              label: "Balance",
              value:
                formatCompact(
                  analytics.balance
                ),
              color: "#C8F135",
            },

            {
              label: "Income",
              value:
                formatCompact(
                  analytics.income
                ),
              color: "#00D4FF",
            },

            {
              label: "Expenses",
              value:
                formatCompact(
                  analytics.expense
                ),
              color: "#FF3CAC",
            },

            {
              label: "Budgets",
              value:
                budgets.length,
              color: "#A78BFA",
            },

          ].map((card) => (

            <div
              key={card.label}
              className="
                bg-[#111111]
                border border-white/[0.07]
                rounded-3xl
                p-6
              "
            >

              <p className="
                text-[#666]
                font-mono
                text-[11px]
                uppercase
                mb-3
              ">
                {card.label}
              </p>

              <h3
                className="
                  text-4xl
                  font-black
                "
                style={{
                  color: card.color,
                  fontFamily:
                    "'Syne', sans-serif",
                }}
              >
                {card.value}
              </h3>

            </div>

          ))}

        </div>

        {/* GRID */}
        <div className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
        ">

          {/* LEFT */}
          <div className="
            xl:col-span-2
            space-y-6
          ">

            {/* RECENT TRANSACTIONS */}
            <div
              className="
                bg-[#111111]
                border border-white/[0.07]
                rounded-3xl
                p-6
              "
            >

              <div className="
                flex justify-between
                items-center
                mb-5
              ">

                <div>

                  <p className="
                    text-[#C8F135]
                    font-mono
                    text-[10px]
                    uppercase
                  ">
                    Activity
                  </p>

                  <h2
                    className="
                      text-2xl
                      font-black
                    "
                    style={{
                      fontFamily:
                        "'Syne', sans-serif",
                    }}
                  >
                    Recent Transactions
                  </h2>

                </div>

              </div>

              <div className="space-y-3">

                {analytics
                  .recentTransactions
                  .map((tx) => (

                  <div
                    key={tx.id}
                    className="
                      bg-[#161616]
                      rounded-2xl
                      px-4 py-4
                      flex justify-between
                      items-center
                    "
                  >

                    <div>

                      <p className="
                        text-white
                        font-bold
                      ">
                        {tx.category}
                      </p>

                      <p className="
                        text-[#666]
                        text-sm
                      ">
                        {tx.note ||
                          "No note"}
                      </p>

                    </div>

                    <p
                      className={`
                        font-black
                        text-lg
                        ${
                          tx.type ===
                          "income"
                            ? "text-[#C8F135]"
                            : "text-[#FF3CAC]"
                        }
                      `}
                    >
                      {formatINR(
                        tx.amount
                      )}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

            <Aiinsights
              transactions={
                transactions}
            />

           {/* GOALS */}
            <div
              className="
                bg-[#111111]
                border border-white/[0.07]
                rounded-3xl
                p-6
              "
            >

              <p className="
                text-[#A78BFA]
                font-mono
                text-[10px]
                uppercase
                mb-2
              ">
                Goals
              </p>

              <h2
                className="
                  text-2xl
                  font-black
                  mb-5
                "
                style={{
                  fontFamily:
                    "'Syne', sans-serif",
                }}
              >
                Savings Progress
              </h2>

              <div className="
                space-y-5
              ">

                {goals
                  .slice(0, 3)
                  .map((goal) => {

                  const pct =
                    Math.min(
                      (
                        Number(
                          goal.savedAmount
                        ) /
                        Number(
                          goal.targetAmount
                        )
                      ) *
                        100,
                      100
                    )

                  return (

                    <div
                      key={goal.id}
                    >

                      <div className="
                        flex justify-between
                        mb-2
                      ">

                        <p className="
                          font-bold
                        ">
                          {goal.title}
                        </p>

                        <p className="
                          text-[#C8F135]
                        ">
                          {
                            Math.round(
                              pct
                            )
                          }%
                        </p>

                      </div>

                      <div className="
                        h-2
                        bg-[#1A1A1A]
                        rounded-full
                        overflow-hidden
                      ">

                        <div
                          className="
                            h-full
                            bg-[#C8F135]
                            rounded-full
                          "
                          style={{
                            width:
                              `${pct}%`,
                          }}
                        />

                      </div>

                    </div>
                  )
                })}

              </div>

            </div>

          </div>

        </div>

      </div>
  )
}