import { Chart } from '../types'
import capitalizeFirstLetter from '../utils/capitalize'
import formatTime from '../utils/formateTime'
import { IoTrashBinOutline } from 'react-icons/io5'

interface Props {
  chart: Chart
  deleteFromChart: (id: string) => void
}

function ChartsListItem({ chart, deleteFromChart }: Props) {
  const { place, period, dataType, id } = chart

  const [start, end] = [
    formatTime(new Date(period[0])),
    formatTime(new Date(period[1])),
  ]

  return (
    <li>
      <div className="flex items-center">
        {place.placeName}, {start} - {end}, {capitalizeFirstLetter(dataType)}
        <span
          className="text-base ml-3 cursor-pointer hover:text-slate-800"
          onClick={() => deleteFromChart(id)}
        >
          <IoTrashBinOutline />
        </span>
      </div>
    </li>
  )
}

export default ChartsListItem
