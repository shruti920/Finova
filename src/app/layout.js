import "./globals.css"
import Provider from "@/components/provider"
import { Toaster } from "react-hot-toast"

export const metadata = {
  title: "Finova | Personal Finance Tracker",
  description:
    "A bold personal finance tracker for budgets, cashflow, goals, and daily money moves.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111",
              color: "#F2F2F2",
              border: "1px solid rgba(255,255,255,0.08)",
            },
          }}
        />
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
