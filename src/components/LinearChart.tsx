import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

type RawData = {
  date: number
  value: number
}

type LineChartProps = {
  data: RawData[]
  width?: number
  height?: number
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
}

export default function LinearChart({
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
  console.log(d3.extent(xvalues))
  const x = d3.scaleTime(d3.extent(xvalues), [marginLeft, width - marginRight])

  // y axis function
  const yvalues = data.map((i) => i.value)
  const y = d3.scaleLinear(d3.extent(yvalues), [
    height - marginBottom,
    marginTop,
  ])

  // Line function
  const line = d3
    .line()
    .x((d: RawData) => x(d.date))
    .y((d: RawData) => y(d.value))

  const gx = useRef<SVGGElement>(null)
  const gy = useRef<SVGGElement>(null)

  const xAxis = d3.axisBottom().scale(x)
  const yAxis = d3.axisLeft().scale(y)

  useEffect(() => void d3.select(gx.current).call(xAxis), [xAxis])
  useEffect(() => void d3.select(gy.current).call(yAxis)[yAxis])

  useEffect(
    () =>
      void d3
        .select(gy.current)
        .call((g) =>
          g
            .append('text')
            .attr('x', -30)
            .attr('y', 10)
            .attr('fill', 'currentColor')
            .attr('text-anchor', 'start')
            .text('Temperature (°C)')
        ),
    []
  )
  return (
    <svg width={width} height={height}>
      <path fill="none" stroke="blue" strokeWidth="1.5" d={line(data)} />
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <g fill="white" stroke="blue" strokeWidth="1.5">
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
        ))}
      </g>
    </svg>
  )
}
