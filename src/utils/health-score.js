import {
  calculateTotals,
  calculateSavingsRate,
} from "./analytics"

export function calculateHealthScore(
  transactions = [],
  budgets = []
) {

  const totals =
    calculateTotals(transactions)

  const savingsRate =
    calculateSavingsRate(transactions)

  let score = 100

  /* ─────────────────────────────
     LOW SAVINGS RATE
  ───────────────────────────── */

  if (savingsRate < 20) {
    score -= 20
  }

  if (savingsRate < 10) {
    score -= 15
  }

  /* ─────────────────────────────
     OVERSPENDING
  ───────────────────────────── */

  if (totals.expense > totals.income) {
    score -= 25
  }

  /* ─────────────────────────────
     BUDGET VIOLATIONS
  ───────────────────────────── */

  budgets.forEach((budget) => {

    const spent = transactions
      .filter(
        (tx) =>
          tx.type === "expense" &&
          tx.category.toLowerCase() ===
            budget.category.toLowerCase()
      )
      .reduce(
        (sum, tx) =>
          sum + Number(tx.amount),
        0
      )

    if (spent > Number(budget.limit)) {
      score -= 10
    }
  })

  /* ─────────────────────────────
     CLAMP
  ───────────────────────────── */

  score = Math.max(
    Math.min(score, 100),
    0
  )

  let status = "Excellent"

  if (score < 85) {
    status = "Healthy"
  }

  if (score < 70) {
    status = "Warning"
  }

  if (score < 50) {
    status = "Critical"
  }

  return {
    score,
    status,
  }
}