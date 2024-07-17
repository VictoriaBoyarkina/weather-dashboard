import * as d3 from 'd3'
import { Chart } from '../types'

interface Props {
  chart: Chart
}

const formatTime = d3.utcFormat('%B %d, %Y')

export default function ChartItem({ chart }: Props) {
  const { place, period, dataType } = chart

  const [start, end] = [formatTime(period[0]), formatTime(period[1])]

  return (
    <li>
      <p>{place.placeName}</p>
      <p>
        Period: {start} - {end}
      </p>
      <p>{dataType}</p>
    </li>
  )
}
