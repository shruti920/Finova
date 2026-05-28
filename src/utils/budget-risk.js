export function predictBudgetRisk(
  budgets = [],
  transactions = []
) {

  const now = new Date()

  const currentMonth =
    now.getMonth()

  const currentYear =
    now.getFullYear()

  const today =
    now.getDate()

  const daysInMonth =
    new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate()

  const risks = []

  budgets.forEach((budget) => {

    const category =
      budget.category.toLowerCase()

    const spent = transactions
      .filter((tx) => {

        const txDate =
          new Date(tx.createdAt)

        return (
          tx.type === "expense" &&
          tx.category.toLowerCase() === category &&
          txDate.getMonth() === currentMonth &&
          txDate.getFullYear() === currentYear
        )
      })
      .reduce(
        (sum, tx) =>
          sum + Number(tx.amount),
        0
      )

    const dailyAverage =
      spent / today

    const projected =
      dailyAverage * daysInMonth

    const limit =
      Number(budget.limit)

    if (projected > limit) {

      const remaining =
        limit - spent

      const daysLeft =
        Math.max(
          Math.floor(
            remaining / dailyAverage
          ),
          0
        )

      risks.push({
        category:
          budget.category,

        projected:
          Math.round(projected),

        limit,

        daysLeft,
      })
    }
  })

  return risks
}