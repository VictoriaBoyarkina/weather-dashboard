import * as d3 from 'd3'
import { Chart } from '../types'
import capitalizeFirstLetter from '../utils/capitalize'

interface Props {
  chart: Chart
}

const formatTime = d3.utcFormat('%B %d, %Y')

export default function ChartHeaders({ chart }: Props) {
  const { place, period, dataType } = chart

  const [start, end] = [
    formatTime(new Date(period[0])),
    formatTime(new Date(period[1])),
  ]

  return (
    <div>
      <p>
        <strong>Location: </strong>
        {place?.placeName}
      </p>
      <p>
        <strong>Period: </strong>
        {start} - {end}
      </p>
      <p>
        <strong>Data type: </strong>
        {capitalizeFirstLetter(dataType)}
      </p>
    </div>
  )
}
