export const formatCurrency = (amount = 0) => {

  return Number(amount).toLocaleString("en-IN")

}

/* ─────────────────────────────────────────────
   TOTALS
───────────────────────────────────────────── */

export function calculateTotals(transactions = []) {

  const income = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + Number(tx.amount), 0)

  const expense = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + Number(tx.amount), 0)

  return {
    income,
    expense,
    balance: income - expense,
  }
}

/* ─────────────────────────────────────────────
   CATEGORY EXPENSES
───────────────────────────────────────────── */

export function calculateCategoryExpenses(
  transactions = []
) {

  const map = {}

  transactions.forEach((tx) => {

    if (tx.type !== "expense") return

    const category = tx.category || "Other"

    map[category] =
      (map[category] || 0) +
      Number(tx.amount)

  })

  return map
}

/* ─────────────────────────────────────────────
   TOP SPENDING CATEGORIES
───────────────────────────────────────────── */

export function getTopCategories(
  transactions = [],
  limit = 5
) {

  const categoryMap =
    calculateCategoryExpenses(transactions)

  return Object.entries(categoryMap)

    .map(([category, amount]) => ({
      category,
      amount,
    }))

    .sort((a, b) => b.amount - a.amount)

    .slice(0, limit)
}

/* ─────────────────────────────────────────────
   SAVINGS RATE
───────────────────────────────────────────── */

export function calculateSavingsRate(
  transactions = []
) {

  const { income, expense } =
    calculateTotals(transactions)

  if (income <= 0) return 0

  return Math.round(
    ((income - expense) / income) * 100
  )
}

/* ─────────────────────────────────────────────
   MONTHLY DATA
───────────────────────────────────────────── */

export function getMonthlyData(
  transactions = []
) {

  const monthlyMap = {}

  transactions.forEach((tx) => {

    const date = new Date(tx.createdAt)

    const year = date.getFullYear()
    const month = date.getMonth()

    const key = `${year}-${month}`

    if (!monthlyMap[key]) {

      monthlyMap[key] = {

        label: date.toLocaleString(
          "en-US",
          {
            month: "short",
            year: "numeric",
          }
        ),

        income: 0,
        expense: 0,

        sortKey:
          new Date(year, month).getTime(),
      }
    }

    if (tx.type === "income") {

      monthlyMap[key].income +=
        Number(tx.amount)

    } else {

      monthlyMap[key].expense +=
        Number(tx.amount)
    }

  })

  return Object.values(monthlyMap)
    .sort((a, b) => a.sortKey - b.sortKey)
}

/* ─────────────────────────────────────────────
   MONTH COMPARISON
───────────────────────────────────────────── */

export function getMonthlyComparison(
  transactions = []
) {

  const monthly =
    getMonthlyData(transactions)

  if (monthly.length < 2) {

    return null
  }

  const current =
    monthly[monthly.length - 1]

  const previous =
    monthly[monthly.length - 2]

  return {

    current,
    previous,

    incomeChange:
      current.income -
      previous.income,

    expenseChange:
      current.expense -
      previous.expense,

    savingsChange:
      (current.income - current.expense) -
      (previous.income - previous.expense),
  }
}