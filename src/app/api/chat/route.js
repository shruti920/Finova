import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { groq } from "@/lib/groq"

import { getServerSession }
from "next-auth"

import { authOptions }
from "../auth/[...nextauth]/route"

export async function POST(req) {

  try {

    /* ─────────────────────────────
       AUTH
    ───────────────────────────── */

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
       BODY
    ───────────────────────────── */

    const body =
      await req.json()

    const message =
      body.message

    if (!message) {

      return NextResponse.json(
        {
          message:
            "Message required",
        },
        {
          status: 400,
        }
      )
    }

    /* ─────────────────────────────
       FETCH USER DATA
    ───────────────────────────── */

    const [
      transactions,
      budgets,
      goals,
    ] = await Promise.all([

      prisma.transaction.findMany({
        where: { userId },
      }),

      prisma.budget.findMany({
        where: { userId },
      }),

      prisma.goal.findMany({
        where: { userId },
      }),
    ])

    /* ─────────────────────────────
       FINANCIAL SUMMARY
    ───────────────────────────── */

    const income =
      transactions
        .filter(
          (t) =>
            t.type === "income"
        )
        .reduce(
          (sum, t) =>
            sum + Number(t.amount),
          0
        )

    const expenses =
      transactions
        .filter(
          (t) =>
            t.type === "expense"
        )
        .reduce(
          (sum, t) =>
            sum + Number(t.amount),
          0
        )

    const savings =
      income - expenses

    /* ─────────────────────────────
       AI PROMPT
    ───────────────────────────── */

    const systemPrompt = `

You are Finova AI,
an elite AI financial copilot.

You help users:
- understand spending
- improve savings
- analyze budgets
- reach goals
- make smarter money decisions

Be concise.
Be intelligent.
Be practical.

Always answer using the user's REAL financial data.

`

    const userContext = `

USER FINANCIAL DATA

Income:
₹${income.toLocaleString("en-IN")}

Expenses:
₹${expenses.toLocaleString("en-IN")}

Savings:
₹${savings.toLocaleString("en-IN")}

Budgets:
${JSON.stringify(budgets)}

Goals:
${JSON.stringify(goals)}

Recent Transactions:
${JSON.stringify(
  transactions.slice(0, 15)
)}

USER QUESTION:
${message}

`

    /* ─────────────────────────────
       GROQ AI
    ───────────────────────────── */

    const completion =
      await groq.chat.completions.create({

        model:
          "llama-3.3-70b-versatile",

        messages: [

          {
            role: "system",
            content:
              systemPrompt,
          },

          {
            role: "user",
            content:
              userContext,
          },
        ],

        temperature: 0.4,
      })

    const reply =
      completion.choices[0]
        .message.content

    /* ─────────────────────────────
       RESPONSE
    ───────────────────────────── */

    return NextResponse.json({

      reply,

    })

  } catch (error) {

    console.log(error)

    return NextResponse.json(
      {
        message:
          "Failed to generate response",
      },
      {
        status: 500,
      }
    )
  }
}