import * as d3 from 'd3'
import { useEffect, useRef } from 'react'
import { Chart, NestedData, RawData } from '../types'
import formatData from '../utils/formatData'

type LineChartProps = {
  chart: Chart
  charts: Chart[]
  width?: number
  height?: number
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
}

export default function LinearChart({
  chart,
  charts,
  width = 700,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 60,
}: LineChartProps) {
  const formattedData = formatData(charts)

  const period = charts[0]?.period
  let samePeriod = true

  charts?.forEach((chart) => {
    if (
      JSON.stringify(chart.period[0]).slice(1, 11) !==
        JSON.stringify(period[0]).slice(1, 11) ||
      JSON.stringify(chart.period[1]).slice(1, 11) !==
        JSON.stringify(period[1]).slice(1, 11)
    )
      samePeriod = false
  })

  const multiple = charts.length > 0

  const yvalues = multiple
    ? charts?.reduce((acc: number[], chart) => {
        chart.data.forEach((i) => acc.push(i.value))
        return acc
      }, [])
    : chart.data.map((i) => i.value)

  const y = d3.scaleLinear(d3.extent(yvalues) as [number, number], [
    height - marginBottom,
    marginTop,
  ])

  // x axis function
  const xvalues = multiple
    ? charts[0].data.map((i) => i.date)
    : chart.data.map((i) => i.date)

  const x = samePeriod
    ? d3.scaleTime(d3.extent(xvalues) as [Date, Date], [
        marginLeft,
        width - marginRight,
      ])
    : d3.scaleLinear([0, xvalues.length], [marginLeft, width - marginRight])

  const color = d3.scaleOrdinal(d3.schemeCategory10)

  const tooltipRef = useRef<HTMLDivElement>(null)

  // Line function
  const line = (d3.line() as d3.Line<RawData>)
    .x((d, i) => {
      if (!samePeriod && charts.length > 0) {
        console.log(x(i))
        return x(i)
      }
      return x(d.date)
    })
    .y((d) => y(d.value))
    .curve(d3.curveBumpX)

  const gx = useRef<SVGSVGElement>(null)
  const gy = useRef<SVGSVGElement>(null)
  const path = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = d3.select(path.current)
    if (multiple) {
      svg
        .selectAll('path')
        .data(formattedData)
        .join('path')
        .attr('fill', 'none')
        .attr('stroke-width', '2')
        .attr('stroke', function (d) {
          return color(d.key)
        })
        .attr('d', function (d: NestedData) {
          return line(d.values)
        })
        .on('mouseover', (event, d) => {
          const tooltip = d3.select(tooltipRef.current)
          tooltip.transition().duration(200).style('opacity', 0.9)
          tooltip
            .html(d.key)
            .style('left', `${200}px`)
            .style('top', `${event.pageY - 200}px`)
        })
        .on('mouseout', () => {
          const tooltip = d3.select(tooltipRef.current)
          tooltip.transition().duration(500).style('opacity', 0)
        })
    } else {
      svg
        .selectAll('path')
        .data(chart.data)
        .join('path')
        .attr('stroke', 'blue')
        .attr('fill', 'none')
        .attr('stroke-width', '1.5')
        .attr('stroke', function (d) {
          return color(String(d.value))
        })
        .attr('d', line(chart.data))
    }
  }, [chart, charts, color, formattedData, line, multiple, x, y])

  const xAxis = d3.axisBottom(x).scale(x).ticks(10)
  const yAxis = d3.axisLeft(y).scale(y).ticks(10)

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
    <div className="relative">
      <svg width={width} height={height}>
        <g ref={path}></g>
        <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
        <g ref={gy} transform={`translate(${marginLeft},0)`} />
      </svg>
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          background: 'rgba(0, 0, 0, 0.7)',
          fontSize: '14px',
          color: '#fff',
          padding: '0.5rem',
          borderRadius: '4px',
          zIndex: 999,
        }}
      ></div>
    </div>
  )
}
