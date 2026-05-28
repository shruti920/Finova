import { NextResponse }
from "next/server"

import { groq }
from "@/lib/groq"

export async function POST(req) {

  try {

    const body =
      await req.json()

    const text =
      body.text

    if (!text || text.trim().length < 20) {

      return NextResponse.json(
        {
          isReceipt: false,
          message:
            "No valid OCR text provided",
        },
        {
          status: 400,
        }
      )
    }

    /* ─────────────────────────────
       CLEAN OCR TEXT
    ───────────────────────────── */

    const cleanedText =
      text

        /* remove weird symbols */
        .replace(/[^\w\s₹$.,:/\-]/g, " ")

        /* remove repeated spaces */
        .replace(/\s+/g, " ")

        .trim()

    /* ─────────────────────────────
       STRICT AI PROMPT
    ───────────────────────────── */

    const prompt = `
You are a highly accurate financial receipt parser.

You will receive OCR text extracted from an uploaded image.

Your job is to:

1. Detect whether the OCR text belongs to a REAL receipt/invoice/bill.
2. Reject random screenshots, memes, selfies, notes, documents, posters, chats, or unrelated images.
3. Clean OCR corruption and extract only meaningful receipt data.

IMPORTANT RULES:

A REAL RECEIPT usually contains:
- merchant/store name
- prices or currency values
- total amount
- payment details
- multiple purchased items
- bill/invoice/receipt wording

If these are missing, return:
{
  "isReceipt": false
}

If it IS a valid receipt return STRICT JSON ONLY:

{
  "isReceipt": true,
  "merchant": "string",
  "amount": number,
  "category": "Food" | "Shopping" | "Transport" | "Bills" | "Entertainment" | "Health" | "Travel" | "Other",
  "date": "YYYY-MM-DD",
  "note": "short cleaned description"
}

RULES:
- amount MUST be the FINAL TOTAL amount paid
- amount must be a valid number only
- merchant should be cleaned and readable
- note should be short
- NEVER include markdown
- NEVER explain anything
- ONLY return JSON

OCR TEXT:
${cleanedText}
`

    /* ─────────────────────────────
       GROQ REQUEST
    ───────────────────────────── */

    const completion =
      await groq.chat.completions.create({

        model:
          "llama-3.3-70b-versatile",

        messages: [

  {
    role: "system",
    content: prompt,
  },

  {
    role: "user",
    content: `
OCR RECEIPT TEXT:

${text}
    `,
  },
],

        temperature: 0.1,

        response_format: {
          type: "json_object",
        },
      })

    const raw =
      completion.choices?.[0]
        ?.message?.content || "{}"

    let parsed

    try {

      parsed =
        JSON.parse(raw)

    } catch {

      return NextResponse.json(
        {
          isReceipt: false,
          message:
            "AI failed to parse receipt",
        },
        {
          status: 400,
        }
      )
    }

    /* ─────────────────────────────
       VALIDATION LAYER
    ───────────────────────────── */

    if (!parsed.isReceipt) {

      return NextResponse.json({
        isReceipt: false,
      })
    }

    /* amount validation */
    const amount =
      Number(parsed.amount)

    if (
      !amount ||
      isNaN(amount) ||
      amount <= 0
    ) {

      return NextResponse.json({
        isReceipt: false,
      })
    }

    /* safe fallback values */
    parsed.merchant =
      parsed.merchant ||
      "Unknown Merchant"

    parsed.category =
      parsed.category ||
      "Other"

    parsed.note =
      parsed.note ||
      `Payment at ${parsed.merchant}`

    parsed.date =
      parsed.date ||
      new Date()
        .toISOString()
        .split("T")[0]

    parsed.amount =
      amount

    return NextResponse.json(
      parsed
    )

  } catch (error) {

    console.log(
      "[RECEIPT SCAN ERROR]",
      error
    )

    return NextResponse.json(
      {
        isReceipt: false,
        message:
          "Failed to scan receipt",
      },
      {
        status: 500,
      }
    )
  }
}