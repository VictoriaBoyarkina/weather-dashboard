
import { Chart, DataType, Place } from '../types'
import capitalizeFirstLetter from '../utils/capitalize'
import formatTime from '../utils/formateTime'

interface Props {
  chart: Chart
  setDataType: React.Dispatch<React.SetStateAction<DataType>>
  setChart: React.Dispatch<React.SetStateAction<Chart | null>>
  setCurrentPlace: React.Dispatch<React.SetStateAction<Place | null>>
  setError: React.Dispatch<React.SetStateAction<string>>
}



export default function ChartItem({
  chart,
  setDataType,
  setChart,
  setCurrentPlace,
  setError,
}: Props) {
  const { place, period, dataType } = chart

  const [start, end] = [
    formatTime(new Date(period[0])),
    formatTime(new Date(period[1])),
  ]

  function handleClick() {
    setCurrentPlace(null)
    setChart(chart)
    setDataType(chart.dataType)
    setError('')
  }

  return (
    <li
      className="text-sm border p-2 border-slate-300 hover:bg-slate-100 cursor-pointer"
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
