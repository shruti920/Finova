
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { groq } from "@/lib/groq"

import { getServerSession } from "next-auth"

import { authOptions }
from "@/app/api/auth/[...nextauth]/route"

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */

function calcMonthlyTrend(transactions) {

  const trend = {}

  transactions.forEach((t) => {

    const year =
      new Date(t.createdAt).getFullYear()

    const month =
      String(
        new Date(t.createdAt).getMonth() + 1
      ).padStart(2, "0")

    const key =
      `${year}-${month}`

    if (!trend[key]) {

      trend[key] = {
        income: 0,
        expenses: 0,
      }
    }

    if (t.type === "income") {

      trend[key].income +=
        Number(t.amount)

    } else {

      trend[key].expenses +=
        Number(t.amount)
    }

  })

  return trend
}

function calcBudgetUtilization(
  budgets,
  categorySpend
) {

  return budgets.map((b) => {

    const spent =
      categorySpend[
        b.category
      ] || 0

    const limit =
      Number(b.limit)

    const pct =
      limit > 0
        ? Math.round(
            (spent / limit) * 100
          )
        : 0

    return {
      category:
        b.category,
      limit,
      spent,
      utilizationPct:
        pct,
    }
  })
}

function calcGoalProgress(
  goals
) {

  return goals.map((g) => {

    const target =
      Number(
        g.targetAmount
      )

    const current =
      Number(
        g.savedAmount
      )

    const pct =
      target > 0
        ? Math.round(
            (current / target) * 100
          )
        : 0

    const daysLeft =
      g.deadline
        ? Math.ceil(
            (
              new Date(
                g.deadline
              ).getTime() -
              Date.now()
            ) / 86400000
          )
        : null

    return {
      name:
        g.title,
      target,
      current,
      progressPct:
        pct,
      daysLeft,
    }
  })
}

/* ─────────────────────────────────────────
   ROUTE
───────────────────────────────────────── */

export async function GET() {

  try {

    /* ── auth ── */

    const session =
      await getServerSession(
        authOptions
      )

    if (
      !session?.user?.id
    ) {

      return NextResponse.json(
        {
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      )
    }

    const userId =
      session.user.id

    /* ─────────────────────────────
       FETCH DATA
    ───────────────────────────── */

    const [
      transactions,
      budgets,
      goals,
    ] = await Promise.all([

      prisma.transaction.findMany({

        where: {
          userId,
        },

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.budget.findMany({

        where: {
          userId,
        },
      }),

      prisma.goal.findMany({

        where: {
          userId,
        },
      }),
    ])

    /* ─────────────────────────────
       CALCULATIONS
    ───────────────────────────── */

    const income =
      transactions
        .filter(
          (t) =>
            t.type ===
            "income"
        )
        .reduce(
          (sum, t) =>
            sum +
            Number(
              t.amount
            ),
          0
        )

    const expenses =
      transactions
        .filter(
          (t) =>
            t.type ===
            "expense"
        )
        .reduce(
          (sum, t) =>
            sum +
            Number(
              t.amount
            ),
          0
        )

    const netSavings =
      income - expenses

    const savingsRate =
      income > 0
        ? (
            (netSavings /
              income) *
            100
          ).toFixed(1)
        : "0"

    /* ─────────────────────────────
       CATEGORY SPEND
    ───────────────────────────── */

    const categorySpend =
      {}

    transactions.forEach(
      (t) => {

        if (
          t.type !==
          "expense"
        )
          return

        const cat =
          t.category ||
          "Other"

        categorySpend[
          cat
        ] =
          (
            categorySpend[
              cat
            ] || 0
          ) +
          Number(
            t.amount
          )
      }
    )

    const topSpendingCategories =
      Object.entries(
        categorySpend
      )
        .sort(
          (a, b) =>
            b[1] - a[1]
        )
        .slice(0, 6)
        .map(
          ([cat, amt]) => ({
            category:
              cat,
            amount: amt,
          })
        )

    const monthlyTrend =
      calcMonthlyTrend(
        transactions
      )

    const budgetUtilization =
      calcBudgetUtilization(
        budgets,
        categorySpend
      )

    const goalProgress =
      calcGoalProgress(
        goals
      )

    const overBudgetCategories =
      budgetUtilization.filter(
        (b) =>
          b.utilizationPct >
          100
      )

    const nearLimitCategories =
      budgetUtilization.filter(
        (b) =>
          b.utilizationPct >=
            80 &&
          b.utilizationPct <=
            100
      )

    /* ─────────────────────────────
       AI PROMPT
    ───────────────────────────── */

    const systemPrompt = `
You are a senior personal finance advisor.

You specialize in:
- budgeting
- goal planning
- savings optimization
- behavioral finance

Always give:
- specific
- actionable
- data-driven
advice.

Return ONLY valid JSON.
`

    const userPrompt = `
Analyze this user's finances.

Return JSON in this format:

{
  "healthScore": number,
  "healthSummary": string,
  "risks": [
    {
      "title": string,
      "detail": string
    }
  ],
  "savingsOpportunities": [
    {
      "title": string,
      "potentialSaving": string,
      "action": string
    }
  ],
  "budgetAdvice": [
    {
      "category": string,
      "status": string,
      "advice": string
    }
  ],
  "goalForecasts": [
    {
      "goalName": string,
      "onTrack": boolean,
      "forecast": string
    }
  ],
  "topInsight": string
}

FINANCIAL DATA:

Income:
₹${income}

Expenses:
₹${expenses}

Net Savings:
₹${netSavings}

Savings Rate:
${savingsRate}%

Top Spending Categories:
${JSON.stringify(
  topSpendingCategories,
  null,
  2
)}

Budget Utilization:
${JSON.stringify(
  budgetUtilization,
  null,
  2
)}

Goal Progress:
${JSON.stringify(
  goalProgress,
  null,
  2
)}

Monthly Trends:
${JSON.stringify(
  Object.entries(
    monthlyTrend
  )
    .sort(
      (a, b) =>
        a[0].localeCompare(
          b[0]
        )
    )
    .slice(-6),
  null,
  2
)}

Over Budget Categories:
${overBudgetCategories
  .map(
    (b) =>
      b.category
  )
  .join(", ")}

Near Limit Categories:
${nearLimitCategories
  .map(
    (b) =>
      b.category
  )
  .join(", ")}
`

    /* ─────────────────────────────
       OPENAI
    ───────────────────────────── */

    const completion =
  await groq.chat.completions.create({

    model:
      "llama-3.3-70b-versatile",

    messages: [

      {
        role: "system",
        content: systemPrompt,
      },

      {
        role: "user",
        content: userPrompt,
      },
    ],

    temperature: 0.3,

    response_format: {
      type: "json_object",
    },
  })

const raw =
  completion.choices[0]
    .message.content || "{}"

    let aiResponse
try {

  aiResponse =
    JSON.parse(raw)

} catch {

  aiResponse = {
    healthScore: 72,
    healthSummary:
      "Your finances are stable but there is room to improve savings consistency.",

    risks: [],

    savingsOpportunities: [],

    budgetAdvice: [],

    goalForecasts: [],

    topInsight:
      "Reduce discretionary spending to improve monthly savings.",
  }
}

    /* ─────────────────────────────
       RESPONSE
    ───────────────────────────── */

    return NextResponse.json({

      insights:
        aiResponse,

      meta: {

        generatedAt:
          new Date().toISOString(),

        transactionCount:
          transactions.length,

        budgetCount:
          budgets.length,

        goalCount:
          goals.length,
      },
    })

  } catch (error) {

    console.log(
      "[AI INSIGHTS ERROR]",
      error
    )

    return NextResponse.json(
      {
        message:
          "Failed to generate AI insights",
      },
      {
        status: 500,
      }
    )
  }
}