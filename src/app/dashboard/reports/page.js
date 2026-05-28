"use client"

import {
  useEffect,
  useRef,
  useState,
} from "react"

import html2canvas
from "html2canvas"

import jsPDF
from "jspdf"

export default function ReportsPage() {

  const [loading, setLoading] =
    useState(true)

  const [fullData, setFullData] =
    useState(null)

  const [error, setError] =
    useState(null)

  const [selectedMonth, setSelectedMonth] =
    useState(new Date())

  const reportRef =
    useRef(null)

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from(
    { length: 5 },
    (_, i) =>
      currentYear - i
  )

  /* ─────────────────────────────
     FETCH REPORT
  ───────────────────────────── */

  useEffect(() => {

    fetchReport()

  }, [selectedMonth])

  const fetchReport =
    async () => {

      try {

        setLoading(true)

        setError(null)

        const month =
          selectedMonth.getMonth()

        const year =
          selectedMonth.getFullYear()

        const res =
          await fetch(
            `/api/reports/monthly?month=${month}&year=${year}`
          )

        if (!res.ok) {
          throw new Error(
            `API error: ${res.status}`
          )
        }

        const data =
          await res.json()

        console.log(
          "Report data:",
          data
        )

        if (!data.report) {
          throw new Error(
            "No report data returned"
          )
        }

        const hasData =
          data.financialMetrics
            ?.income > 0 ||
          data.categoryBreakdown
            ?.length > 0

        if (!hasData) {
          setError(
            `No financial data available for ${selectedMonth.toLocaleDateString(
              "en-US",
              {
                month: "long",
                year: "numeric",
              }
            )}`
          )
          setFullData(null)
          return
        }

        setFullData(data)

      } catch (error) {

        console.error(
          "Fetch error:",
          error
        )

        setError(error.message)

        setFullData(null)

      } finally {

        setLoading(false)
      }
    }

  /* ─────────────────────────────
     EXPORT PDF
  ───────────────────────────── */

  const exportPDF =
    async () => {

      if (!reportRef.current)
        return

      try {

        const canvas =
          await html2canvas(
            reportRef.current,
            {
              scale: 3,
              backgroundColor: "#0E0E0E",
              useCORS: true,
              allowTaint: false,
              imageTimeout: 10000,
            }
          )

        const imgData =
          canvas.toDataURL(
            "image/png"
          )

        const pdf =
          new jsPDF(
            "p",
            "mm",
            "a4"
          )

        const pdfWidth =
          pdf.internal.pageSize.getWidth()

        const pdfHeight =
          (canvas.height *
            pdfWidth) /
          canvas.width

        pdf.addImage(
          imgData,
          "PNG",
          0,
          0,
          pdfWidth,
          pdfHeight
        )

        pdf.save(
          `Finova_Report_${selectedMonth.toLocaleDateString()}.pdf`
        )

      } catch (error) {

        console.error(
          "PDF export error:",
          error
        )

        alert(
          "Failed to export PDF. Please try again."
        )
      }
    }

  const formatINR = (num) =>
    `₹${Number(num || 0).toLocaleString("en-IN")}`

  const report =
    fullData?.report

  const metrics =
    fullData?.financialMetrics

  const categories =
    fullData?.categoryBreakdown || []

  const budgets =
    fullData?.budgetStatus || []

  const goals =
    fullData?.goalProgress || []

  if (loading) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        text-white
      ">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-[#C8F135] border-t-transparent rounded-full mx-auto mb-4" />
          Generating AI report...
        </div>
      </div>
    )
  }

  if (!report) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        text-white
        flex-col
        gap-6
        p-6
      ">

        <div className="text-center">

          <h2 className="
            text-3xl
            font-black
            mb-3
          "
          style={{
            fontFamily: "'Syne', sans-serif",
          }}>
            {error?.includes("No financial data")
              ? "📊 No Data Available"
              : "Failed to Load Report"}
          </h2>

          {error && (
            <p className="
              text-lg
              text-[#AAA]
            "
            style={{
              color: "#AAAAAA",
            }}>
              {error}
            </p>
          )}

          <button
            onClick={fetchReport}
            className="
              mt-6
              bg-[#C8F135]
              text-black
              px-6
              py-3
              rounded-2xl
              font-black
              hover:scale-105
              transition-all
            "
          >
            Try Another Month
          </button>

        </div>

      </div>
    )
  }

  return (

    <div className="
      min-h-screen
      bg-[#0A0A0A]
      text-white
      p-6
      pb-20
    "
    style={{
      backgroundColor: "#0A0A0A",
      color: "#FFFFFF",
    }}>

      {/* top */}
      <div className="
        flex
        flex-col
        md:flex-row
        items-start
        md:items-center
        justify-between
        mb-8
        gap-6
        max-w-7xl
        mx-auto
      ">

        <div className="animate-in fade-in slide-in-from-left-4 duration-500">

          <p className="
            text-[#C8F135]
            uppercase
            tracking-[0.14em]
            text-xs
            font-mono
            mb-2
          ">
            AI financial report
          </p>

          <h1
            className="
              text-5xl
              font-black
            "
            style={{
              fontFamily:
                "'Syne', sans-serif",
            }}
          >
            {selectedMonth.toLocaleDateString(
              "en-US",
              {
                month: "long",
                year: "numeric",
              }
            )} Report
          </h1>

        </div>

        <div className="
          flex
          flex-col
          sm:flex-row
          gap-3
          w-full
          md:w-auto
          animate-in fade-in slide-in-from-right-4 duration-500
        ">

          <select
            value={`${selectedMonth.getMonth()}-${selectedMonth.getFullYear()}`}
            onChange={(e) => {
              const [month, year] =
                e.target.value.split("-")
              setSelectedMonth(
                new Date(
                  Number(year),
                  Number(month),
                  1
                )
              )
            }}
            className="
              bg-[#151515]
              border border-white/[0.08]
              rounded-2xl
              px-4
              py-3
              text-white
              outline-none
              hover:border-white/[0.12]
              transition-all
              text-sm
            "
          >
            {years.map((year) =>
              months.map((month, idx) => (
                <option
                  key={`${idx}-${year}`}
                  value={`${idx}-${year}`}
                >
                  {month} {year}
                </option>
              ))
            )}
          </select>

          <button
            onClick={exportPDF}
            className="
              bg-[#C8F135]
              text-black
              px-6
              py-3
              rounded-2xl
              font-black
              hover:scale-105
              transition-all
              hover:shadow-lg
              hover:shadow-[#C8F135]/20
              text-sm
            "
          >
            📥 Export PDF
          </button>

        </div>

      </div>

      {/* report */}
      <div
        ref={reportRef}
        className="
          space-y-6
          max-w-7xl
          mx-auto
        "
      >

        {/* ─────────────────────────────
            AI INSIGHTS SECTION
        ───────────────────────────── */}
        <div
          className="
            bg-[#111111]
            border
            border-white/[0.08]
            rounded-3xl
            p-8
            space-y-8
            animate-in fade-in slide-in-from-bottom-4 duration-500
          "
          style={{
            backgroundColor: "#111111",
            borderColor: "rgba(255, 255, 255, 0.08)",
            color: "#FFFFFF",
          }}
        >

          {/* score */}
          <div
            className="
              bg-[#151515]
              rounded-3xl
              p-8
            "
            style={{
              backgroundColor: "#151515",
            }}
          >

            <p className="
              text-[#666]
              mb-3
            "
            style={{
              color: "#666666",
            }}>
              Financial Health Score
            </p>

            <h2
              className="
                text-7xl
                font-black
                text-[#C8F135]
              "
              style={{
                fontFamily:
                  "'Syne', sans-serif",
                color: "#C8F135",
              }}
            >
              {report.healthScore}
            </h2>

            <p className="
              text-[#888]
              mt-2
              text-sm
            "
            style={{
              color: "#888888",
            }}>
              {report.healthRating}
            </p>

          </div>

          {/* summary */}
          <div>

            <h3
              className="
                text-3xl
                font-black
                mb-4
              "
              style={{
                fontFamily:
                  "'Syne', sans-serif",
              }}
            >
              AI Summary
            </h3>

            <p className="
              text-[#AAA]
              leading-relaxed
              text-lg
            "
            style={{
              color: "#AAAAAA",
            }}>
              {report.summary}
            </p>

          </div>

          {/* insights */}
          <div>

            <h3
              className="
                text-3xl
                font-black
                mb-5
              "
              style={{
                fontFamily:
                  "'Syne', sans-serif",
              }}
            >
              🔍 Key Insights
            </h3>

            <div className="
              grid
              md:grid-cols-2
              gap-5
            ">

              {report.insights?.map(
                (
                  insight,
                  index
                ) => (

                  <div
                    key={index}
                    className="
                      bg-[#151515]
                      rounded-2xl
                      p-5
                      border
                      border-white/[0.06]
                      hover:border-white/[0.12]
                      transition-all
                    "
                    style={{
                      backgroundColor: "#151515",
                      borderColor: "rgba(255, 255, 255, 0.06)",
                    }}
                  >

                    <p className="
                      text-[#AAA]
                      leading-relaxed
                    "
                    style={{
                      color: "#AAAAAA",
                    }}>
                      {insight}
                    </p>

                  </div>
                )
              )}

            </div>

          </div>

          {/* recommendations */}
          <div>

            <h3
              className="
                text-3xl
                font-black
                mb-5
              "
              style={{
                fontFamily:
                  "'Syne', sans-serif",
              }}
            >
              💡 Recommendations
            </h3>

            <div className="space-y-3">

              {report.recommendations?.map(
                (
                  rec,
                  index
                ) => (

                  <div
                    key={index}
                    className="
                      bg-[#151515]
                      rounded-2xl
                      p-5
                      border
                      border-white/[0.06]
                      flex
                      gap-4
                      hover:border-white/[0.12]
                      transition-all
                    "
                    style={{
                      backgroundColor: "#151515",
                      borderColor: "rgba(255, 255, 255, 0.06)",
                    }}
                  >

                    <div className="
                      flex-shrink-0
                      w-8
                      h-8
                      rounded-lg
                      bg-[#C8F135]
                      flex
                      items-center
                      justify-center
                      text-black
                      font-black
                      text-sm
                    ">
                      {index + 1}
                    </div>

                    <p className="
                      text-[#AAA]
                      leading-relaxed
                    "
                    style={{
                      color: "#AAAAAA",
                    }}>
                      {rec}
                    </p>

                  </div>
                )
              )}

            </div>

          </div>

        </div>

        {/* ─────────────────────────────
            FINANCIAL METRICS
        ───────────────────────────── */}
        <div
          className="
            grid
            md:grid-cols-2
            lg:grid-cols-4
            gap-4
            animate-in fade-in slide-in-from-bottom-4 duration-500
            delay-100
          "
        >

          {[
            {
              label: "Total Income",
              value: metrics?.income,
              color: "#34D399",
              icon: "📈",
            },
            {
              label: "Total Expenses",
              value: metrics?.expenses,
              color: "#FF6B6B",
              icon: "📉",
            },
            {
              label: "Total Savings",
              value: metrics?.savings,
              color: "#C8F135",
              icon: "💰",
            },
            {
              label: "Savings Rate",
              value: `${metrics?.savingsRate?.toFixed(1)}%`,
              color: "#00D4FF",
              icon: "📊",
              noFormat: true,
            },
          ].map(
            (card, idx) => (

              <div
                key={idx}
                className="
                  bg-[#111111]
                  border
                  border-white/[0.08]
                  rounded-2xl
                  p-5
                  hover:border-white/[0.12]
                  transition-all
                "
                style={{
                  backgroundColor: "#111111",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >

                <div className="
                  flex
                  items-center
                  justify-between
                  mb-3
                ">

                  <p className="
                    text-[#888]
                    text-sm
                  "
                  style={{
                    color: "#888888",
                  }}>
                    {card.label}
                  </p>

                  <span className="text-2xl">
                    {card.icon}
                  </span>

                </div>

                <p
                  className="
                    text-2xl
                    font-black
                  "
                  style={{
                    color: card.color,
                  }}
                >
                  {card.noFormat
                    ? card.value
                    : formatINR(
                        card.value
                      )}
                </p>

              </div>
            )
          )}

        </div>

        {/* ─────────────────────────────
            CATEGORY BREAKDOWN
        ───────────────────────────── */}
        <div
          className="
            bg-[#111111]
            border
            border-white/[0.08]
            rounded-3xl
            p-8
            animate-in fade-in slide-in-from-bottom-4 duration-500
            delay-200
          "
          style={{
            backgroundColor: "#111111",
            borderColor: "rgba(255, 255, 255, 0.08)",
          }}
        >

          <h3
            className="
              text-3xl
              font-black
              mb-6
            "
            style={{
              fontFamily:
                "'Syne', sans-serif",
            }}
          >
            📂 Expense Breakdown
          </h3>

          <div className="space-y-4">

            {categories.map(
              (cat, idx) => (

                <div
                  key={idx}
                  className="
                    p-4
                    bg-[#151515]
                    rounded-2xl
                    border
                    border-white/[0.06]
                  "
                  style={{
                    backgroundColor: "#151515",
                    borderColor: "rgba(255, 255, 255, 0.06)",
                  }}
                >

                  <div className="
                    flex
                    items-center
                    justify-between
                    mb-3
                  ">

                    <div>
                      <p className="
                        font-bold
                        text-white
                      ">
                        {cat.name}
                      </p>
                      <p className="
                        text-sm
                        text-[#888]
                      "
                      style={{
                        color: "#888888",
                      }}>
                        {formatINR(cat.amount)}
                      </p>
                    </div>

                    <div className="
                      text-right
                    ">
                      <p className="
                        font-black
                        text-lg
                      "
                      style={{
                        color: "#C8F135",
                      }}>
                        {cat.percentage}%
                      </p>
                    </div>

                  </div>

                  <div className="
                    w-full
                    h-2
                    bg-[#0E0E0E]
                    rounded-full
                    overflow-hidden
                  ">

                    <div
                      className="
                        h-full
                        rounded-full
                        transition-all
                      "
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: "#C8F135",
                      }}
                    />

                  </div>

                </div>
              )
            )}

          </div>

        </div>

        {/* ─────────────────────────────
            BUDGET STATUS
        ───────────────────────────── */}
        <div
          className="
            bg-[#111111]
            border
            border-white/[0.08]
            rounded-3xl
            p-8
            animate-in fade-in slide-in-from-bottom-4 duration-500
            delay-300
          "
          style={{
            backgroundColor: "#111111",
            borderColor: "rgba(255, 255, 255, 0.08)",
          }}
        >

          <h3
            className="
              text-3xl
              font-black
              mb-6
            "
            style={{
              fontFamily:
                "'Syne', sans-serif",
            }}
          >
            💳 Budget Status
          </h3>

          <div className="
            grid
            md:grid-cols-2
            gap-5
          ">

            {budgets.map(
              (budget, idx) => {

                const statusColor =
                  budget.status ===
                  "over"
                    ? "#FF6B6B"
                    : budget.status ===
                      "caution"
                    ? "#FFB020"
                    : "#34D399"

                return (

                  <div
                    key={idx}
                    className="
                      bg-[#151515]
                      rounded-2xl
                      p-5
                      border
                      border-white/[0.06]
                    "
                    style={{
                      backgroundColor: "#151515",
                      borderColor: "rgba(255, 255, 255, 0.06)",
                    }}
                  >

                    <p className="
                      font-bold
                      text-white
                      mb-4
                    ">
                      {budget.category}
                    </p>

                    <div className="
                      space-y-3
                    ">

                      <div className="
                        flex
                        justify-between
                        text-sm
                      ">

                        <span className="
                          text-[#888]
                        "
                        style={{
                          color: "#888888",
                        }}>
                          Spent
                        </span>

                        <span
                          className="
                            font-bold
                          "
                          style={{
                            color: statusColor,
                          }}
                        >
                          {formatINR(
                            budget.spent
                          )}
                        </span>

                      </div>

                      <div className="
                        flex
                        justify-between
                        text-sm
                      ">

                        <span className="
                          text-[#888]
                        "
                        style={{
                          color: "#888888",
                        }}>
                          Limit
                        </span>

                        <span className="
                          text-white
                        ">
                          {formatINR(
                            budget.limit
                          )}
                        </span>

                      </div>

                      <div className="
                        w-full
                        h-2
                        bg-[#0E0E0E]
                        rounded-full
                        overflow-hidden
                      ">

                        <div
                          className="
                            h-full
                            rounded-full
                          "
                          style={{
                            width: `${Math.min(
                              budget.utilization,
                              100
                            )}%`,
                            backgroundColor:
                              statusColor,
                          }}
                        />

                      </div>

                      <p
                        className="
                          text-sm
                          font-bold
                        "
                        style={{
                          color: statusColor,
                        }}
                      >
                        {budget.utilization}%
                      </p>

                    </div>

                  </div>
                )
              }
            )}

          </div>

        </div>

        {/* ─────────────────────────────
            GOAL PROGRESS
        ───────────────────────────── */}
        <div
          className="
            bg-[#111111]
            border
            border-white/[0.08]
            rounded-3xl
            p-8
            animate-in fade-in slide-in-from-bottom-4 duration-500
            delay-400
          "
          style={{
            backgroundColor: "#111111",
            borderColor: "rgba(255, 255, 255, 0.08)",
          }}
        >

          <h3
            className="
              text-3xl
              font-black
              mb-6
            "
            style={{
              fontFamily:
                "'Syne', sans-serif",
            }}
          >
            🎯 Goal Progress
          </h3>

          <div className="
            grid
            md:grid-cols-2
            gap-5
          ">

            {goals.map(
              (goal, idx) => (

                <div
                  key={idx}
                  className="
                    bg-[#151515]
                    rounded-2xl
                    p-5
                    border
                    border-white/[0.06]
                  "
                  style={{
                    backgroundColor: "#151515",
                    borderColor: "rgba(255, 255, 255, 0.06)",
                  }}
                >

                  <p className="
                    font-bold
                    text-white
                    mb-4
                  ">
                    {goal.name}
                  </p>

                  <div className="
                    space-y-3
                  ">

                    <div className="
                      flex
                      justify-between
                      text-sm
                    ">

                      <span className="
                        text-[#888]
                      "
                      style={{
                        color: "#888888",
                      }}>
                        Current
                      </span>

                      <span
                        className="
                          font-bold
                          text-[#C8F135]
                        "
                      >
                        {formatINR(
                          goal.current
                        )}
                      </span>

                    </div>

                    <div className="
                      flex
                      justify-between
                      text-sm
                    ">

                      <span className="
                        text-[#888]
                      "
                      style={{
                        color: "#888888",
                      }}>
                        Target
                      </span>

                      <span className="
                        text-white
                      ">
                        {formatINR(
                          goal.target
                        )}
                      </span>

                    </div>

                    <div className="
                      w-full
                      h-2
                      bg-[#0E0E0E]
                      rounded-full
                      overflow-hidden
                    ">

                      <div
                        className="
                          h-full
                          rounded-full
                          bg-[#C8F135]
                        "
                        style={{
                          width: `${goal.progress}%`,
                        }}
                      />

                    </div>

                    <p
                      className="
                        text-sm
                        font-bold
                        text-[#C8F135]
                      "
                    >
                      {goal.progress}%
                    </p>

                  </div>

                </div>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  )
}