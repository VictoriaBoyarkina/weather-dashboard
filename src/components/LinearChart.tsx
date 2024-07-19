import * as d3 from 'd3'
import { useEffect, useRef } from 'react'
import { Chart, RawData } from '../types'
import formatTime from '../utils/formateTime'

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

type Data = {
  key: string
  values: RawData[]
}

function formatData(data: Chart[]) {
  const formattedData = data.reduce((acc: Data[], chart) => {
    const key = `Location: ${chart.place.placeName}, Period: ${formatTime(
      new Date(chart.period[0])
    )} - ${formatTime(new Date(chart.period[1]))}`
    const obj = {
      key: key,
      values: chart.data,
    }
    acc.push(obj)
    return acc
  }, [])
  return formattedData
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

  const multiple =
    charts.length > 1 && chart.id === charts[charts.length - 1].id

  console.log(chart)
  console.log(charts[charts.length - 1])

  console.log(multiple)

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
  const xvalues = chart.data.map((i) => i.date)
  const x = d3.scaleTime(d3.extent(xvalues) as [Date, Date], [
    marginLeft,
    width - marginRight,
  ])

  const color = d3.scaleOrdinal(d3.schemeCategory10)

  const tooltipRef = useRef<HTMLDivElement>(null)

  // Line function
  const line = (d3.line() as d3.Line<RawData>)
    .x((d) => x(d.date))
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
        .attr('d', function (d: Data) {
          return line(d.values)
        })
        .on('mouseover', (event, d) => {
          const tooltip = d3.select(tooltipRef.current)
          tooltip.transition().duration(200).style('opacity', 0.9)
          tooltip
            .html(d.key)
            .style('left', `${200}px`)
            .style('top', `${event.pageY - 400}px`)
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
