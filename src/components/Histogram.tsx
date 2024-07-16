import * as d3 from 'd3'
import { useEffect, useRef } from 'react'
import { RawData } from '../types'

type LineChartProps = {
  data: RawData[]
  width?: number
  height?: number
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
}

export default function Histogram({
  data,
  width = 1000,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 60,
}: LineChartProps) {
  // x axis function
  const xvalues = data.map((i) => i.date)
  const x = d3.scaleTime(d3.extent(xvalues), [marginLeft, width - marginRight])

  // y axis function
  const yvalues = data.map((i) => i.value)
  const y = d3.scaleLinear(d3.extent(yvalues), [
    height - marginBottom,
    marginTop,
  ])

  console.log(data)

  // Bin the data.
  const bins = d3
    .bin()
    .thresholds(data.length)
    .value((d) => d.value)(data)

  const gx = useRef<SVGGElement>(null)
  const gy = useRef<SVGGElement>(null)
  const bar = useRef<SVGGElement>(null)

  const xAxis = d3.axisBottom().scale(x)
  const yAxis = d3.axisLeft().scale(y)

  useEffect(() => void d3.select(gx.current).call(xAxis), [xAxis])
  useEffect(() => void d3.select(gy.current).call(yAxis)[yAxis])

  console.log(bins)
  useEffect(
    () =>
      void d3
        .select(bar.current)
        .attr('fill', 'steelblue')
        .selectAll()
        .data(bins)
        .join('rect')
        .attr('x', (d) => {
          return x(d.x0) + 1
        })
        .attr('width', (d) => {
          return x(d.x1) - x(d.x0) - 1
        })
        .attr('y', (d) => {
          return y(d.length)
        })
        .attr('height', (d) => {
          return y(0) - y(d.length)
        })
        .style('fill', '#69b3a2'),

    [bins, x, y]
  )
  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <g ref={bar} />
      <g fill="white" stroke="blue" strokeWidth="1.5">
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
        ))}
      </g>
    </svg>
  )
}
