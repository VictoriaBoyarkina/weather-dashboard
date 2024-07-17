import * as d3 from 'd3'
import { Place, RawData } from '../types'

interface Props {
  period: [Date, Date]
  dataType: string
  place: Place
  data: RawData[]
}

export default function ExportButton({ period, dataType, place, data }: Props) {
  function handleClick() {
    const csv = d3.csvFormat(data)
    const blob = new Blob([csv], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `${place.placeName}_${period[0]}-${period[1]}_${dataType}.csv`
    link.href = url
    link.click()
  }

  return (
    <button
      type="button"
      className="py-2.5 px-5 me-2 mb-2 text-sm max-w-max font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      onClick={handleClick}
    >
      Export CSV
    </button>
  )
}
