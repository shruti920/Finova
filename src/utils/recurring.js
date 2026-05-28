export function detectRecurringExpenses(
  transactions = []
) {

  const expenseTransactions =
    transactions.filter(
      (t) => t.type === "expense"
    )

  const grouped = {}

  expenseTransactions.forEach((tx) => {

    const key =
      tx.category?.toLowerCase()

    if (!grouped[key]) {
      grouped[key] = []
    }

    grouped[key].push(tx)
  })

  const recurring = []

  Object.entries(grouped).forEach(
    ([category, txs]) => {

      if (txs.length < 3) return

      const sorted =
        txs.sort(
          (a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt)
        )

      let intervals = []

      for (let i = 1; i < sorted.length; i++) {

        const prev =
          new Date(sorted[i - 1].createdAt)

        const curr =
          new Date(sorted[i].createdAt)

        const diffDays =
          Math.round(
            (curr - prev) /
            (1000 * 60 * 60 * 24)
          )

        intervals.push(diffDays)
      }

      const avgInterval =
        intervals.reduce(
          (a, b) => a + b,
          0
        ) / intervals.length

      if (
        avgInterval >= 25 &&
        avgInterval <= 35
      ) {

        recurring.push({
          category,
          count: txs.length,
          averageAmount:
            txs.reduce(
              (sum, t) =>
                sum + Number(t.amount),
              0
            ) / txs.length,
        })
      }
    }
  )

  return recurring
}