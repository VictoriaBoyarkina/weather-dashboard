import * as d3 from 'd3'
import { useCallback, useEffect, useRef } from 'react'
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

export default function RadialChart({
  data,
  width = 1000,
  height = 400,
}: LineChartProps) {
  const innerRadius = (0.35 * width) / 2
  const outerRadius = (0.9 * width) / 2

  const colorDomain = () => {
    const extent = d3.extent(data, (d) => d.value),
      interpolated = d3.interpolate(...extent)

    return d3.quantize(interpolated, 7)
  }

  const color = d3.scaleLinear(
    colorDomain,
    d3.quantize(d3.interpolateSpectral, 7).reverse()
  )

  const xScale = d3.scaleBand(
    data.map((d) => d.date),
    [0, 2 * Math.PI]
  )

  const yDomain = () => {
    const min = d3.min(data, (d) => d.value),
      max = d3.max(data, (d) => d.value)

    return [min, max]
  }

  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([innerRadius, outerRadius])

  const arc = d3
    .arc()
    .innerRadius((d) => yScale(d.min))
    .outerRadius((d) => yScale(d.max))
    .startAngle((d) => xScale(d.date))
    .endAngle((d) => xScale(d.date) + xScale.bandwidth())
    .padAngle(0.01)
    .padRadius(innerRadius)

  const container = useRef<SVGGElement>(null)

  useEffect(
    () =>
      void d3
        .select(container.current)
        .selectAll('path')
        .data(data)
        .join('path')
        .style('fill', (d) => color(d.value))
        .style('stroke', (d) => color(d.value))
        .attr('d', arc),
    [arc, color, data]
  )

  const gx = useRef<SVGGElement>(null)
  const gy = useRef<SVGGElement>(null)

  const xAxis = useCallback(
    (g) =>
      g.attr('text-anchor', 'middle').call((g) =>
        g
          .selectAll('g')
          .data([
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
            'January',
            'February',
            'March',
          ])
          .join('g')
          .attr(
            'transform',
            (d, i, arr) => `
          rotate(${(i * 360) / arr.length})
          translate(${innerRadius},0)
        `
          )
          .call((g) =>
            g
              .append('line')
              .attr('x1', -5)
              .attr('x2', outerRadius - innerRadius + 10)
              .style('stroke', '#aaa')
          )
          .call((g) =>
            g
              .append('text')
              .attr('transform', (d, i, arr) =>
                ((i * 360) / arr.length) % 360 > 180
                  ? 'rotate(90)translate(0,16)'
                  : 'rotate(-90)translate(0,-9)'
              )
              .style('font-family', 'sans-serif')
              .style('font-size', 10)
              .text((d) => d)
          )
      ),
    [innerRadius, outerRadius]
  )

  const yAxis = (g) =>
    g
      .attr('text-anchor', 'middle')
      .call((g) =>
        g
          .append('text')
          .attr('text-anchor', 'end')
          .attr('x', '-0.5em')
          .attr('y', (d) => -yScale(yScale.ticks(5).pop()) - 10)
          .attr('dy', '-1em')
          .style('fill', '#1a1a1a')
          .text('Temperature (°C)')
      )
      .call((g) =>
        g
          .selectAll('g')
          .data(yScale.ticks(5))
          .join('g')
          .attr('fill', 'none')
          .call((g) =>
            g
              .append('circle')
              .style('stroke', '#aaa')
              .style('stroke-opacity', 0.5)
              .attr('r', yScale)
          )
          .call((g) =>
            g
              .append('text')
              .attr('y', (d) => -yScale(d))
              .attr('dy', '0.35em')
              .style('stroke', '#fff')
              .style('stroke-width', 5)
              .style('fill', '#1a1a1a')
              .text(yScale.tickFormat(6, 's'))
              .clone(true)
              .style('stroke', 'none')
          )
      )

  useEffect(() => void d3.select(gx.current).call(xAxis), [xAxis])
  useEffect(() => void d3.select(gy.current).call(yAxis)[yAxis])

  return (
    <svg width={width} height={height}>
      <g
        ref={container}
        className="container"
        transform={`translate(${width / 2}, ${height / 2})`}
      />
      <g ref={gx} />
      <g ref={gy} />
    </svg>
  )
}
