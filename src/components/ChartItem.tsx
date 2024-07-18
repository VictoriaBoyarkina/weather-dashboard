import * as d3 from 'd3'
import { Chart, DataType, Place } from '../types'
import capitalizeFirstLetter from '../utils/capitalize'

interface Props {
  chart: Chart
  setDataType: React.Dispatch<React.SetStateAction<DataType>>
  setChart: React.Dispatch<React.SetStateAction<Chart | null>>
  setCurrentPlace: React.Dispatch<React.SetStateAction<Place | null>>
  setEndDate: React.Dispatch<React.SetStateAction<Date>>
  setStartDate: React.Dispatch<React.SetStateAction<Date>>
}

const formatTime = d3.utcFormat('%B %d, %Y')

export default function ChartItem({
  chart,
  setDataType,
  setChart,
  setCurrentPlace,
  setStartDate,
  setEndDate,
}: Props) {
  const { place, period, dataType } = chart

  const [start, end] = [
    formatTime(new Date(period[0])),
    formatTime(new Date(period[1])),
  ]

  function handleClick() {
    // setCurrentPlace(chart.place)
    setChart(chart)
    setDataType(chart.dataType)
    // setStartDate(new Date(chart.period[0]))
    // setEndDate(new Date(chart.period[1]))
  }

  return (
    <li
      className="text-xs border p-2 border-slate-300 hover:bg-slate-100 cursor-pointer"
      onClick={handleClick}
    >
      <p>
        <strong>Location: </strong>
        {place.placeName}
      </p>
      <p>
        <strong>Period: </strong>
        {start} - {end}
      </p>
      <p>
        <strong>Data type: </strong>
        {capitalizeFirstLetter(dataType)}
      </p>
    </li>
  )
}
