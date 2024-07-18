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
  width = 800,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 60,
}: LineChartProps) {
  const xvalues = data.map((i) => i.date)
  const xScale = d3
    .scaleTime()
    .domain([d3.min(xvalues) as Date, d3.max(xvalues) as Date])
    .range([marginLeft, width - marginRight])

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value + 1) || 0])
    .range([height - marginBottom, marginTop])

  // Bin the data by day correctly
  const bins = d3
    .bin<RawData, Date>()
    .value((d) => d.date)
    .thresholds(
      d3.timeDays(d3.min(data, (d) => d.date)!, d3.max(data, (d) => d.date)!)
    )(data)

  const gx = useRef<SVGGElement>(null)
  const gy = useRef<SVGGElement>(null)
  const barsRef = useRef<SVGGElement>(null)

  const xAxis = d3.axisBottom<Date>(xScale)
  const yAxis = d3.axisLeft<number>(yScale)

  useEffect(() => {
    if (gx.current) {
      d3.select(gx.current).call(xAxis)
    }
  }, [xAxis])

  useEffect(() => {
    const gyElement = d3.select(gy.current as SVGGElement)
    gyElement.selectAll('*').remove()
    gyElement
      .call(yAxis)
      .call((g) =>
        g
          .append('text')
          .attr('x', -30)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text('Precipitation (millimeter)')
      )
  }, [yAxis])

  useEffect(() => {
    if (barsRef.current) {
      const svgBars = d3.select(barsRef.current)

      svgBars
        .selectAll('rect')
        .data(bins)
        .join('rect')
        .attr('x', (d) => {
          const xPos = xScale(d.x0!)
          return xPos
        })
        .attr('width', (d) => {
          const width = Math.max(0, xScale(d.x1!) - xScale(d.x0!) - 1)
          return width
        })
        .attr('y', (d) => {
          const yPos = yScale(d[0]?.value) || 0
          return yPos
        })
        .attr('height', (d) => {
          const height = yScale(d[0]?.value)
            ? Math.max(0, yScale(0) - yScale(d[0]?.value))
            : 0

          return height
        })
        .attr('fill', '#378ace88')
    }
  }, [bins, xScale, yScale])

  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <g ref={barsRef} />
    </svg>
  )
}
