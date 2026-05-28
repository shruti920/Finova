"use client"

import { useEffect, useState } from "react"

import BudgetForm from "../budget-form"
import BudgetList from "../budget-list"
import ParticleField from "../landing/ParticleField"

export default function DashboardBudgetsClient() {

  const [budgets, setBudgets] = useState([])
  const [transactions, setTransactions] = useState([])

  const [loading, setLoading] = useState(true)

  const refreshData = async (
    showLoader = true
  ) => {

    try {

      if (showLoader) {
        setLoading(true)
      }

      const [
        budgetsRes,
        transactionsRes,
      ] = await Promise.all([
        fetch("/api/budgets"),
        fetch("/api/transactions"),
      ])

      const budgetsData =
        await budgetsRes.json()

      const transactionsData =
        await transactionsRes.json()

      setBudgets(
        Array.isArray(budgetsData)
          ? budgetsData
          : []
      )

      setTransactions(
        Array.isArray(transactionsData)
          ? transactionsData
          : []
      )

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {

    const load = async () => {
      await refreshData()
    }

    load()

  }, [])

  return (

    <div
      className="relative min-h-screen text-white"
      style={{
        background: `
          linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
          var(--dark)
        `,
        backgroundSize: "52px 52px",
      }}
    >

      {/* particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ParticleField />
      </div>

      {/* content */}
      <div className="relative z-10 p-8">

        {/* HEADER */}
        <div className="mb-8">

          <p className="
            text-[#666]
            text-sm
          ">
            Budget planning
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
            Budgets
          </h1>

        </div>

        {/* FORM */}
        <BudgetForm
          onBudgetAdded={refreshData}
        />

        {/* LIST */}
        <BudgetList
          budgets={budgets}
          transactions={transactions}
          loading={loading}
          refreshData={refreshData}
        />

      </div>

    </div>
  )
}