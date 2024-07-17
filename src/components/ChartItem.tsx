import * as d3 from 'd3'
import { Chart, Data, DataType } from '../types'

interface Props {
  chart: Chart
  setData: React.Dispatch<React.SetStateAction<Data>>
  setDataType: React.Dispatch<React.SetStateAction<DataType>>
  setChartId: React.Dispatch<React.SetStateAction<string>>
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const formatTime = d3.utcFormat('%B %d, %Y')

export default function ChartItem({
  chart,
  setData,
  setDataType,
  setChartId,
}: Props) {
  const { place, period, dataType } = chart

  const [start, end] = [
    formatTime(new Date(period[0])),
    formatTime(new Date(period[1])),
  ]

  function handleClick() {
    setData(chart.data)
    setDataType(chart.dataType)
    setChartId(chart.id)
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
