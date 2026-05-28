"use client"

import { useState }
from "react"

import Tesseract
from "tesseract.js"

import { toast } from "react-hot-toast"

export default function ReceiptScanner({
  onScanComplete,
}) {

  const [image, setImage] =
    useState(null)

  const [preview, setPreview] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const [progress, setProgress] =
    useState(0)

  const [ocrText, setOcrText] =
    useState("")

  /* ─────────────────────────────
     HANDLE IMAGE
  ───────────────────────────── */

     const handleImage =
  (e) => {

    const file =
      e.target.files?.[0]

    if (!file) return

    /* validate extension */
    const validExtensions = [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ]

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase()

    if (
      !validExtensions.includes(
        extension
      )
    ) {

      toast.error(
        "Upload JPG, PNG or WEBP"
      )

      return
    }

    /* size limit */
    if (
      file.size >
      5 * 1024 * 1024
    ) {

      toast.error(
        "Image must be under 5MB"
      )

      return
    }

    setImage(file)

    setPreview(
      URL.createObjectURL(file)
    )
  }

  /* ─────────────────────────────
     SCAN RECEIPT
  ───────────────────────────── */

  const scanReceipt =
    async () => {

      if (!image) return

      try {

        setLoading(true)

        /* OCR */
        const result =
          await Tesseract.recognize(
            image,
            "eng",
            {
              logger: (m) => {

                if (
                  m.status ===
                  "recognizing text"
                ) {

                  setProgress(
                    Math.floor(
                      m.progress * 100
                    )
                  )
                }
              },
            }
          )

        const extractedText =
  result.data.text
    .replace(/[^\x20-\x7E\n]/g, "")
    .replace(/\s+/g, " ")
    .trim()

        setOcrText(
          extractedText
        )

        /* AI Parsing */
        const res =
          await fetch(
            "/api/scan-receipt",
            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                text:
                  extractedText,
              }),
            }
          )

        const data =
          await res.json()
        

        if (!data.isReceipt) {
            toast.error(
              "The uploaded image does not seem to be a valid receipt. Please try again with a clearer image."      
  )

  return
}

         if (
  onScanComplete
) {

  onScanComplete({

    amount:
      data.amount || "",

    category:
      data.category || "Other",

    date:
      data.date || "",

    note:
      `${data.merchant || ""} ${
        data.note || ""
      }`,
  })
}

/* ─────────────────────────────
   SAVE RECEIPT
───────────────────────────── */

await fetch(
  "/api/receipts",
  {

    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({

      imageUrl:
        preview,

      merchant:
        data.merchant,

      amount:
        data.amount,

      category:
        data.category,

      note:
        data.note,
    }),
  }
)

      } catch (error) {

        console.log(error)

      } finally {

        setLoading(false)
        setProgress(0)
      }
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
          AI receipt scanner
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
          Scan Receipt
        </h2>

      </div>

      {/* upload area */}
      <label
        className="
          border-2
          border-dashed
          border-white/[0.08]
          rounded-3xl
          p-10
          flex
          flex-col
          items-center
          justify-center
          cursor-pointer
          hover:border-[#C8F135]
          transition-all
          text-center
          min-h-[280px]
        "
      >

        {preview ? (

          <img
            src={preview}
            alt="receipt"
            className="
              max-h-[220px]
              rounded-2xl
              object-contain
            "
          />

        ) : (

          <>

            <div className="
              text-6xl
              mb-4
            ">
              🧾
            </div>

            <p className="
              text-white
              font-bold
              text-lg
              mb-2
            ">
              Upload receipt
            </p>

            <p className="
              text-[#666]
              text-sm
            ">
              JPG, PNG or WEBP
            </p>

          </>

        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="hidden"
        />

      </label>

      {/* scan button */}
      <button
        onClick={scanReceipt}
        disabled={
          !image || loading
        }
        className="
          mt-5
          w-full
          bg-[#C8F135]
          text-black
          py-4
          rounded-2xl
          font-black
          hover:scale-[1.01]
          transition-all
          disabled:opacity-40
        "
        style={{
          fontFamily:
            "'Syne', sans-serif",
        }}
      >

        {loading
          ? `Scanning ${progress}%`
          : "Scan with AI"}

      </button>

      {/* OCR preview */}
      {ocrText && (

        <div
          className="
            mt-6
            bg-black/40
            rounded-2xl
            p-4
            border border-white/[0.06]
          "
        >

          <p className="
            text-[#C8F135]
            font-mono
            text-[10px]
            uppercase
            mb-3
          ">
            Extracted text
          </p>

          <pre
            className="
              text-[#AAA]
              text-xs
              whitespace-pre-wrap
              overflow-auto
              max-h-[200px]
            "
          >
            {ocrText}
          </pre>

        </div>

      )}

    </div>
  )
}