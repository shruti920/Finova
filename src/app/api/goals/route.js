import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

/* ─────────────────────────────────────────────
   GET GOALS
───────────────────────────────────────────── */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const goals = await prisma.goal.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.log("FULL GOAL ERROR:")
    console.log(error)
    return NextResponse.json(
      {
        message: "Failed to fetch goals",
        error: String(error),
      },
      { status: 500 }
    )
  }
}

/* ─────────────────────────────────────────────
   CREATE GOAL
───────────────────────────────────────────── */
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

    if (!body.title || !body.targetAmount) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    const goal = await prisma.goal.create({
      data: {
        title: body.title,
        targetAmount: Number(body.targetAmount),
        savedAmount: Number(body.savedAmount || 0),
        deadline: body.deadline || null,
        userId: session.user?.id,
      },
    })

    return NextResponse.json(goal)
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Failed to create goal" },
      { status: 500 }
    )
  }
}