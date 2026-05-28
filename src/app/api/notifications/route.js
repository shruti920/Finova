import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

/* ─────────────────────────────────────────────
   GET NOTIFICATIONS
───────────────────────────────────────────── */
export async function GET() {

  try {

    const session =
      await getServerSession(authOptions)

    if (!session?.user?.id) {

      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      )
    }

    const notifications =
      await prisma.notification.findMany({

        where: {
          userId: session.user.id,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 20,
      })

    return NextResponse.json(
      notifications
    )

  } catch (error) {

    console.log(error)

    return NextResponse.json(
      {
        message:
          "Failed to fetch notifications",
      },
      {
        status: 500,
      }
    )
  }
}

/* ─────────────────────────────────────────────
   CREATE NOTIFICATION
───────────────────────────────────────────── */
export async function POST(req) {

  try {

    const session =
      await getServerSession(authOptions)

    if (!session?.user?.id) {

      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      )
    }

    const body =
      await req.json()

    if (!body.title) {

      return NextResponse.json(
        {
          message: "Title required",
        },
        {
          status: 400,
        }
      )
    }

    const notification =
      await prisma.notification.create({

        data: {

          title: body.title,

          message:
            body.message || "",

          type:
            body.type || "info",

          read:
            false,

          userId:
            session.user.id,
        },
      })

    return NextResponse.json(
      notification
    )

  } catch (error) {

    console.log(error)

    return NextResponse.json(
      {
        message:
          "Failed to create notification",
      },
      {
        status: 500,
      }
    )
  }
}