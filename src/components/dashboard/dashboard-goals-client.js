"use client"

import { useEffect, useState } from "react"

import GoalForm from "@/components/goal-form"
import GoalsList from "@/components/goals-list"
import ParticleField from "@/components/landing/ParticleField"

export default function GoalsPage() {

  const [goals, setGoals] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const refreshGoals =
    async () => {

      try {

        setLoading(true)

        const res =
          await fetch("/api/goals")

        const data =
          await res.json()

        setGoals(
          Array.isArray(data)
            ? data
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
      await refreshGoals()
    }
    load()
  }, [])

  return (

    <div className="p-6">
      <div className="absolute inset-0 z-0 pointer-events-none">
              <ParticleField />
            </div>

      {/* header */}
      <div className="mb-8">

        <p className="
          text-[#C8F135]
          font-mono
          text-[10px]
          uppercase
          tracking-[0.14em]
          mb-2
        ">
          future planning
        </p>

        <h1
          className="
            text-5xl
            font-black
            text-white
            leading-none
          "
          style={{
            fontFamily:
              "'Syne', sans-serif",
          }}
        >
          Goals
        </h1>

      </div>

      {/* form */}
      <GoalForm
        onGoalAdded={
          refreshGoals
        }
      />

      {/* loading */}
      {loading ? (

        <div className="
          grid md:grid-cols-2 xl:grid-cols-3
          gap-5
        ">

          {Array.from({
            length: 3,
          }).map((_, i) => (

            <div
              key={i}
              className="
                h-[260px]
                rounded-3xl
                bg-[#111111]
                border border-white/[0.07]
                animate-pulse
              "
            />

          ))}

        </div>

      ) : (

        <GoalsList
          goals={goals}
        />

      )}

    </div>
  )
}