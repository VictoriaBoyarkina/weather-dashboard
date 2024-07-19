import * as d3 from 'd3'
import { useEffect, useRef } from 'react'
import { Chart, RawData } from '../types'

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

export default function Histogram({
  chart,
  charts,
  width = 800,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 60,
}: LineChartProps) {
  console.log(charts)
  console.log(chart)
  // const formattedData = formatData(charts)

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

  const y = d3.scaleLinear([0, d3.max(yvalues)] as [number, number], [
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

  function getBins(chartData: Chart) {
    return d3
      .bin<RawData, Date>()
      .value((d) => d.date)
      .thresholds(
        d3.timeDays(
          d3.min(chartData.data, (d) => d.date)!,
          d3.max(chartData.data, (d) => d.date)!
        )
      )(chartData.data)
  }

  const gx = useRef<SVGGElement>(null)
  const gy = useRef<SVGGElement>(null)
  const barsRef = useRef<SVGGElement>(null)

  const xAxis = d3.axisBottom<Date>(x)
  const yAxis = d3.axisLeft<number>(y)

  const color = d3.scaleOrdinal(d3.schemeCategory10)

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

      if (charts.length < 2)
        svgBars
          .selectAll('rect')
          .data(getBins(chart))
          .join('rect')
          .attr('x', (d) => {
            const xPos = x(d.x0!)

            return xPos
          })
          .attr('width', (d) => {
            const width = Math.max(0, x(d.x1!) - x(d.x0!) - 1)
            return width
          })
          .attr('y', (d) => {
            const yPos = y(d[0]?.value) || 0
            return yPos
          })
          .attr('height', (d) => {
            const height = y(d[0]?.value)
              ? Math.max(0, y(0) - y(d[0]?.value))
              : 0
            return height
          })
          .attr('fill', '#378ace88')

      if (charts.length > 0) {
        charts.map((chart, i) => {
          return svgBars
            .selectAll(`rect${i}`)
            .data(getBins(chart))
            .join(`rect${i}`)
            .attr('x', (d) => {
              const xPos = x(d.x0!)
              return xPos
            })
            .attr('width', (d) => {
              const width = Math.max(0, x(d.x1!) - x(d.x0!) - 1)
              return width
            })
            .attr('y', (d) => {
              const yPos = y(d[0]?.value) || 0
              return yPos
            })
            .attr('height', (d) => {
              const height = y(d[0]?.value)
                ? Math.max(0, y(0) - y(d[0]?.value))
                : 0
              return height
            })
            .attr('fill', color(chart.id))
        })
      }
    }
  }, [chart, charts, color, x, y])

  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      <g ref={barsRef} />
    </svg>
  )
}
