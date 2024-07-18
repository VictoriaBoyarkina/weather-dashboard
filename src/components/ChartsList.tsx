import { ReactNode } from 'react'
import { Chart } from '../types'

interface Props {
  charts: Chart[]
  render: (chart: Chart) => ReactNode
}

function ChartsList({ charts, render }: Props) {
  return <ul className=''>{charts.map(render)}</ul>
}

export default ChartsList
