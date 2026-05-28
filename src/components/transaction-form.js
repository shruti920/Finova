"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import ReceiptScanner
from "./receipt-scanner"

const CATEGORIES = [
  "Food & Drink",
  "Transport",
  "Housing",
  "Shopping",
  "Health",
  "Entertainment",
  "Education",
  "Salary",
  "Freelance",
  "Investment",
  "Other",
]

const INITIAL_STATE = {
  amount: "",
  type: "expense",
  category: "",
  note: "",
}

export default function TransactionForm({
  onTransactionAdded,
}) {

  const [formData, setFormData] =
    useState(INITIAL_STATE)
  
  const handleReceiptData =
  (data) => {

    setFormData((prev) => ({

      ...prev,

      amount:
        data.amount,

      category:
        data.category,

      note:
        data.note,
    }))
  }

  const [loading, setLoading] =
    useState(false)

  const handleChange = (e) => {

    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    const amount = Number(formData.amount)

    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount")
      return
    }

    if (!formData.category) {
      toast.error("Select a category")
      return
    }

    try {

      setLoading(true)

      const res = await fetch(
        "/api/transactions",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            amount,
            type: formData.type,
            category: formData.category,
            note: formData.note,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data?.message ||
          "Failed to add transaction"
        )
      }

      setFormData(INITIAL_STATE)

      toast.success("Transaction added")

      if (onTransactionAdded) {
        onTransactionAdded(false)
      }

    } catch (error) {

      toast.error(
        error.message ||
        "Something went wrong"
      )

    } finally {

      setLoading(false)
    }
  }

  const isExpense =
    formData.type === "expense"

  return (
    <div
      className="
        bg-[#111111]
        border border-white/[0.07]
        rounded-2xl
        p-8
        w-full
        space-y-5
      "
    >

      {/* receipt scanner */}
      <ReceiptScanner
        onScanComplete={
          handleReceiptData
        }
      />
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* HEADER */}
        <div className="mb-2">

          <p
            className="
              text-[#C8F135]
              font-mono
              text-[11px]
              tracking-[0.12em]
              uppercase
              mb-2
            "
          >
            Fintrack
          </p>

          <h2
            className="
              text-[#F2F2F2]
              text-3xl
              font-black
              tracking-tight
              leading-none
            "
            style={{
              fontFamily: "'Syne', sans-serif",
            }}
          >
            Add Transaction
          </h2>

          <p className="text-[#666] text-sm mt-1">
            What did your money do today?
          </p>
        </div>

        {/* TYPE TOGGLE */}
        <div
          className="
            flex gap-0
            bg-[#191919]
            rounded-xl
            p-1
          "
        >

          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                type: "expense",
              }))
            }
            className={`
              flex-1 py-2.5 rounded-lg
              text-sm font-bold
              transition-all duration-200
              ${
                isExpense
                  ? "bg-[#FF3CAC]/10 text-[#FF3CAC] border border-[#FF3CAC]/30"
                  : "text-[#666] border border-transparent hover:text-[#999]"
              }
            `}
            style={{
              fontFamily: "'Syne', sans-serif",
            }}
          >
            ↓ Expense
          </button>

          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                type: "income",
              }))
            }
            className={`
              flex-1 py-2.5 rounded-lg
              text-sm font-bold
              transition-all duration-200
              ${
                !isExpense
                  ? "bg-[#C8F135]/10 text-[#C8F135] border border-[#C8F135]/30"
                  : "text-[#666] border border-transparent hover:text-[#999]"
              }
            `}
            style={{
              fontFamily: "'Syne', sans-serif",
            }}
          >
            ↑ Income
          </button>
        </div>

        {/* AMOUNT */}
        <div className="space-y-1.5">

          <label
            className="
              text-[#666]
              font-mono
              text-[10px]
              tracking-[0.1em]
              uppercase
              block
            "
          >
            Amount (₹)
          </label>

          <div className="relative">

            <span
              className="
                absolute left-4 top-1/2
                -translate-y-1/2
                text-[#666]
                font-mono
                text-lg
              "
            >
              ₹
            </span>

            <input
              type="number"
              name="amount"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
              className="
                w-full bg-[#191919]
                border border-white/[0.07]
                text-[#F2F2F2]
                placeholder-[#333]
                rounded-xl
                pl-9 pr-4 py-3.5
                text-2xl font-black
                tracking-tight
                outline-none
                focus:border-[#C8F135]/40
                focus:bg-[#1a1a1a]
                transition-all duration-200
              "
              style={{
                fontFamily: "'Syne', sans-serif",
              }}
            />
          </div>
        </div>

        {/* CATEGORY */}
        <div className="space-y-1.5">

          <label
            className="
              text-[#666]
              font-mono
              text-[10px]
              tracking-[0.1em]
              uppercase
              block
            "
          >
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="
              w-full bg-[#191919]
              border border-white/[0.07]
              text-[#F2F2F2]
              rounded-xl
              px-4 py-3.5
              text-[15px]
              outline-none
              cursor-pointer
              focus:border-[#C8F135]/40
              focus:bg-[#1a1a1a]
              transition-all duration-200
              appearance-none
            "
          >
            <option value="">
              Pick a category…
            </option>

            {CATEGORIES.map((c) => (
              <option
                key={c}
                value={c}
                className="
                  bg-[#191919]
                  text-[#F2F2F2]
                "
              >
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* NOTE */}
        <div className="space-y-1.5">

          <label
            className="
              text-[#666]
              font-mono
              text-[10px]
              tracking-[0.1em]
              uppercase
              block
            "
          >
            Note
          </label>

          <textarea
            name="note"
            placeholder="What was this for?"
            value={formData.note}
            onChange={handleChange}
            rows={3}
            className="
              w-full bg-[#191919]
              border border-white/[0.07]
              text-[#F2F2F2]
              placeholder-[#333]
              rounded-xl
              px-4 py-3.5
              text-[15px]
              outline-none
              resize-none
              focus:border-[#C8F135]/40
              focus:bg-[#1a1a1a]
              transition-all duration-200
            "
          />
        </div>

        {/* SUMMARY */}
        {formData.amount && (
          <div
            className={`
              flex items-center gap-3
              px-4 py-3 rounded-xl border
              ${
                isExpense
                  ? "bg-[#FF3CAC]/06 border-[#FF3CAC]/20 text-[#FF3CAC]"
                  : "bg-[#C8F135]/06 border-[#C8F135]/20 text-[#C8F135]"
              }
            `}
          >

            <span className="text-lg">
              {isExpense ? "↓" : "↑"}
            </span>

            <div>

              <div
                className="
                  font-black text-lg
                  leading-none
                "
                style={{
                  fontFamily:
                    "'Syne', sans-serif",
                }}
              >
                {isExpense ? "−" : "+"}
                ₹
                {Number(
                  formData.amount || 0
                ).toLocaleString("en-IN")}
              </div>

              <div
                className="
                  text-[11px]
                  font-mono
                  opacity-60
                  mt-0.5
                "
              >
                {formData.category ||
                  "Uncategorised"}
                {" · "}
                {formData.type}
              </div>
            </div>
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full py-4 rounded-xl
            font-black text-[15px]
            tracking-wide
            transition-all duration-200
            flex items-center
            justify-center gap-2
            ${
              loading
                ? "bg-[#C8F135]/50 text-[#000] cursor-not-allowed"
                : "bg-[#C8F135] text-[#000] hover:opacity-90 active:scale-[0.98]"
            }
          `}
          style={{
            fontFamily:
              "'Syne', sans-serif",
          }}
        >
          {loading ? (
            <>
              <span
                className="
                  inline-block w-4 h-4
                  border-2 border-black/30
                  border-t-black
                  rounded-full
                  animate-spin
                "
              />
              Saving…
            </>
          ) : (
            "Save Transaction →"
          )}
        </button>

      </form>
    </div>
  )
}