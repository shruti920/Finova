"use client"

import { useEffect, useState } from "react"

import TransactionForm from "@/components/transaction-form"
import TransactionList from "@/components/transaction-list"
import ParticleField from "@/components/landing/ParticleField"
import ReceiptHistory
from "@/components/receipt-history"

export default function DashboardTransactionsClient() {

  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)

  /* ─────────────────────────────────────────────
     FETCH DATA
  ───────────────────────────────────────────── */

  const refreshData = async () => {

    try {

      setLoading(true)

      const [
        transactionsRes,
        budgetsRes,
      ] = await Promise.all([
        fetch("/api/transactions"),
        fetch("/api/budgets"),
      ])

      const transactionsData =
        await transactionsRes.json()

      const budgetsData =
        await budgetsRes.json()

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

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)

    }
  }

  /* ─────────────────────────────────────────────
     INITIAL LOAD
  ───────────────────────────────────────────── */

  useEffect(() => {

    refreshData()

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

        {/* Header */}
        <div className="mb-8">

          <p className="text-[#666] text-sm">
            Manage your finances
          </p>

          <h1
            className="text-4xl font-black"
            style={{
              fontFamily:
                "'Syne', sans-serif",
            }}
          >
            Transactions
          </h1>

        </div>

        <div className="space-y-8">

          {/* Transaction Form */}
          <TransactionForm
            onTransactionAdded={refreshData}
          />

          {/* Transaction List */}
          <TransactionList
            transactions={transactions}
            budgets={budgets}
            loading={loading}
            refreshData={refreshData}
          />

          {/* Receipt History */}
          <ReceiptHistory />

        </div>

      </div>

    </div>
  )
}