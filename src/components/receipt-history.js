"use client"

import { useEffect, useState }
from "react"

export default function ReceiptHistory() {

  const [receipts, setReceipts] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  /* ─────────────────────────────
     FETCH RECEIPTS
  ───────────────────────────── */

  useEffect(() => {

    fetchReceipts()

  }, [])

  const fetchReceipts =
    async () => {

      try {

        const res =
          await fetch(
            "/api/receipts"
          )

         const data =
  await res.json()

console.log(data)

setReceipts(
  data.receipts ||
  data ||
  []
)

      } catch (error) {

        console.log(error)

      } finally {

        setLoading(false)
      }
    }

  /* ─────────────────────────────
     EMPTY
  ───────────────────────────── */

  if (
    !loading &&
    receipts.length === 0
  ) {

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
          🧾
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
          No receipts yet
        </h2>

        <p className="text-[#666]">
          Scan your first receipt.
        </p>

      </div>
    )
  }

  return (

    <div
      className="
        bg-[#111111]
        border border-white/[0.07]
        rounded-3xl
        p-6
      "
    >

      {/* heading */}
      <div className="mb-6">

        <p className="
          text-[#C8F135]
          font-mono
          text-[10px]
          uppercase
          tracking-[0.14em]
          mb-2
        ">
          AI memory
        </p>

        <h2
          className="
            text-3xl
            font-black
            text-white
          "
          style={{
            fontFamily:
              "'Syne', sans-serif",
          }}
        >
          Receipt History
        </h2>

      </div>

      {/* list */}
      <div className="space-y-4">

        {receipts.map((receipt) => (

          <div
            key={receipt.id}
            className="
              flex
              items-center
              gap-4
              bg-black/30
              border border-white/[0.05]
              rounded-2xl
              p-4
            "
          >

            {/* image */}
            <div
              className="
                w-20 h-20
                rounded-2xl
                overflow-hidden
                bg-[#1A1A1A]
                flex
                items-center
                justify-center
                shrink-0
              "
            >

              {receipt.imageUrl ? (

                <img
                  src={receipt.imageUrl}
                  alt="receipt"
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              ) : (

                <span className="text-3xl">
                  🧾
                </span>

              )}

            </div>

            {/* info */}
            <div className="flex-1">

              <h3
                className="
                  text-white
                  font-black
                  text-lg
                "
                style={{
                  fontFamily:
                    "'Syne', sans-serif",
                }}
              >
                {receipt.merchant}
              </h3>

              <p className="
                text-[#666]
                text-sm
                mt-1
              ">
                {receipt.note}
              </p>

              <div className="
                flex
                items-center
                gap-2
                mt-3
              ">

                <span
                  className="
                    px-3 py-1
                    rounded-full
                    bg-[#C8F135]/10
                    text-[#C8F135]
                    text-xs
                    font-bold
                  "
                >
                  {receipt.category}
                </span>

                <span className="
                  text-[#555]
                  text-xs
                ">
                  {new Date(
                    receipt.createdAt
                  ).toLocaleDateString()}
                </span>

              </div>

            </div>

            {/* amount */}
            <div>

              <p
                className="
                  text-2xl
                  font-black
                  text-[#00D4FF]
                "
                style={{
                  fontFamily:
                    "'Syne', sans-serif",
                }}
              >
                ₹{Number(
                  receipt.amount
                ).toLocaleString("en-IN")}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}