export function subtractDays(firstDate: Date, secondDate: Date) {
  const oneDay = 24 * 60 * 60 * 1000
  const diffDays = Math.round(
    Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay)
  )
  return diffDays
}

export function addDays(date: Date, days: number) {
  var result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
