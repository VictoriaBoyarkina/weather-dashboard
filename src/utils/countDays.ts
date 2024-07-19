export function subtractDays(firstDate: Date, secondDate: Date) {
  const diffDays = Math.round(
    Math.abs(new Date(firstDate).getDate() - new Date(secondDate).getDate())
  )
  return diffDays
}

export function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
