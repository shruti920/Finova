"use client"

import { useEffect, useRef, useState } from "react"
import { Bell, CheckCheck, X } from "lucide-react"

const TYPE_META = {
  budget:  { color: "#FF3CAC", icon: "◎", label: "Budget"      },
  goal:    { color: "#C8F135", icon: "✦", label: "Goal"        },
  income:  { color: "#34D399", icon: "↑", label: "Income"      },
  tip:     { color: "#00D4FF", icon: "〜", label: "Tip"        },
  alert:   { color: "#FF6B35", icon: "⚠", label: "Alert"      },
  default: { color: "#A78BFA", icon: "●", label: "Update"      },
}

const getMeta = (type = "") =>
  TYPE_META[type?.toLowerCase()] ?? TYPE_META.default

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m    = Math.floor(diff / 60000)
  if (m < 1)  return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function NotificationBell() {
  const [open, setOpen]                   = useState(false)
  const [notifications, setNotifications] = useState([])
  const [markingAll, setMarkingAll]       = useState(false)
  const dropdownRef                       = useRef(null)
  const bellRef                           = useRef(null)

  const fetchNotifications = async () => {
    try {
      const res  = await fetch("/api/notifications")
      const data = await res.json()
      setNotifications(Array.isArray(data) ? data : [])
    } catch { setNotifications([]) }
  }

  useEffect(() => {
    const loadNotifications = async () => {
      await fetchNotifications()
    }
    loadNotifications()
  }, [])

  /* close on outside click */
  useEffect(() => {
    const fn = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          bellRef.current    && !bellRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  const unread      = notifications.filter(n => !n.read)
  const unreadCount = unread.length

  const markAllRead = async () => {
    setMarkingAll(true)
    await new Promise(r => setTimeout(r, 600)) // replace with real API call
    setNotifications(p => p.map(n => ({ ...n, read: true })))
    setMarkingAll(false)
  }

  const dismiss = (id) =>
    setNotifications(p => p.filter(n => n.id !== id))

  return (
    <div className="relative">

      {/* ── Bell button ── */}
      <button
        ref={bellRef}
        onClick={() => setOpen(o => !o)}
        className={`
          relative w-11 h-11 rounded-2xl
          bg-[#111111] border
          flex items-center justify-center
          transition-all duration-200
          ${open
            ? "border-[#C8F135]/40 shadow-[0_0_16px_rgba(200,241,53,0.12)]"
            : "border-white/[0.07] hover:border-white/[0.14]"
          }
        `}
      >
        <Bell
          size={18}
          className="transition-colors duration-200"
          style={{ color: open ? "#C8F135" : "#888" }}
        />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <div className="
            absolute -top-1.5 -right-1.5
            min-w-[20px] h-5 rounded-full
            bg-[#FF3CAC] border-2 border-[#080808]
            text-white text-[10px] font-black
            flex items-center justify-center px-1
          "
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}

        {/* Pulse ring when unread */}
        {unreadCount > 0 && !open && (
          <div className="absolute inset-0 rounded-2xl border border-[#FF3CAC]/30 animate-ping opacity-60 pointer-events-none" />
        )}
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div
          ref={dropdownRef}
          className="
            absolute right-0 mt-3 w-[380px]
            bg-[#0E0E0E] border border-white/[0.08]
            rounded-3xl overflow-hidden z-50
            shadow-[0_24px_64px_rgba(0,0,0,0.6)]
          "
          style={{
            animation: "notifSlideIn 0.25s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <style>{`
            @keyframes notifSlideIn {
              from { opacity: 0; transform: translateY(-10px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0)      scale(1);    }
            }
          `}</style>

          {/* ── Header ── */}
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <p className="text-[#C8F135] font-mono text-[10px] uppercase tracking-[0.14em] mb-1">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
              </p>
              <h2
                className="text-[#F2F2F2] text-xl font-black leading-none"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Notifications
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Mark all read */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  disabled={markingAll}
                  className="
                    flex items-center gap-1.5 px-3 py-2 rounded-xl
                    bg-[#191919] border border-white/[0.07]
                    text-[#C8F135] font-mono text-[11px]
                    hover:bg-[#C8F135]/10 hover:border-[#C8F135]/30
                    transition-all duration-200 disabled:opacity-40
                  "
                >
                  {markingAll
                    ? <span className="w-3.5 h-3.5 border-2 border-[#C8F135]/30 border-t-[#C8F135] rounded-full animate-spin" />
                    : <CheckCheck size={14} />
                  }
                  {!markingAll && "Mark all"}
                </button>
              )}

              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="
                  w-8 h-8 rounded-xl bg-[#191919] border border-white/[0.07]
                  flex items-center justify-center text-[#555]
                  hover:text-[#F2F2F2] hover:border-white/[0.12]
                  transition-all duration-200
                "
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* ── Type filter pills ── */}
          {notifications.length > 0 && (
            <div className="flex gap-2 px-5 py-3 border-b border-white/[0.05] overflow-x-auto no-scrollbar">
              {["all", ...new Set(notifications.map(n => n.type?.toLowerCase()).filter(Boolean))].map((t) => {
                const meta = t === "all" ? { color: "#C8F135", label: "All" } : getMeta(t)
                return (
                  <div
                    key={t}
                    className="px-2.5 py-1 rounded-full border text-[10px] font-mono whitespace-nowrap flex-shrink-0 cursor-pointer"
                    style={{
                      background:  `${meta.color}12`,
                      borderColor: `${meta.color}30`,
                      color:       meta.color,
                    }}
                  >
                    {meta.label}
                  </div>
                )
              })}
            </div>
          )}

          {/* ── Body ── */}
          <div className="max-h-[400px] overflow-y-auto">

            {notifications.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-5xl mb-4">🔔</p>
                <p
                  className="text-[#F2F2F2] font-black text-lg mb-1"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  All clear
                </p>
                <p className="text-[#444] font-mono text-[12px]">
                  No notifications yet.
                </p>
              </div>
            ) : (
              notifications.map((n, i) => {
                const meta   = getMeta(n.type)
                const isLast = i === notifications.length - 1

                return (
                  <div
                    key={n.id}
                    className={`
                      group relative flex items-start gap-3 px-5 py-4
                      transition-all duration-200
                      hover:bg-white/[0.02]
                      ${!isLast ? "border-b border-white/[0.04]" : ""}
                      ${!n.read ? "bg-white/[0.015]" : ""}
                    `}
                  >
                    {/* Unread left bar */}
                    {!n.read && (
                      <div
                        className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full"
                        style={{ background: meta.color }}
                      />
                    )}

                    {/* Type icon box */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-[14px] font-black flex-shrink-0 mt-0.5"
                      style={{
                        background: `${meta.color}18`,
                        color:      meta.color,
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
                      {meta.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3
                          className="text-[#F2F2F2] font-black text-[14px] leading-tight"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                          {n.title}
                        </h3>

                        {/* Type badge */}
                        <span
                          className="text-[9px] font-mono px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                          style={{
                            background:  `${meta.color}15`,
                            color:       meta.color,
                          }}
                        >
                          {meta.label}
                        </span>
                      </div>

                      <p className="text-[#666] text-[12px] font-mono leading-relaxed mb-2">
                        {n.message}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span className="text-[#333] font-mono text-[10px]">
                          {timeAgo(n.createdAt)}
                        </span>
                        {!n.read && (
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: meta.color }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Dismiss on hover */}
                    <button
                      onClick={() => dismiss(n.id)}
                      className="
                        opacity-0 group-hover:opacity-100
                        w-6 h-6 rounded-lg
                        bg-[#1A1A1A] border border-white/[0.07]
                        flex items-center justify-center
                        text-[#555] hover:text-[#FF3CAC]
                        hover:border-[#FF3CAC]/25
                        transition-all duration-200 flex-shrink-0 mt-0.5
                      "
                    >
                      <X size={11} />
                    </button>
                  </div>
                )
              })
            )}
          </div>

          {/* ── Footer ── */}
          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[#333] font-mono text-[10px]">
                {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => setNotifications([])}
                className="text-[#444] font-mono text-[10px] hover:text-[#FF3CAC] transition-colors duration-200"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}