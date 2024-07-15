import DataSelectorItem from './DataSelectorItem'
import { WiStrongWind } from 'react-icons/wi'
import { WiRain } from 'react-icons/wi'
import { WiThermometer } from 'react-icons/wi'

const dataTypes = [
  {
    label: 'Temperature',
    value: 'temperature',
    icon: <WiThermometer />,
  },
  {
    label: 'Precipitation',
    value: 'precipitation',
    icon: <WiRain />,
  },
  {
    label: 'Wind',
    value: 'wind',
    icon: <WiStrongWind />,
  },
]

interface Props {
  dataType: string
  setDataType: React.Dispatch<React.SetStateAction<string>>
}

export default function DataTypeSelector({ dataType, setDataType }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDataType(e.target.value)
  }

  return (
    <ul className="grid w-10/12  gap-6 md:grid-cols-3">
      {dataTypes.map((data) => (
        <DataSelectorItem
          data={data}
          key={data.label}
          selected={dataType == data.value}
          onChange={handleChange}
        />
      ))}
    </ul>
  )
}
