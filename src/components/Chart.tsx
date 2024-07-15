import * as d3 from 'd3' // we will need d3.js

type LineChartProps = {
  width: number
  height: number
  data: { x: number; y: number }[]
}

export default function Chart(({ width, height, data }: LineChartProps) {
  return (
    <div>
      <svg width={width} height={height}>
        // render axes
        // render all the <path>
      </svg>
    </div>
  );
}
