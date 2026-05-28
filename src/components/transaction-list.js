"use client"

import { useMemo, useState } from "react"
import toast from "react-hot-toast"

const TYPE_ICON = {
  food: "🍔",
  transport: "🚗",
  housing: "🏠",
  shopping: "🛒",
  health: "💊",
  entertainment: "🎬",
  education: "📚",
  salary: "💼",
  freelance: "💻",
  investment: "📈",
  other: "💸",
}

const FILTERS = ["All", "Income", "Expense"]

const getCategoryIcon = (category = "") =>
  TYPE_ICON[category.toLowerCase().split(" ")[0]] ?? "💸"

const formatAmount = (amount) =>
  Number(amount).toLocaleString("en-IN")

export default function TransactionList({
  transactions = [],
  loading = false,
  refreshData,
}) {

  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [editingTransaction, setEditingTransaction] =
    useState(null)

  const [editForm, setEditForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    note: "",
  })

  const [updating, setUpdating] = useState(false)

  /* ─────────────────────────────────────────────
     FILTERED TRANSACTIONS
  ───────────────────────────────────────────── */
  const filtered = useMemo(() => {

    return transactions.filter((tx) => {

      const matchFilter =
        filter === "All" ||
        tx.type.toLowerCase() === filter.toLowerCase()

      const matchSearch =
        search === "" ||
        tx.category
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (tx.note ?? "")
          .toLowerCase()
          .includes(search.toLowerCase())

      return matchFilter && matchSearch

    })

  }, [transactions, filter, search])

  /* ─────────────────────────────────────────────
     OPEN EDIT MODAL
  ───────────────────────────────────────────── */
  const openEditModal = (tx) => {

    setEditingTransaction(tx)

    setEditForm({
      amount: tx.amount,
      type: tx.type,
      category: tx.category,
      note: tx.note || "",
    })
  }

  /* ─────────────────────────────────────────────
     DELETE TRANSACTION
  ───────────────────────────────────────────── */
  const deleteTransaction = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    )

    if (!confirmed) return

    try {

      const res = await fetch(
        `/api/transactions?id=${id}`,
        {
          method: "DELETE",
        }
      )

      if (!res.ok) {
        throw new Error(
          "Failed to delete transaction"
        )
      }

      toast.success("Transaction deleted")

      refreshData(false)

    } catch (error) {

      toast.error(error.message)

    }
  }

  /* ─────────────────────────────────────────────
     UPDATE TRANSACTION
  ───────────────────────────────────────────── */
  const updateTransaction = async () => {

    if (!editingTransaction) return

    if (
      !editForm.amount ||
      !editForm.category
    ) {
      toast.error(
        "Please fill all required fields"
      )
      return
    }

    try {

      setUpdating(true)

      const res = await fetch(
        "/api/transactions",
        {

          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id: editingTransaction.id,
            ...editForm,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.message ||
          "Failed to update transaction"
        )
      }

      toast.success("Transaction updated")

      setEditingTransaction(null)

      refreshData(false)

    } catch (error) {

      toast.error(error.message)

    } finally {

      setUpdating(false)

    }
  }

  return (

    <div className="w-full">

      {/* ─────────────────────────────────────────────
          HEADER
      ───────────────────────────────────────────── */}
      <div className="mb-6">

        <p className="text-[#C8F135] font-mono text-[11px] tracking-[0.12em] uppercase mb-1">
          {transactions.length} transactions
        </p>

        <h2
          className="text-[#F2F2F2] text-3xl font-black tracking-tight leading-none"
          style={{
            fontFamily:
              "'Syne', sans-serif",
          }}
        >
          Recent Transactions
        </h2>

      </div>

      {/* ─────────────────────────────────────────────
          SEARCH + FILTER
      ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 mb-5">

        <input
          type="text"
          placeholder="Search transactions…"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            bg-[#111111]
            border border-white/[0.07]
            text-[#F2F2F2]
            placeholder-[#333]
            rounded-xl
            px-4 py-3
            text-[14px]
            outline-none
            focus:border-[#C8F135]/40
          "
        />

        <div className="flex gap-2 flex-wrap">

          {FILTERS.map((f) => (

            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`
                px-4 py-2
                rounded-full
                text-[12px]
                font-mono
                border
                transition-all duration-200
                ${
                  filter === f
                    ? "bg-[#C8F135]/10 border-[#C8F135] text-[#C8F135]"
                    : "bg-[#111111] border-white/[0.07] text-[#666]"
                }
              `}
            >
              {f}
            </button>

          ))}

        </div>

      </div>

      {/* ─────────────────────────────────────────────
          TRANSACTIONS GRID
      ───────────────────────────────────────────── */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-4
      ">

        {/* LOADING */}
        {loading &&
          Array.from({ length: 4 }).map(
            (_, i) => (
              <div
                key={i}
                className="
                  bg-[#111111]
                  border border-white/[0.07]
                  rounded-2xl
                  p-4
                  animate-pulse
                  h-[180px]
                "
              />
            )
          )}

        {/* EMPTY */}
        {!loading &&
          filtered.length === 0 && (

          <div className="
            col-span-full
            bg-[#111111]
            border border-white/[0.07]
            rounded-2xl
            px-6 py-12
            text-center
          ">

            <p className="text-4xl mb-3">
              🫙
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
              Nothing here
            </p>

            <p className="
              text-[#666]
              text-sm
              mt-1
              font-mono
            ">
              Add your first transaction above.
            </p>

          </div>
        )}

        {/* TRANSACTION CARDS */}
        {!loading &&
          filtered.map((tx) => {

            const isIncome =
              tx.type === "income"

            return (

              <div
                key={tx.id}
                className="
                  bg-[#111111]
                  border border-white/[0.07]
                  rounded-2xl
                  p-4
                  hover:border-white/[0.12]
                  transition-all duration-200
                "
              >

                <div className="
                  flex items-start gap-3 mb-4
                ">

                  <div className="
                    w-10 h-10
                    rounded-xl
                    bg-[#191919]
                    flex items-center
                    justify-center
                    text-[18px]
                  ">
                    {getCategoryIcon(
                      tx.category
                    )}
                  </div>

                  <div className="
                    flex-1 min-w-0
                  ">

                    <h3
                      className="
                        text-[#F2F2F2]
                        font-black
                        text-[14px]
                        truncate
                      "
                      style={{
                        fontFamily:
                          "'Syne', sans-serif",
                      }}
                    >
                      {tx.category}
                    </h3>

                    {tx.note && (

                      <p className="
                        text-[#666]
                        text-[11px]
                        font-mono
                        mt-1
                        truncate
                      ">
                        {tx.note}
                      </p>

                    )}

                  </div>

                </div>

                <p
                  className={`
                    font-black
                    text-[18px]
                    ${
                      isIncome
                        ? "text-[#C8F135]"
                        : "text-[#FF3CAC]"
                    }
                  `}
                  style={{
                    fontFamily:
                      "'Syne', sans-serif",
                  }}
                >
                  {isIncome ? "+" : "-"}₹
                  {formatAmount(tx.amount)}
                </p>

                <div className="
                  flex gap-2 mt-4
                ">

                  <button
                    onClick={() =>
                      openEditModal(tx)
                    }
                    className="
                      flex-1
                      bg-[#00D4FF]/10
                      text-[#00D4FF]
                      rounded-xl
                      py-2
                      text-sm
                      hover:bg-[#00D4FF]/20
                      transition-all
                    "
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteTransaction(tx.id)
                    }
                    className="
                      flex-1
                      bg-[#FF3CAC]/10
                      text-[#FF3CAC]
                      rounded-xl
                      py-2
                      text-sm
                      hover:bg-[#FF3CAC]/20
                      transition-all
                    "
                  >
                    Delete
                  </button>

                </div>

              </div>
            )
          })}
      </div>

      {/* ─────────────────────────────────────────────
          EDIT MODAL
      ───────────────────────────────────────────── */}
      {editingTransaction && (

        <div className="
          fixed inset-0
          bg-black/70
          flex items-center
          justify-center
          z-50
          p-4
        ">

          <div className="
            bg-[#111111]
            p-6
            rounded-2xl
            w-full
            max-w-md
            border border-white/[0.07]
          ">

            <h2
              className="
                text-2xl
                font-black
                text-white
                mb-5
              "
              style={{
                fontFamily:
                  "'Syne', sans-serif",
              }}
            >
              Edit Transaction
            </h2>

            <div className="space-y-4">

              <input
                type="number"
                value={editForm.amount}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    amount:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  bg-[#191919]
                  rounded-xl
                  p-3
                  outline-none
                "
                placeholder="Amount"
              />

              <select
                value={editForm.type}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    type:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  bg-[#191919]
                  rounded-xl
                  p-3
                  outline-none
                "
              >
                <option value="expense">
                  Expense
                </option>

                <option value="income">
                  Income
                </option>
              </select>

              <input
                type="text"
                value={editForm.category}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    category:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  bg-[#191919]
                  rounded-xl
                  p-3
                  outline-none
                "
                placeholder="Category"
              />

              <textarea
                value={editForm.note}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    note:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  bg-[#191919]
                  rounded-xl
                  p-3
                  outline-none
                "
                placeholder="Note"
              />

              <div className="
                flex gap-3
              ">

                <button
                  onClick={
                    updateTransaction
                  }
                  disabled={updating}
                  className={`
                    flex-1
                    rounded-xl
                    py-3
                    font-bold
                    transition-all duration-200
                    ${
                      updating
                        ? "bg-[#C8F135]/50 text-black/50 cursor-not-allowed"
                        : "bg-[#C8F135] text-black hover:opacity-90"
                    }
                  `}
                >
                  {updating
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <button
                  onClick={() =>
                    setEditingTransaction(
                      null
                    )
                  }
                  className="
                    flex-1
                    bg-[#222]
                    text-white
                    rounded-xl
                    py-3
                  "
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────
          FOOTER
      ───────────────────────────────────────────── */}
      {!loading &&
        filtered.length > 0 && (

        <p className="
          text-center
          text-[#444]
          font-mono
          text-[11px]
          mt-6
        ">
          showing {filtered.length} of{" "}
          {transactions.length} transactions
        </p>

      )}

    </div>
  )
}