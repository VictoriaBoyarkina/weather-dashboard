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
  const xvalues = data.map((i) => i.date)
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(xvalues) as [Date, Date])
    .range([marginLeft, width - marginRight])

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value) || 0])
    .range([height - marginBottom, marginTop])

  // Adjust binning to make sure each bin covers a full day
  const bins = d3
    .bin<RawData, Date>()
    .value((d) => d.date)
    .thresholds(
      d3.timeDay.range(
        d3.min(data, (d) => d.date)!,
        new Date(d3.max(data, (d) => d.date)!.getTime() + 24 * 60 * 60 * 1000)
      )
    )(
    // Ensure full days are covered
    data
  )

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
    if (gy.current) {
      d3.select(gy.current).call(yAxis)
    }
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
          console.log('x:', xPos)
          return xPos
        })
        .attr('width', (d) => {
          const width = Math.max(0, xScale(d.x1!) - xScale(d.x0!) - 1)
          console.log('width:', width)
          return width
        })
        .attr('y', (d) => {
          const yPos = yScale(d.length)
          console.log('y:', yPos)
          return yPos
        })
        .attr('height', (d) => {
          const height = Math.max(0, yScale(0) - yScale(d.length))
          console.log('height:', height)
          return height
        })
        .attr('fill', '#69b3a2')
    }
  }, [bins, xScale, yScale])

  useEffect(() => {
    console.log('Bins:', bins)
    bins.forEach((bin) => {
      console.log('Bin:', bin)
      console.log('x0:', bin.x0, 'x1:', bin.x1)
      console.log(
        'xScale(x0):',
        xScale(bin.x0!),
        'xScale(x1):',
        xScale(bin.x1!)
      )
    })
  }, [bins])

  useEffect(() => {
    console.log('xScale domain:', xScale.domain())
    console.log('xScale range:', xScale.range())
    console.log('yScale domain:', yScale.domain())
    console.log('yScale range:', yScale.range())
  }, [xScale, yScale])

  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <g ref={barsRef} />
    </svg>
  )
}
