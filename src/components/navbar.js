"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Bell, Search, Sparkles, X, Command } from "lucide-react"
import NotificationBell from "./notification-bell"
import NotificationDropdown
from "@/components/notification-dropdown"

const today = new Date().toLocaleDateString("en-IN", {
  weekday: "short", day: "numeric", month: "short",
})

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return { text: "Good Morning",   icon: "☀" }
  if (h < 18) return { text: "Good Afternoon",  icon: "⚡" }
  return         { text: "Good Evening",    icon: "🌙" }
}

// Search suggestions based on keywords
const SEARCH_ROUTES = {
  "dashboard": "/dashboard",
  "home": "/dashboard",
  "analytics": "/dashboard/analytics",
  "transactions": "/dashboard/transactions",
  "budgets": "/dashboard/budgets",
  "goals": "/dashboard/goals",
}

export default function Navbar({ sidebarOpen = true, onToggleSidebar }) {
  const { text: greeting, icon } = getGreeting()
  const router = useRouter()
  const { data: session } = useSession()
  
  const [searchOpen,  setSearchOpen]  = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [aiActive,    setAiActive]    = useState(true)
  const searchRef = useRef(null)
  const inputRef  = useRef(null)

  // Get user name from session
  const userName = session?.user?.name || "User"
  const userEmail = session?.user?.email || ""
  
  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const userInitials = getInitials(userName)

  // Handle search submission
  const handleSearch = useCallback((query) => {
    if (!query.trim()) return
    
    const lowerQuery = query.toLowerCase()
    
    // Direct route match
    if (SEARCH_ROUTES[lowerQuery]) {
      router.push(SEARCH_ROUTES[lowerQuery])
      setSearchOpen(false)
      setSearchQuery("")
      return
    }

    // Fuzzy match
    for (const [key, route] of Object.entries(SEARCH_ROUTES)) {
      if (key.includes(lowerQuery) || lowerQuery.includes(key)) {
        router.push(route)
        setSearchOpen(false)
        setSearchQuery("")
        return
      }
    }
  }, [router])

  /* open search on ⌘K */
  useEffect(() => {
    const fn = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
        setTimeout(() => inputRef.current?.focus(), 50)
      }
      if (e.key === "Escape") setSearchOpen(false)
      if (e.key === "Enter" && searchOpen && searchQuery) {
        e.preventDefault()
        handleSearch(searchQuery)
      }
    }
    window.addEventListener("keydown", fn)
    return () => window.removeEventListener("keydown", fn)
  }, [searchOpen, searchQuery, handleSearch])

  /* close on outside click */
  useEffect(() => {
    const fn = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setSearchOpen(false)
    }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#080808]/70 border-b border-white/[0.06] h-[72px]">

      {/* subtle top line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C8F135]/30 to-transparent pointer-events-none" />

      <div className="h-full px-6 flex items-center justify-between gap-4">

        {/* ── LEFT: greeting + hamburger ── */}
        <div className="flex items-center gap-4 flex-shrink-0">
          
          {/* hamburger menu */}
          <button
            onClick={onToggleSidebar}
            className="
              w-10 h-10 rounded-xl
              bg-[#111111]
              border border-white/[0.07]
              flex items-center justify-center
              hover:border-[#C8F135]/30
              transition-all duration-200
              hidden md:flex
            "
          >
            <div className="space-y-1">
              <div className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${sidebarOpen ? '' : 'rotate-45 translate-y-2'}`} />
              <div className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${sidebarOpen ? '' : 'opacity-0'}`} />
              <div className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${sidebarOpen ? '' : '-rotate-45 -translate-y-2'}`} />
            </div>
          </button>

          <div className="flex-shrink-0">
            <p className="text-[#444] font-mono text-[10px] uppercase tracking-[0.18em] mb-0.5">
              {today} · finova intelligence
            </p>
            <h1
              className="text-[#F2F2F2] text-[22px] font-black leading-none tracking-tight flex items-center gap-2"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {greeting}, {userName.split(" ")[0]}
              <span className="text-[#C8F135] text-[18px]">{icon}</span>
            </h1>
          </div>
        </div>

        {/* ── RIGHT: controls ── */}
        <div className="flex items-center gap-2.5 flex-shrink-0">

          {/* ── Search bar (desktop) ── */}
          <div
            ref={searchRef}
            className={`
              hidden md:flex items-center gap-2.5
              bg-[#111111] border rounded-2xl
              px-4 py-2.5 transition-all duration-200
              ${searchOpen
                ? "w-[300px] border-[#C8F135]/40 shadow-[0_0_16px_rgba(200,241,53,0.08)]"
                : "w-[220px] border-white/[0.07] hover:border-white/[0.12] cursor-pointer"
              }
            `}
            onClick={() => {
              setSearchOpen(true)
              setTimeout(() => inputRef.current?.focus(), 50)
            }}
          >
            <Search size={14} className="text-[#444] flex-shrink-0" />
            <input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pages…"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(searchQuery)
                }
              }}
              className="
                bg-transparent outline-none text-[13px]
                text-[#F2F2F2] placeholder-[#333] w-full font-mono
              "
            />
            {searchOpen && searchQuery ? (
              <button 
                onClick={() => setSearchQuery("")} 
                className="text-[#444] hover:text-[#888] transition-colors"
              >
                <X size={13} />
              </button>
            ) : (
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <div className="px-1.5 py-0.5 bg-[#1A1A1A] border border-white/[0.07] rounded-md text-[#333] font-mono text-[9px] flex items-center gap-0.5">
                  <Command size={9} />K
                </div>
              </div>
            )}
          </div>

          {/* ── AI toggle ── */}
          <button
            onClick={() => setAiActive(a => !a)}
            className={`
              hidden md:flex h-10 px-4 rounded-2xl border
              items-center gap-2 transition-all duration-200
              ${aiActive
                ? "bg-[#C8F135]/10 border-[#C8F135]/30 text-[#C8F135] hover:bg-[#C8F135]/15"
                : "bg-[#111111] border-white/[0.07] text-[#444] hover:border-white/[0.12] hover:text-[#888]"
              }
            `}
          >
            <Sparkles
              size={14}
              className={`transition-all duration-200 ${aiActive ? "text-[#C8F135]" : "text-[#444]"}`}
            />
            <span className="font-mono text-[11px] tracking-wide">
              {aiActive ? "AI Active" : "AI Off"}
            </span>
            {/* live dot */}
            {aiActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8F135] animate-pulse" />
            )}
          </button>

          {/* ── Notification bell ── */}
          <NotificationBell />
          <NotificationDropdown />

          {/* ── Avatar ── */}
          <div className="relative group cursor-pointer">
            <div
              className="
                w-10 h-10 rounded-2xl
                flex items-center justify-center
                text-black font-black text-[12px]
                transition-all duration-200
                group-hover:scale-105
              "
              style={{
                fontFamily: "'Syne', sans-serif",
                background: "linear-gradient(135deg, #C8F135 0%, #00D4FF 100%)",
                boxShadow: "0 0 20px rgba(200,241,53,0.2)",
              }}
            >
              {userInitials}
            </div>

            {/* online dot */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#34D399] border-2 border-[#080808]" />

            {/* hover tooltip */}
            <div className="
              absolute right-0 top-full mt-2
              bg-[#141414] border border-white/[0.08]
              rounded-xl px-3 py-2 min-w-[160px]
              opacity-0 group-hover:opacity-100
              translate-y-1 group-hover:translate-y-0
              transition-all duration-200 pointer-events-none z-50
            ">
              <p className="text-[#F2F2F2] font-black text-[13px] leading-none mb-0.5"
                style={{ fontFamily: "'Syne', sans-serif" }}>
                {userName}
              </p>
              <p className="text-[#444] font-mono text-[10px]">{userEmail}</p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Mobile search bar ── */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center gap-2.5 bg-[#111111] border border-white/[0.07] rounded-xl px-3 py-2.5">
          <Search size={14} className="text-[#444] flex-shrink-0" />
          <input
            placeholder="Search pages…"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(e.target.value)
                e.target.value = ""
              }
            }}
            className="bg-transparent outline-none text-[13px] text-[#F2F2F2] placeholder-[#333] w-full font-mono"
          />
        </div>
      </div>

    </header>
  )
}