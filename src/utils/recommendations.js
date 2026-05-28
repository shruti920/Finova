import {
  calculateTotals,
  calculateSavingsRate,
} from "./analytics"

export function generateRecommendations(
  transactions = [],
  budgets = []
) {

  const recommendations = []

  const totals =
    calculateTotals(transactions)

  const savingsRate =
    calculateSavingsRate(transactions)

  /* ─────────────────────────────
     LOW SAVINGS
  ───────────────────────────── */

  if (savingsRate < 20) {

    recommendations.push({
      type: "warning",

      icon: "⚠️",

      title: "Low savings rate",

      message:
        "Try saving at least 20% of your income each month.",
    })
  }

  /* ─────────────────────────────
     OVERSPENDING
  ───────────────────────────── */

  if (totals.expense > totals.income) {

    recommendations.push({
      type: "danger",

      icon: "📉",

      title: "Overspending detected",

      message:
        "Your expenses are higher than your income.",
    })
  }

  /* ─────────────────────────────
     CATEGORY ANALYSIS
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

    const limit =
      Number(budget.limit)

    const pct =
      (spent / limit) * 100

    if (pct >= 90) {

      recommendations.push({
        type: "warning",

        icon: "🔥",

        title: `${budget.category} budget risk`,

        message:
          `You already used ${Math.round(pct)}% of this budget.`,
      })
    }
  })

  /* ─────────────────────────────
     EMPTY FALLBACK
  ───────────────────────────── */

  if (recommendations.length === 0) {

    recommendations.push({
      type: "success",

      icon: "✅",

      title: "Great financial habits",

      message:
        "Your spending and savings look healthy.",
    })
  }

  return recommendations
}