import { Chart, NestedData } from '../types'
import formatTime from './formateTime'

export default function formatData(data: Chart[]) {
  const formattedData = data.reduce((acc: NestedData[], chart) => {
    const key = `Location: ${chart.place.placeName}, Period: ${formatTime(
      new Date(chart.period[0])
    )} - ${formatTime(new Date(chart.period[1]))}`
    const obj = {
      key: key,
      values: chart.data,
    }
    acc.push(obj)
    return acc
  }, [])
  return formattedData
}
