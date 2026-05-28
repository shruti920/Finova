"use client"

import {
  useEffect,
  useRef,
  useState,
} from "react"

export default function AIChat() {

  const [open, setOpen] =
    useState(false)

  const [message, setMessage] =
    useState("")

  const [messages, setMessages] =
    useState([
      {
        role: "assistant",
        content:
          "Hey 👋 I'm Finova AI. Ask me anything about your finances.",
      },
    ])

  const [loading, setLoading] =
    useState(false)

  const [listening, setListening] =
    useState(false)

  const [voiceEnabled, setVoiceEnabled] =
    useState(false)

  const recognitionRef =
    useRef(null)

  const speechSynthesisRef =
    useRef(null)

  /* ─────────────────────────────
     STOP VOICE ON CLOSE
  ───────────────────────────── */

  useEffect(() => {

    if (!open) {

      speechSynthesis.cancel()

      if (recognitionRef.current) {

        recognitionRef.current.stop()
      }
    }

  }, [open])

  /* ─────────────────────────────
     SPEECH RECOGNITION
  ───────────────────────────── */

  useEffect(() => {

    if (
      typeof window === "undefined"
    ) return

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition

    if (!SpeechRecognition)
      return

    const recognition =
      new SpeechRecognition()

    recognition.lang = "en-US"

    recognition.continuous =
      false

    recognition.interimResults =
      false

    recognition.onstart = () => {

      setListening(true)
    }

    recognition.onend = () => {

      setListening(false)
    }

    recognition.onresult =
      (event) => {

        const text =
          event.results[0][0]
            .transcript

        setMessage(text)
      }

    recognitionRef.current =
      recognition

  }, [])

  /* ─────────────────────────────
     START LISTENING
  ───────────────────────────── */

  const startListening =
    () => {

      if (
        recognitionRef.current
      ) {

        recognitionRef.current.start()
      }
    }

  /* ─────────────────────────────
     SPEAK RESPONSE
  ───────────────────────────── */

  const speak = (text) => {

    const utterance =
      new SpeechSynthesisUtterance(
        text
      )

    utterance.rate = 1

    utterance.pitch = 1

    speechSynthesisRef.current =
      utterance

    speechSynthesis.speak(
      utterance
    )
  }

  /* ─────────────────────────────
     SEND MESSAGE
  ───────────────────────────── */

  const sendMessage =
    async () => {

      if (!message.trim())
        return

      const userMessage = {

        role: "user",

        content: message,
      }

      setMessages((prev) => [
        ...prev,
        userMessage,
      ])

      const currentMessage =
        message

      setMessage("")

      try {

        setLoading(true)

        const res =
          await fetch(
            "/api/chat",
            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                message:
                  currentMessage,
              }),
            }
          )

        const data =
          await res.json()

        const reply =
          data.reply ||
          "I couldn't generate a response."

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: reply,
          },
        ])

        if (voiceEnabled) {

          speak(reply)
        }

      } catch (error) {

        console.log(error)

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Something went wrong.",
          },
        ])

      } finally {

        setLoading(false)
      }
    }

  /* ─────────────────────────────
     UI
  ───────────────────────────── */

  return (

    <>

      {/* floating button */}
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="
          fixed
          bottom-6
          right-6
          z-[100]
          w-16
          h-16
          rounded-2xl
          bg-[#C8F135]
          text-black
          text-3xl
          shadow-2xl
          hover:scale-110
          transition-all
          duration-300
        "
      >
        ✦
      </button>

      {/* panel */}
      {open && (

        <div
          className="
            fixed
            bottom-24
            right-4
            md:right-6
            z-[100]

            w-[calc(100vw-32px)]
            sm:w-[420px]

            h-[75vh]
            max-h-[720px]

            bg-[#0E0E0E]
            border border-white/[0.08]
            rounded-3xl
            overflow-hidden
            shadow-2xl

            flex
            flex-col

            backdrop-blur-xl
          "
        >

          {/* top */}
          <div
            className="
              p-5
              border-b
              border-white/[0.06]
              flex
              items-center
              justify-between
              shrink-0
            "
          >

            <div>

              <p className="
                text-[#C8F135]
                text-[10px]
                font-mono
                uppercase
                tracking-[0.15em]
                mb-1
              ">
                AI financial copilot
              </p>

              <h2
                className="
                  text-white
                  text-2xl
                  font-black
                "
                style={{
                  fontFamily:
                    "'Syne', sans-serif",
                }}
              >
                Finova AI
              </h2>

            </div>

            <div
              className="
                w-3
                h-3
                rounded-full
                bg-[#C8F135]
                animate-pulse
              "
            />

          </div>

          {/* messages */}
          <div
            className="
              flex-1
              overflow-y-auto
              p-4
              space-y-4
            "
          >

            {messages.map(
              (msg, index) => (

                <div
                  key={index}
                  className={`
                    flex
                    ${
                      msg.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }
                  `}
                >

                  <div
                    className={`
                      max-w-[85%]
                      rounded-2xl
                      px-4
                      py-3
                      text-sm
                      leading-relaxed
                      break-words
                      ${
                        msg.role === "user"
                          ? "bg-[#C8F135] text-black"
                          : "bg-[#151515] text-white border border-white/[0.06]"
                      }
                    `}
                  >
                    {msg.content}
                  </div>

                </div>
              )
            )}

            {loading && (

              <div
                className="
                  bg-[#151515]
                  border border-white/[0.06]
                  rounded-2xl
                  px-4
                  py-3
                  text-white
                  text-sm
                  w-fit
                "
              >
                Finova AI is thinking...
              </div>

            )}

          </div>

          {/* input */}
          <div
            className="
              p-4
              border-t
              border-white/[0.06]
              flex
              items-center
              gap-3
              shrink-0
            "
          >

            <input
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              onKeyDown={(e) => {

                if (
                  e.key === "Enter"
                ) {

                  sendMessage()
                }
              }}
              placeholder="Ask Finova AI..."
              className="
                flex-1
                bg-[#151515]
                border border-white/[0.08]
                rounded-2xl
                px-4
                py-3
                text-white
                outline-none
              "
            />

            {/* mic */}
            <button
              onClick={startListening}
              className={`
                w-12
                h-12
                rounded-2xl
                flex
                items-center
                justify-center
                text-xl
                transition-all
                shrink-0
                ${
                  listening
                    ? "bg-red-500 text-white scale-110"
                    : "bg-[#151515] text-white"
                }
              `}
            >
              🎤
            </button>

            {/* voice toggle */}
            <button
              onClick={() =>
                setVoiceEnabled(
                  !voiceEnabled
                )
              }
              className={`
                w-12
                h-12
                rounded-2xl
                flex
                items-center
                justify-center
                text-xl
                transition-all
                shrink-0
                ${
                  voiceEnabled
                    ? "bg-[#C8F135] text-black"
                    : "bg-[#151515] text-white"
                }
              `}
              title={
                voiceEnabled
                  ? "Voice enabled"
                  : "Voice disabled"
              }
            >
              🔊
            </button>

            {/* send */}
            <button
              onClick={sendMessage}
              className="
                w-12
                h-12
                rounded-2xl
                bg-[#C8F135]
                text-black
                text-xl
                font-black
                hover:scale-105
                transition-all
                shrink-0
              "
            >
              →
            </button>

          </div>

        </div>
      )}

    </>
  )
}