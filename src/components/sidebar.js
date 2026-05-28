"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "⬡",
    color: "#C8F135",
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: "〜",
    color: "#00D4FF",
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: "↕",
    color: "#FF3CAC",
  },
  {
    label: "Budgets",
    href: "/dashboard/budgets",
    icon: "◎",
    color: "#FF6B35",
  },
  {
    label: "Goals",
    href: "/dashboard/goals",
    icon: "🎯",
    color: "#A78BFA",
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: "📊",
    color: "#34D399",
  },
]

export default function Sidebar({
  open = true,
  onClose = () => {},
}) {

  const pathname = usePathname()

  const {
    data: session,
  } = useSession()

  const [loggingOut, setLoggingOut] =
    useState(false)

  const getInitials = (name) => {

    if (!name) return "U"

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async () => {

    try {

      setLoggingOut(true)

      await signOut()

    } catch (error) {

      console.log(error)

    } finally {

      setLoggingOut(false)

    }
  }

  return (
    <>

      {/* ─────────────────────────────────────────────
         MOBILE OVERLAY
      ───────────────────────────────────────────── */}
      {open && (
        <div
          onClick={onClose}
          className="
            fixed inset-0
            bg-black/60
            backdrop-blur-sm
            z-40
            md:hidden
          "
        />
      )}

      {/* ─────────────────────────────────────────────
         SIDEBAR
      ───────────────────────────────────────────── */}
      <aside
        className={`
          fixed md:relative z-50
          flex flex-col
          bg-[#080808]
          border-r border-white/[0.06]
          transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          overflow-hidden

          ${
            open
              ? "w-[260px] translate-x-0"
              : "-translate-x-full md:translate-x-0 md:w-[76px] w-[260px]"
          }
        `}
        style={{
          minHeight: "100vh",
        }}
      >

        {/* ─────────────────────────────────────────────
           AMBIENT GLOW
        ───────────────────────────────────────────── */}
        <div
          className="
            absolute top-0 left-0
            w-40 h-40
            rounded-full blur-3xl
            pointer-events-none
            opacity-[0.06]
          "
          style={{
            background: "#C8F135",
          }}
        />

        {/* ─────────────────────────────────────────────
           LOGO
        ───────────────────────────────────────────── */}
        <div
          className={`
            px-4 pt-7 pb-8 flex-shrink-0
            ${!open && "md:flex md:justify-center md:px-0"}
          `}
        >

          {open ? (

            <div className="px-2">

              <div className="flex items-center gap-2 mb-2">

                <div className="w-1.5 h-1.5 rounded-full bg-[#C8F135] animate-pulse" />

                <span className="
                  text-[#C8F135]
                  font-mono
                  text-[10px]
                  tracking-[0.18em]
                  uppercase
                ">
                  Finance Tracker
                </span>

              </div>

              <h1
                className="
                  text-[#F2F2F2]
                  text-[34px]
                  font-black
                  tracking-tight
                  leading-none
                "
                style={{
                  fontFamily:
                    "'Syne', sans-serif",
                }}
              >
                Finova
              </h1>

            </div>

          ) : (

            <div
              className="
                hidden md:flex
                w-11 h-11
                rounded-xl
                bg-[#C8F135]
                items-center
                justify-center
                font-black
                text-[18px]
                text-black
                flex-shrink-0
              "
              style={{
                fontFamily:
                  "'Syne', sans-serif",
              }}
            >
              F
            </div>

          )}

        </div>

        {/* ─────────────────────────────────────────────
           MENU LABEL
        ───────────────────────────────────────────── */}
        {open && (
          <p className="
            text-[#333]
            font-mono
            text-[10px]
            tracking-[0.2em]
            uppercase
            px-6 mb-3
          ">
            Menu
          </p>
        )}

        {/* ─────────────────────────────────────────────
           NAVIGATION
        ───────────────────────────────────────────── */}
        <nav
          className={`
            flex-1 flex flex-col gap-1.5
            ${open ? "px-3" : "md:px-2.5"}
          `}
        >

          {NAV_ITEMS.map((item) => {

            const active =
              pathname === item.href

            return (

              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    onClose?.()
                  }
                }}
                className={`
                  group relative flex items-center
                  rounded-2xl border
                  overflow-hidden
                  transition-all duration-200

                  ${
                    open
                      ? "px-3 py-3.5 gap-3.5"
                      : "md:justify-center md:py-3.5"
                  }

                  ${
                    active
                      ? "border-white/[0.08] bg-[#141414]"
                      : "border-transparent hover:bg-[#111111] hover:border-white/[0.05]"
                  }
                `}
                style={{
                  boxShadow: active
                    ? `0 0 0 1px ${item.color}20`
                    : "none",
                }}
              >

                {/* ACTIVE BAR */}
                {active && (
                  <div
                    className="
                      absolute left-0
                      top-2.5 bottom-2.5
                      w-[3px]
                      rounded-full
                    "
                    style={{
                      background: item.color,
                    }}
                  />
                )}

                {/* SPOTLIGHT */}
                <div
                  className={`
                    absolute inset-0
                    rounded-2xl
                    pointer-events-none
                    transition-opacity duration-300

                    ${
                      active
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }
                  `}
                  style={{
                    background:
                      `radial-gradient(
                        80px circle at ${
                          open ? "30%" : "50%"
                        } 50%,
                        ${item.color}12 0%,
                        transparent 70%
                      )`,
                  }}
                />

                {/* SHINE */}
                <div className="
                  absolute inset-0
                  rounded-2xl
                  pointer-events-none
                  bg-gradient-to-b
                  from-white/[0.02]
                  to-transparent
                " />

                {/* ICON */}
                <div
                  className="
                    relative z-10
                    w-8 h-8
                    rounded-xl
                    flex items-center justify-center
                    text-[16px]
                    font-black
                    flex-shrink-0
                    transition-all duration-200
                  "
                  style={{
                    background: active
                      ? `${item.color}18`
                      : "transparent",

                    color: active
                      ? item.color
                      : "#444",
                  }}
                >
                  {item.icon}
                </div>

                {/* LABEL */}
                {open && (
                  <>
                    <span
                      className="
                        relative z-10
                        text-[15px]
                        font-bold
                        flex-1
                        transition-colors duration-200
                      "
                      style={{
                        fontFamily:
                          "'Syne', sans-serif",

                        color: active
                          ? "#F2F2F2"
                          : "#555",
                      }}
                    >
                      {item.label}
                    </span>

                    {active && (
                      <div
                        className="
                          relative z-10
                          w-2 h-2
                          rounded-full
                          flex-shrink-0
                        "
                        style={{
                          background:
                            item.color,
                        }}
                      />
                    )}
                  </>
                )}

                {/* TOOLTIP */}
                {!open && (
                  <div
                    className="
                      hidden md:block
                      absolute left-full ml-3
                      px-3 py-1.5
                      bg-[#191919]
                      border border-white/[0.1]
                      rounded-xl
                      text-[13px]
                      font-bold
                      text-[#F2F2F2]
                      whitespace-nowrap
                      pointer-events-none
                      opacity-0
                      group-hover:opacity-100
                      -translate-x-1
                      group-hover:translate-x-0
                      transition-all duration-200
                      z-50
                    "
                    style={{
                      fontFamily:
                        "'Syne', sans-serif",
                    }}
                  >
                    {item.label}
                  </div>
                )}

              </Link>
            )
          })}

        </nav>

        {/* ─────────────────────────────────────────────
           DIVIDER
        ───────────────────────────────────────────── */}
        <div className="
          border-t border-white/[0.05]
          mx-4 my-4
        " />


        {/* ─────────────────────────────────────────────
           FOOTER
        ───────────────────────────────────────────── */}
        <div
          className={`
            flex-shrink-0 p-3
            ${!open && "md:flex md:flex-col md:items-center md:gap-2"}
          `}
        >

          {/* PRO CARD */}
          <div
            className={`
              relative
              bg-[#111111]
              border border-white/[0.07]
              rounded-2xl
              overflow-hidden
              mb-2
              transition-all duration-300

              ${
                open
                  ? "p-4"
                  : "hidden md:flex md:w-11 md:h-11 md:items-center md:justify-center md:p-0"
              }
            `}
          >

            <div
              className="
                absolute -top-4 -right-4
                w-16 h-16
                rounded-full blur-2xl
                opacity-10
                pointer-events-none
              "
              style={{
                background: "#C8F135",
              }}
            />

            {open ? (

              <div className="relative z-10">

                <div className="flex items-center gap-2 mb-2">

                  <span className="text-[#C8F135] text-[14px]">
                    ✦
                  </span>

                  <p className="
                    text-[#C8F135]
                    font-mono
                    text-[10px]
                    uppercase
                    tracking-[0.12em]
                  ">
                    Finova Pro
                  </p>

                </div>

                <p className="
                  text-[#555]
                  text-[12px]
                  font-mono
                  leading-relaxed
                ">
                  AI finance insights
                  <br />
                  coming soon.
                </p>

              </div>

            ) : (

              <span className="
                text-[#C8F135]
                text-[16px]
                relative z-10
              ">
                ✦
              </span>

            )}

          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={`
              w-full
              flex items-center justify-center gap-2
              py-3
              rounded-2xl
              border border-white/[0.06]

              text-[#444]
              font-mono
              text-[11px]
              tracking-wide

              hover:bg-[#FF3CAC]/08
              hover:border-[#FF3CAC]/25
              hover:text-[#FF3CAC]

              transition-all duration-200

              disabled:opacity-30
              disabled:cursor-not-allowed

              ${
                !open
                  ? "hidden md:flex md:w-11 md:h-11 md:p-0"
                  : ""
              }
            `}
          >

            {loggingOut ? (

              <span className="
                w-3.5 h-3.5
                border-2
                border-[#FF3CAC]/30
                border-t-[#FF3CAC]
                rounded-full
                animate-spin
              " />

            ) : (

              <>
                <span className="text-[14px]">
                  →
                </span>

                {open && "Logout"}
              </>

            )}

          </button>

        </div>

      </aside>

    </>
  )
}