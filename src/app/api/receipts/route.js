import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

import { getServerSession }
from "next-auth"

import { authOptions }
from "../auth/[...nextauth]/route"

/* ─────────────────────────────
   GET RECEIPTS
───────────────────────────── */

export async function GET() {

  try {

    const session =
      await getServerSession(
        authOptions
      )

    if (!session?.user?.id) {

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

    const receipts =
      await prisma.receipt.findMany({

        where: {
          userId:
            session.user.id,
        },

        orderBy: {
          createdAt: "desc",
        },
      })

    return NextResponse.json(
      receipts
    )

  } catch (error) {

    console.log(error)

    return NextResponse.json(
      {
        message:
          "Failed to fetch receipts",
      },
      {
        status: 500,
      }
    )
  }
}

/* ─────────────────────────────
   SAVE RECEIPT
───────────────────────────── */

export async function POST(req) {

  try {

    const session =
      await getServerSession(
        authOptions
      )

    if (!session?.user?.id) {

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

    const body =
      await req.json()

    const receipt =
      await prisma.receipt.create({

        data: {

          imageUrl:
            body.imageUrl || "",

          merchant:
            body.merchant || "Unknown",

          amount:
            Number(body.amount || 0),

          category:
            body.category || "Other",

          note:
            body.note || "",

          userId:
            session.user.id,
        },
      })

    return NextResponse.json(
      receipt
    )

  } catch (error) {

    console.log(error)

    return NextResponse.json(
      {
        message:
          "Failed to save receipt",
      },
      {
        status: 500,
      }
    )
  }
}