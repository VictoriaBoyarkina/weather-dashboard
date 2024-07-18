import * as d3 from 'd3'
import { useEffect, useRef } from 'react'
import { Chart, RawData } from '../types'

type LineChartProps = {
  data: RawData[]
  charts: Chart[]
  width?: number
  height?: number
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
}

export default function LinearChart({
  data,
  charts,
  width = 800,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 60,
}: LineChartProps) {
  if (charts?.length > 0) {
    const yvalues = charts.reduce((acc: number[], chart) => {
      chart.data.forEach((i) => acc.push(i.value))
      return acc
    }, [])

    const y = d3.scaleLinear(d3.extent(yvalues) as [number, number], [
      height - marginBottom,
      marginTop,
    ])

    // Line function
    const line = d3.line() as d3.Line<RawData>
    line.x((d) => x(d.date))
    line.y((d) => y(d.value))
    console.log(yvalues)
  }
  
  // x axis function
  const xvalues = data.map((i) => i.date)
  const x = d3.scaleTime(d3.extent(xvalues) as [Date, Date], [
    marginLeft,
    width - marginRight,
  ])

  // y axis function
  const yvalues = data.map((i) => i.value)
  const y = d3.scaleLinear(d3.extent(yvalues) as [number, number], [
    height - marginBottom,
    marginTop,
  ])

  // Line function
  const line = d3.line() as d3.Line<RawData>
  line.x((d) => x(d.date))
  line.y((d) => y(d.value))

  const gx = useRef<SVGSVGElement>(null)
  const gy = useRef<SVGSVGElement>(null)

  const xAxis = d3.axisBottom(x).scale(x)
  const yAxis = d3.axisLeft(y).scale(y)

  useEffect(
    () => void d3.select(gx.current as SVGSVGElement).call(xAxis),
    [xAxis]
  )
  useEffect(
    () => void d3.select(gy.current as SVGSVGElement).call(yAxis),
    [yAxis]
  )

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
      <path
        fill="none"
        stroke="blue"
        strokeWidth="1.5"
        d={line(data) as string}
      />
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
    </svg>
  )
}
