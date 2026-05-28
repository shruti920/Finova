"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"

export default function NotificationDropdown() {

  const [
    notifications,
    setNotifications,
  ] = useState([])

  const [
    open,
    setOpen,
  ] = useState(false)

  const unread =
  Array.isArray(notifications)
    ? notifications.filter(
        (n) => !n.read
      ).length
    : 0

  const fetchNotifications =
    async () => {

      try {

        const res =
          await fetch(
            "/api/notifications"
          )

        const data =
            await res.json()

            setNotifications(
                Array.isArray(data)
                ? data
                : data.notifications || []
)

      } catch (error) {

        console.log(error)

      }
    }

  useEffect(() => {

    // defer fetching to avoid calling setState synchronously within the effect
    const id = setTimeout(() => {
      fetchNotifications()
    }, 0)

    return () => clearTimeout(id)

  }, [])

  const markRead =
    async (id) => {

      await fetch(
        "/api/notifications",
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id,
          }),
        }
      )

      fetchNotifications()
    }

  return (

    <div className="relative">

      {/* bell */}
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="
          relative
          w-12 h-12
          rounded-2xl
          bg-[#111111]
          border border-white/[0.07]
          flex items-center justify-center
          hover:border-[#C8F135]/30
          transition-all duration-200
        "
      >

        <Bell
          size={18}
          className="text-white"
        />

        {unread > 0 && (

          <div
            className="
              absolute
              -top-1 -right-1
              min-w-[20px]
              h-5
              rounded-full
              bg-[#FF3CAC]
              text-white
              text-[10px]
              flex items-center justify-center
              font-bold
              px-1
            "
          >
            {unread}
          </div>

        )}

      </button>

      {/* dropdown */}
      {open && (

        <div
          className="
            absolute
            right-0 mt-3
            w-[360px]
            bg-[#0B0B0B]/95
            backdrop-blur-2xl
            border border-white/[0.07]
            rounded-3xl
            shadow-2xl
            overflow-hidden
            z-50
          "
        >

          {/* top */}
          <div
            className="
              px-5 py-4
              border-b border-white/[0.06]
              flex items-center justify-between
            "
          >

            <div>

              <p className="
                text-[#C8F135]
                text-[10px]
                uppercase
                tracking-[0.14em]
                font-mono
              ">
                alerts center
              </p>

              <h3
                className="
                  text-white
                  text-xl
                  font-black
                "
                style={{
                  fontFamily:
                    "'Syne', sans-serif",
                }}
              >
                Notifications
              </h3>

            </div>

            <div
              className="
                px-3 py-1
                rounded-full
                bg-[#C8F135]/10
                text-[#C8F135]
                text-xs
                font-mono
              "
            >
              {unread} unread
            </div>

          </div>

          {/* items */}
          <div
            className="
              max-h-[420px]
              overflow-y-auto
            "
          >

            {notifications.length === 0 ? (

              <div className="p-10 text-center">

                <p className="text-4xl mb-3">
                  🔔
                </p>

                <p className="text-white font-bold">
                  No notifications
                </p>

              </div>

            ) : (

              notifications.map((n) => (

                <button
                  key={n.id}
                  onClick={() =>
                    markRead(n.id)
                  }
                  className="
                    w-full
                    text-left
                    p-5
                    border-b border-white/[0.05]
                    hover:bg-white/[0.03]
                    transition-all duration-200
                  "
                >

                  <div className="
                    flex items-start gap-3
                  ">

                    <div
                      className="
                        w-10 h-10
                        rounded-2xl
                        bg-[#C8F135]/10
                        flex items-center justify-center
                        text-lg
                        flex-shrink-0
                      "
                    >
                      ⚡
                    </div>

                    <div className="flex-1">

                      <p className="
                        text-white
                        text-sm
                        font-semibold
                        leading-relaxed
                      ">
                        {n.message}
                      </p>

                      <p className="
                        text-[#555]
                        text-[11px]
                        font-mono
                        mt-2
                      ">
                        {new Date(
                          n.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>

                    {!n.read && (

                      <div
                        className="
                          w-2 h-2
                          rounded-full
                          bg-[#C8F135]
                          mt-2
                        "
                      />

                    )}

                  </div>

                </button>

              ))

            )}

          </div>

        </div>

      )}

    </div>
  )
}