"use client"

import { useMemo } from "react"

import { generateRecommendations }
  from "@/utils/recommendations"

export default function RecommendationsPanel({
  transactions = [],
  budgets = [],
}) {

  const recommendations = useMemo(() => {

    return generateRecommendations(
      transactions,
      budgets
    )

  }, [transactions, budgets])

  return (

    <div className="mt-10">

      {/* ─────────────────────────────
          HEADER
      ───────────────────────────── */}

      <div className="mb-6">

        <h2
          className="
            text-[#F2F2F2]
            text-3xl
            font-black
            tracking-tight
          "
          style={{
            fontFamily:
              "'Syne', sans-serif",
          }}
        >
          Smart Recommendations
        </h2>

      </div>

      {/* ─────────────────────────────
          RECOMMENDATIONS GRID
      ───────────────────────────── */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-5
      ">

        {recommendations.map((item, index) => {

          const colors = {

            success: "#34D399",

            warning: "#FFB020",

            danger: "#FF4D4D",
          }

          const color =
            colors[item.type] || "#C8F135"

          return (

            <div
              key={index}
              className="
                relative
                bg-[#111111]
                border border-white/[0.07]
                rounded-2xl
                p-5
                overflow-hidden
                hover:border-white/[0.12]
                transition-all duration-300
              "
            >

              {/* glow */}
              <div
                className="
                  absolute
                  -top-10
                  -right-10
                  w-32
                  h-32
                  rounded-full
                  blur-3xl
                  opacity-[0.08]
                  pointer-events-none
                "
                style={{
                  background: color,
                }}
              />

              {/* top row */}
              <div className="
                flex items-center
                justify-between
                mb-4
              ">

                <div
                  className="
                    w-12 h-12
                    rounded-2xl
                    flex items-center justify-center
                    text-[22px]
                  "
                  style={{
                    background:
                      `${color}15`,
                  }}
                >
                  {item.icon}
                </div>

                <div
                  className="
                    px-2.5 py-1
                    rounded-full
                    text-[10px]
                    font-mono
                    uppercase
                  "
                  style={{
                    background:
                      `${color}15`,

                    color,
                  }}
                >
                  {item.type}
                </div>

              </div>

              {/* title */}
              <h3
                className="
                  text-[#F2F2F2]
                  text-lg
                  font-black
                  mb-2
                "
                style={{
                  fontFamily:
                    "'Syne', sans-serif",
                }}
              >
                {item.title}
              </h3>

              {/* message */}
              <p className="
                text-[#666]
                text-sm
                leading-relaxed
                font-mono
              ">
                {item.message}
              </p>

            </div>
          )
        })}

      </div>

    </div>
  )
}