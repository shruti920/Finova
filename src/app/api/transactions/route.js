import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

/* ─────────────────────────────────────────────
   CREATE TRANSACTION
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

    const {
      amount,
      type,
      category,
      note,
    } = body

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

    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        type,
        category,
        note,
        userId: user.id,
      },
    })

    return Response.json(transaction)

  } catch (error) {
    console.log(error)

    return Response.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

/* ─────────────────────────────────────────────
   GET USER TRANSACTIONS
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

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
      },

      orderBy: {
        createdAt: "desc",
      },
    })

    return Response.json(transactions)

  } catch (error) {
    console.log(error)

    return Response.json([])
  }
}

/* ─────────────────────────────────────────────
   DELETE TRANSACTION
───────────────────────────────────────────── */
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)

    const id = searchParams.get("id")

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    await prisma.transaction.delete({
      where: {
        id,
        userId: user.id,
      },
    })

    return Response.json({
      message: "Transaction deleted",
    })

  } catch (error) {
    console.log(error)

    return Response.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

/* ─────────────────────────────────────────────
   UPDATE TRANSACTION
───────────────────────────────────────────── */
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

    const {
      id,
      amount,
      type,
      category,
      note,
    } = body

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    const updatedTransaction =
      await prisma.transaction.update({
        where: {
          id,
          userId: user.id,
        },

        data: {
          amount: parseFloat(amount),
          type,
          category,
          note,
        },
      })

    return Response.json(updatedTransaction)

  } catch (error) {
    console.log(error)

    return Response.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}