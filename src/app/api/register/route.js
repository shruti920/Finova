import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req) {
  try {
    const body = await req.json()

    const { name, email, password } = body

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return Response.json({
        message: "User already exists",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return Response.json({
      message: "User created successfully",
    })
  } catch (error) {
    console.log(error)

    return Response.json({
      message: "Something went wrong",
    })
  }
}