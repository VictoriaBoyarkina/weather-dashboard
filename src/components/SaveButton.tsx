import { Place, RawData } from '../types'
import uniqid from 'uniqid'

interface Props {
  period: [Date, Date]
  dataType: string
  place: Place
  data: RawData[]
}

export default function ExportButton({ period, dataType, place, data }: Props) {
  function handleClick() {
    const chart = {
      id: uniqid(),
      period,
      dataType,
      place,
      data,
    }
    const favoriteCharts = localStorage.getItem('favorite')
    if (favoriteCharts) {
      const array = JSON.parse(favoriteCharts)
      array.push(chart)
      localStorage.setItem('favorite', JSON.stringify(array))
    } else {
      const array = []
      array.push(chart)
      localStorage.setItem('favorite', JSON.stringify(array))
    }
  }

  return (
    <button
      onClick={handleClick}
      type="button"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      Save Chart
    </button>
  )
}
