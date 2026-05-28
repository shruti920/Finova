"use client"

const formatINR = (n) =>
  `₹${Number(n).toLocaleString("en-IN")}`

const formatCompact = (n) =>
  n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : n >= 1000
    ? `₹${(n / 1000).toFixed(0)}K`
    : `₹${n}`

export default function GoalsList({
  goals = [],
}) {

  if (goals.length === 0) {

    return (

      <div
        className="
          bg-[#111111]
          border border-white/[0.07]
          rounded-3xl
          p-10
          text-center
        "
      >

        <p className="text-5xl mb-4">
          🎯
        </p>

        <h2
          className="
            text-white
            text-2xl
            font-black
            mb-2
          "
          style={{
            fontFamily:
              "'Syne', sans-serif",
          }}
        >
          No goals yet
        </h2>

        <p className="text-[#666] font-mono text-sm">
          Create your first savings goal.
        </p>

      </div>
    )
  }

  return (

    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

      {goals.map((goal) => {

        const saved =
          Number(goal.savedAmount)

        const target =
          Number(goal.targetAmount)

        const pct =
          Math.min(
            (saved / target) * 100,
            100
          )

        const remaining =
          target - saved

        const completed =
          pct >= 100

        /* ─────────────────────────────
           DEADLINE CALCULATIONS
        ───────────────────────────── */

        const hasDeadline =
          !!goal.deadline

        let daysLeft = null
        let monthsLeft = null
        let monthlyNeeded = null
        let status = "Healthy"
        let statusColor = "#00D4FF"

        if (hasDeadline) {

          const today =
            new Date()

          const deadline =
            new Date(goal.deadline)

          const diff =
            deadline - today

          daysLeft =
            Math.ceil(
              diff / (1000 * 60 * 60 * 24)
            )

          monthsLeft =
            Math.max(
              daysLeft / 30,
              1
            )

          monthlyNeeded =
            remaining / monthsLeft

          if (daysLeft < 30) {

            status = "Urgent"
            statusColor = "#FF4D4D"

          } else if (pct >= 70) {

            status = "On Track"
            statusColor = "#C8F135"

          } else {

            status = "Behind"
            statusColor = "#FF6B35"
          }
        }

        return (

          <div
            key={goal.id}
            className="
              bg-[#111111]
              border border-white/[0.07]
              rounded-3xl
              p-5
              relative
              overflow-hidden
              hover:border-white/[0.12]
              transition-all duration-300
            "
          >

            {/* glow */}
            <div
              className="
                absolute
                -bottom-10
                -right-10
                w-32 h-32
                rounded-full
                blur-3xl
                opacity-10
              "
              style={{
                background:
                  completed
                    ? "#C8F135"
                    : "#00D4FF",
              }}
            />

            {/* top */}
            <div className="flex items-start justify-between mb-5">

              <div>

                <p className="
                  text-[#555]
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.12em]
                  mb-1
                ">
                  smart savings goal
                </p>

                <h2
                  className="
                    text-white
                    text-2xl
                    font-black
                  "
                  style={{
                    fontFamily:
                      "'Syne', sans-serif",
                  }}
                >
                  {goal.title}
                </h2>

              </div>

              <div
                className="
                  w-14 h-14
                  rounded-2xl
                  flex items-center
                  justify-center
                  text-2xl
                "
                style={{
                  background:
                    completed
                      ? "#C8F13520"
                      : "#00D4FF20",
                }}
              >
                {completed ? "🏆" : "🎯"}
              </div>

            </div>

            {/* amount */}
            <div className="mb-4">

              <div className="
                flex items-end
                justify-between
                mb-2
              ">

                <div>

                  <p className="
                    text-[#666]
                    font-mono
                    text-[11px]
                  ">
                    saved
                  </p>

                  <h3
                    className="
                      text-3xl
                      font-black
                    "
                    style={{
                      fontFamily:
                        "'Syne', sans-serif",
                      color:
                        completed
                          ? "#C8F135"
                          : "#00D4FF",
                    }}
                  >
                    {formatCompact(saved)}
                  </h3>

                </div>

                <div className="text-right">

                  <p className="
                    text-[#666]
                    font-mono
                    text-[11px]
                  ">
                    target
                  </p>

                  <p className="
                    text-white
                    font-black
                    text-lg
                  ">
                    {formatCompact(target)}
                  </p>

                </div>

              </div>

              {/* progress */}
              <div className="
                h-3
                bg-[#1A1A1A]
                rounded-full
                overflow-hidden
              ">

                <div
                  className="
                    h-full
                    rounded-full
                    transition-all
                    duration-700
                  "
                  style={{
                    width: `${pct}%`,
                    background:
                      completed
                        ? "#C8F135"
                        : "#00D4FF",
                  }}
                />

              </div>

            </div>

            {/* intelligence stats */}
            <div className="grid grid-cols-2 gap-3 mb-5">

              <div className="
                bg-[#161616]
                rounded-2xl
                p-3
              ">
                <p className="
                  text-[#555]
                  font-mono
                  text-[10px]
                  uppercase
                  mb-1
                ">
                  Remaining
                </p>

                <p className="
                  text-white
                  font-black
                  text-lg
                ">
                  {formatCompact(remaining)}
                </p>
              </div>

              <div className="
                bg-[#161616]
                rounded-2xl
                p-3
              ">
                <p className="
                  text-[#555]
                  font-mono
                  text-[10px]
                  uppercase
                  mb-1
                ">
                  Progress
                </p>

                <p
                  className="
                    font-black
                    text-lg
                  "
                  style={{
                    color:
                      completed
                        ? "#C8F135"
                        : "#00D4FF",
                  }}
                >
                  {Math.round(pct)}%
                </p>
              </div>

            </div>

            {/* AI insights */}
            {hasDeadline && (

              <div className="
                bg-[#161616]
                border border-white/[0.05]
                rounded-2xl
                p-4
                mb-4
              ">

                <div className="
                  flex items-center
                  justify-between
                  mb-3
                ">

                  <div
                    className="
                      px-2 py-1
                      rounded-full
                      text-[10px]
                      font-mono
                    "
                    style={{
                      background:
                        `${statusColor}20`,
                      color:
                        statusColor,
                    }}
                  >
                    {status}
                  </div>

                </div>

                <div className="space-y-2">

                  <p className="
                    text-[#AAA]
                    text-sm
                    leading-relaxed
                  ">
                    Save around{" "}
                    <span className="text-white font-bold">
                      {formatINR(
                        Math.round(monthlyNeeded)
                      )}
                    </span>{" "}
                    per month to complete this goal on time.
                  </p>

                  <p className="
                    text-[#666]
                    font-mono
                    text-[11px]
                  ">
                    {daysLeft} days remaining
                  </p>

                </div>

              </div>

            )}

            {/* footer */}
            {goal.deadline && (

              <div className="
                pt-4
                border-t border-white/[0.06]
                flex items-center
                justify-between
              ">

                <div>

                  <p className="
                    text-[#666]
                    font-mono
                    text-[10px]
                    uppercase
                  ">
                    Deadline
                  </p>

                  <p className="
                    text-white
                    font-bold
                    mt-1
                  ">
                    {goal.deadline}
                  </p>

                </div>

                {completed && (

                  <div className="
                    px-3 py-1.5
                    rounded-full
                    bg-[#C8F135]/15
                    text-[#C8F135]
                    text-[11px]
                    font-mono
                  ">
                    Completed
                  </div>

                )}

              </div>

            )}

          </div>
        )
      })}

    </div>
  )
}