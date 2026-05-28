"use client"

import { useState } from "react"

import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import AIChat from "@/components/ai-chat"

export default function DashboardLayout({
  children,
}) {

  const [sidebarOpen, setSidebarOpen] =
    useState(true)

  return (
    <div className="flex bg-black text-white min-h-screen overflow-hidden">

      {/* sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* main area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* navbar */}
        <Navbar 
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* page content */}
        <main className="flex-1 overflow-y-auto p-8">

          {children}

        </main>

      </div>

      {/* AI chat */}
      <AIChat />

    </div>
  )
}