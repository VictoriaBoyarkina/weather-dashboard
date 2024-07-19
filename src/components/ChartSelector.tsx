import DataSelectorItem from './DataSelectorItem'
import { BiLineChart } from 'react-icons/bi'
import { BiBarChart } from 'react-icons/bi'
import { BiDoughnutChart } from 'react-icons/bi'
import { ChartType } from '../types'

const dataTypes = [
  {
    label: 'Linear',
    value: 'linear',
    icon: <BiLineChart />,
  },
  {
    label: 'Histogram',
    value: 'histogram',
    icon: <BiBarChart />,
  },
  {
    label: 'Radial',
    value: 'radial',
    icon: <BiDoughnutChart />,
  },
]

interface Props {
  chartType: ChartType
  setChartType: React.Dispatch<React.SetStateAction<ChartType>>
}

export default function ChartSelector({ chartType, setChartType }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setChartType(e.target.value as ChartType)
  }

  return (
    <ul className="grid w-10/12  gap-6 md:grid-cols-3">
      {dataTypes.map((data) => (
        <DataSelectorItem
          type="chartType"
          data={data}
          key={data.label}
          selected={chartType == data.value}
          onChange={handleChange}
        />
      ))}
    </ul>
  )
}
