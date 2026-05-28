"use client"

import { useEffect, useState } from "react"

export default function AIInsightsPanel() {

  const [data, setData] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  useEffect(() => {

    const loadInsights =
      async () => {

        try {

          setLoading(true)

          const res =
            await fetch("/api/ai-insights")

          const json =
            await res.json()

          if (!res.ok) {
            throw new Error(
              json.message ||
              "Failed to load AI insights"
            )
          }

          setData(json)

        } catch (err) {

          console.log(err)

          setError(
            "Unable to generate AI insights."
          )

        } finally {

          setLoading(false)

        }
      }

    loadInsights()

  }, [])

  /* ─────────────────────────────────────────────
     LOADING
  ───────────────────────────────────────────── */

  if (loading) {

    return (

      <div
        className="
          bg-[#111111]
          border border-white/[0.07]
          rounded-3xl
          p-6
          animate-pulse
        "
      >

        <div className="h-5 w-48 bg-[#1A1A1A] rounded mb-6" />

        <div className="space-y-3">

          {Array.from({ length: 5 }).map((_, i) => (

            <div
              key={i}
              className="h-16 rounded-2xl bg-[#1A1A1A]"
            />

          ))}

        </div>

      </div>
    )
  }

  /* ─────────────────────────────────────────────
     ERROR
  ───────────────────────────────────────────── */

  if (error) {

    return (

      <div
        className="
          bg-[#111111]
          border border-red-500/20
          rounded-3xl
          p-6
        "
      >

        <p className="text-red-400 font-bold">
          {error}
        </p>

      </div>
    )
  }

  const insights =
    data?.insights

  if (!insights) return null

  /* ─────────────────────────────────────────────
     MAIN UI
  ───────────────────────────────────────────── */

  return (

    <div className="mt-10">

      {/* header */}
      <div className="mb-6">

        <p
          className="
            text-[#C8F135]
            font-mono
            text-[10px]
            tracking-[0.14em]
            uppercase
            mb-2
          "
        >
          GPT-4o powered intelligence
        </p>

        <h2
          className="
            text-4xl
            font-black
            text-white
            leading-none
          "
          style={{
            fontFamily:
              "'Syne', sans-serif",
          }}
        >
          AI Financial Insights
        </h2>

      </div>

      {/* health score */}
      <div
        className="
          bg-[#111111]
          border border-white/[0.07]
          rounded-3xl
          p-6
          mb-6
          relative
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            -right-10
            -top-10
            w-40
            h-40
            rounded-full
            blur-3xl
            opacity-10
          "
          style={{
            background:
              insights.healthScore >= 7.0
                ? "#C8F135"
                : insights.healthScore >= 4.0
                ? "#FFB020"
                : "#FF4D4D",
          }}
        />

        <div className="relative z-10">

          <p className="text-[#666] font-mono text-[11px] uppercase mb-2">
            Financial Health Score
          </p>

          <div className="flex items-end gap-4 mb-4">

            <h1
              className="text-7xl font-black"
              style={{
                fontFamily:
                  "'Syne', sans-serif",
                color:
                  insights.healthScore >= 7.0
                    ? "#C8F135"
                    : insights.healthScore >= 4.0
                    ? "#FFB020"
                    : "#FF4D4D",
              }}
            >
              {insights.healthScore}
            </h1>

            <span className="text-[#666] mb-2">
              /100
            </span>

          </div>

          <p className="text-[#999] leading-relaxed max-w-3xl">
            {insights.healthSummary}
          </p>

        </div>

      </div>

      {/* top insight */}
      <div
        className="
          bg-[#C8F135]
          text-black
          rounded-3xl
          p-6
          mb-6
        "
      >

        <p className="font-mono text-[11px] uppercase mb-2">
          Top Priority
        </p>

        <h3
          className="
            text-2xl
            font-black
            leading-snug
          "
          style={{
            fontFamily:
              "'Syne', sans-serif",
          }}
        >
          {insights.topInsight}
        </h3>

      </div>

      {/* risks */}
      <div className="grid md:grid-cols-2 gap-5 mb-6">

        {insights.risks?.map((risk, i) => (

          <div
            key={i}
            className="
              bg-[#111111]
              border border-red-500/10
              rounded-3xl
              p-5
            "
          >

            <p className="text-red-400 font-mono text-[11px] uppercase mb-3">
              Risk
            </p>

            <h3
              className="
                text-white
                text-xl
                font-black
                mb-2
              "
              style={{
                fontFamily:
                  "'Syne', sans-serif",
              }}
            >
              {risk.title}
            </h3>

            <p className="text-[#777] leading-relaxed text-sm">
              {risk.detail}
            </p>

          </div>

        ))}

      </div>

      {/* savings opportunities */}
      <div className="mb-6">

        <h3
          className="
            text-white
            text-2xl
            font-black
            mb-4
          "
          style={{
            fontFamily:
              "'Syne', sans-serif",
          }}
        >
          Savings Opportunities
        </h3>

        <div className="grid md:grid-cols-2 gap-5">

          {insights.savingsOpportunities?.map((item, i) => (

            <div
              key={i}
              className="
                bg-[#111111]
                border border-white/[0.07]
                rounded-3xl
                p-5
              "
            >

              <div className="flex items-center justify-between mb-4">

                <h4
                  className="
                    text-white
                    text-xl
                    font-black
                  "
                  style={{
                    fontFamily:
                      "'Syne', sans-serif",
                  }}
                >
                  {item.title}
                </h4>

                <div
                  className="
                    bg-[#C8F13520]
                    text-[#C8F135]
                    px-3
                    py-1
                    rounded-full
                    font-mono
                    text-xs
                  "
                >
                  {item.potentialSaving}
                </div>

              </div>

              <p className="text-[#888] text-sm leading-relaxed">
                {item.action}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* budget advice */}
      <div className="mb-6">

        <h3
          className="
            text-white
            text-2xl
            font-black
            mb-4
          "
          style={{
            fontFamily:
              "'Syne', sans-serif",
          }}
        >
          Budget Advice
        </h3>

        <div className="space-y-4">

          {insights.budgetAdvice?.map((item, i) => (

            <div
              key={i}
              className="
                bg-[#111111]
                border border-white/[0.07]
                rounded-2xl
                p-5
                flex
                items-start
                justify-between
                gap-5
              "
            >

              <div>

                <h4
                  className="
                    text-white
                    font-black
                    text-lg
                    mb-2
                  "
                  style={{
                    fontFamily:
                      "'Syne', sans-serif",
                  }}
                >
                  {item.category}
                </h4>

                <p className="text-[#777] text-sm">
                  {item.advice}
                </p>

              </div>

              <div
                className="
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-mono
                  uppercase
                  flex-shrink-0
                "
                style={{
                  background:
                    item.status === "over"
                      ? "#FF4D4D20"
                      : item.status === "under"
                      ? "#00D4FF20"
                      : "#C8F13520",

                  color:
                    item.status === "over"
                      ? "#FF4D4D"
                      : item.status === "under"
                      ? "#00D4FF"
                      : "#C8F135",
                }}
              >
                {item.status}
              </div>

            </div>

          ))}

        </div>

      </div>

      {/* goals */}
      <div>

        <h3
          className="
            text-white
            text-2xl
            font-black
            mb-4
          "
          style={{
            fontFamily:
              "'Syne', sans-serif",
          }}
        >
          Goal Forecasts
        </h3>

        <div className="grid md:grid-cols-2 gap-5">

          {insights.goalForecasts?.map((goal, i) => (

            <div
              key={i}
              className="
                bg-[#111111]
                border border-white/[0.07]
                rounded-3xl
                p-5
              "
            >

              <div className="flex items-center justify-between mb-3">

                <h4
                  className="
                    text-white
                    text-xl
                    font-black
                  "
                  style={{
                    fontFamily:
                      "'Syne', sans-serif",
                  }}
                >
                  {goal.goalName}
                </h4>

                <div
                  className="
                    w-3
                    h-3
                    rounded-full
                  "
                  style={{
                    background:
                      goal.onTrack
                        ? "#C8F135"
                        : "#FF4D4D",
                  }}
                />

              </div>

              <p className="text-[#888] text-sm leading-relaxed">
                {goal.forecast}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}