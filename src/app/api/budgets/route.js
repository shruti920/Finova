import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

/* ─────────────────────────────────────────────
   GET USER BUDGETS
───────────────────────────────────────────── */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return Response.json([])
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    if (!user) {
      return Response.json([])
    }

    const budgets = await prisma.budget.findMany({
      where: {
        userId: user.id,
      },

      orderBy: {
        createdAt: "desc",
      },
    })

    return Response.json(budgets)

  } catch (error) {
    console.log(error)

    return Response.json([])
  }
}

/* ─────────────────────────────────────────────
   CREATE / UPDATE BUDGET
───────────────────────────────────────────── */
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

    /* ── Validation ── */
    if (!body.category || !body.limit) {
      return Response.json(
        { message: "Missing fields" },
        { status: 400 }
      )
    }

    if (Number(body.limit) <= 0) {
      return Response.json(
        { message: "Limit must be greater than 0" },
        { status: 400 }
      )
    }

    /* ── Find user ── */
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    /* ── Check existing budget ── */
    const existingBudget = await prisma.budget.findFirst({
      where: {
        userId: user.id,
        category: body.category,
      },
    })

    let budget

    /* ── Update existing budget ── */
    if (existingBudget) {

      budget = await prisma.budget.update({
        where: {
          id: existingBudget.id,
        },

        data: {
          limit: Number(body.limit),
        },
      })

    } else {

      /* ── Create new budget ── */
      budget = await prisma.budget.create({
        data: {
          category: body.category,
          limit: Number(body.limit),
          userId: user.id,
        },
      })

    }

    return Response.json(budget)

  } catch (error) {
    console.log(error)

    return Response.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}