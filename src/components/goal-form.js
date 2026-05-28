"use client"

import { useState } from "react"
import toast from "react-hot-toast"

export default function GoalForm({
  onGoalAdded,
}) {

  const [form, setForm] =
    useState({
      title: "",
      targetAmount: "",
      savedAmount: "",
      deadline: "",
    })

  const [loading, setLoading] =
    useState(false)

  const handleSubmit =
    async (e) => {

      e.preventDefault()

      if (
        !form.title ||
        !form.targetAmount
      ) {
        toast.error(
          "Please fill required fields"
        )
        return
      }

      try {

        setLoading(true)

        const res =
          await fetch("/api/goals", {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(form),
          })

        if (!res.ok) {
          const data =
            await res.json()

          throw new Error(
            toast.error(data.error || data.message)
          )
        }

        toast.success(
          "Goal created"
        )

        setForm({
          title: "",
          targetAmount: "",
          savedAmount: "",
          deadline: "",
        })

        onGoalAdded()

      } catch (error) {

        console.error(
          "Form error:",
          error
        )

        toast.error(error.message)

      } finally {

        setLoading(false)

      }
    }

  return (

    <form
      onSubmit={handleSubmit}
      className="
        bg-[#111111]
        border border-white/[0.07]
        rounded-3xl
        p-6
        mb-6
      "
    >

      <div className="mb-5">

        <p className="text-[#C8F135]
        font-mono text-[10px]
        tracking-[0.12em]
        uppercase mb-1">
          savings planner
        </p>

        <h2
          className="text-3xl
          font-black text-white"
          style={{
            fontFamily:
              "'Syne', sans-serif",
          }}
        >
          Create Goal
        </h2>

      </div>

      <div className="grid md:grid-cols-2 gap-4">

        <input
          type="text"
          placeholder="Goal title"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
          className="
            bg-[#191919]
            border border-white/[0.06]
            rounded-2xl
            px-4 py-3
            outline-none
          "
        />

        <input
          type="number"
          placeholder="Target amount"
          value={form.targetAmount}
          onChange={(e) =>
            setForm({
              ...form,
              targetAmount:
                e.target.value,
            })
          }
          className="
            bg-[#191919]
            border border-white/[0.06]
            rounded-2xl
            px-4 py-3
            outline-none
          "
        />

        <input
          type="number"
          placeholder="Already saved"
          value={form.savedAmount}
          onChange={(e) =>
            setForm({
              ...form,
              savedAmount:
                e.target.value,
            })
          }
          className="
            bg-[#191919]
            border border-white/[0.06]
            rounded-2xl
            px-4 py-3
            outline-none
          "
        />

        <input
          type="date"
          value={form.deadline}
          onChange={(e) =>
            setForm({
              ...form,
              deadline:
                e.target.value,
            })
          }
          className="
            bg-[#191919]
            border border-white/[0.06]
            rounded-2xl
            px-4 py-3
            outline-none
          "
        />

      </div>

      <button
        type="submit"
        disabled={loading}
        className="
          mt-5
          bg-[#C8F135]
          text-black
          px-6 py-3
          rounded-2xl
          font-black
          hover:opacity-90
          transition-all
        "
        style={{
          fontFamily:
            "'Syne', sans-serif",
        }}
      >
        {loading
          ? "Creating..."
          : "Create Goal"}
      </button>

    </form>
  )
}