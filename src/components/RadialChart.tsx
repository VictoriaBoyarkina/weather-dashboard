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
  height = 600,
}: LineChartProps) {
  console.log(data)
  const innerRadius = (0.2 * width) / 2
  const outerRadius = (0.5 * width) / 2

  const getColorDomain = () => {
    const extent = d3.extent(data, (d) => d.value),
      interpolated = d3.interpolate(...extent)

    return d3.quantize(interpolated, 7)
  }

  const colorDomain = getColorDomain()

  const color = d3.scaleLinear(
    colorDomain,
    d3.quantize(d3.interpolateSpectral, 7).reverse()
  )

  const xScale = d3.scaleBand(
    data.map((d) => d.date),
    [0, 2 * Math.PI]
  )

  const getYDomain = () => {
    const min = d3.min(data, (d) => d.value),
      max = d3.max(data, (d) => d.value) + 5
      console.log(max)
    return [min, max]
  }

  const yDomain = getYDomain()

  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([innerRadius, outerRadius])

  const arc = d3
    .arc<RawData>()
    .innerRadius(innerRadius)
    .outerRadius((d) => yScale(d.value))
    .startAngle((d) => xScale(d.date)!)
    .endAngle((d) => xScale(d.date)! + xScale.bandwidth())
    .padAngle(0.05)
    .padRadius(innerRadius)

  const container = useRef<SVGGElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  
  const dateFormatter = d3.timeFormat('%b %d')

  useEffect(() => {
    const svg = d3.select(container.current)
    svg.selectAll('*').remove()

    svg
      .selectAll('path')
      .data(data)
      .join('path')
      .style('fill', (d) => color(d.value))
      .style('stroke', (d) => color(d.value))
      .attr('d', arc)
      .on('mouseover', (event, d) => {
        const tooltip = d3.select(tooltipRef.current)
        tooltip.transition().duration(200).style('opacity', 0.9)
        tooltip
          .html(
            `<strong>Date:</strong> ${
              dateFormatter(d.date)
            }<br><strong>Value:</strong> ${d.value}`
          )
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY - 120}px`)
      })
      .on('mouseout', () => {
        const tooltip = d3.select(tooltipRef.current)
        tooltip.transition().duration(500).style('opacity', 0)
      })
  }, [arc, color, data])

  const gx = useRef<SVGGElement>(null)
  const gy = useRef<SVGGElement>(null)


  const xAxis = useCallback(
    (g) =>
      g.attr('text-anchor', 'middle').call((g) =>
        g
          //   .selectAll('g')
          //   .data(data.map((d) => dateFormatter(d.date)))
          //   .join('g')
          //   .attr(
          //     'transform',
          //     (d, i, arr) => `
          //   rotate(${(i * 360) / arr.length})
          //   translate(${innerRadius},-5)
          // `
          //   )
          // .call((g) =>
          //   g
          //     .append('line')
          //     .attr('x1', -5)
          //     .attr('x2', outerRadius - innerRadius + 10)
          //     .style('stroke', '#aaa')
          // )
          .call((g) =>
            g
              .append('text')
              .style('font-family', 'sans-serif')
              .style('font-size', 10)
              .text((d) => d)
              .attr(
                'transform',
                (d, i, arr) => `
              translate(${-20}, -5)
            `
              )
          )
      ),
    [innerRadius, outerRadius, data]
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
          .text('Wind km/h')
          .attr('transform', `translate(40,0)`)
          .style('font-family', 'sans-serif')
          .style('font-size', 14)
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
              .style('font-family', 'sans-serif')
              .style('font-size', 12)
              .attr('r', yScale)
          )
          .call((g) =>
            g
              .append('text')
              .attr('y', (d) => -yScale(d))
              .attr('dy', '0.35em')
              .style('stroke-width', 5)
              .style('font-size', 10)
              .style('fill', '#1a1a1a')
              .text(yScale.tickFormat(6, 's'))
              .clone(true)
              .style('stroke', 'none')
          )
      )

  useEffect(() => {
    const gxElement = d3.select(gx.current)
    gxElement.selectAll('*').remove() // Clear previous x axis elements
    gxElement
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .call(xAxis)
  }, [xAxis])

  useEffect(() => {
    const gyElement = d3.select(gy.current)
    gyElement.selectAll('*').remove() // Clear previous y axis elements
    gyElement
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .call(yAxis)
  }, [yAxis])

  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height}>
        <g
          ref={container}
          className="container"
          transform={`translate(${width / 2}, ${height / 2})`}
        />
        <g ref={gx} />
        <g ref={gy} />
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
      />
    </div>
  )
}
