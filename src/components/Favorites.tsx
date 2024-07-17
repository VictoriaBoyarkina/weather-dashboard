import { useEffect, useState } from 'react'
import { Chart } from '../types'
import ChartItem from './ChartItem'

export default function Favorites() {
  const [charts, setCharts] = useState<Chart[]>()

  useEffect(() => {
    const favoriteCharts = localStorage.getItem('favorite')
    if (favoriteCharts) setCharts(JSON.parse(favoriteCharts))
    console.log(favoriteCharts)
  }, [])

  return (
    <div className="flex w-[253px] flex-col p-4 border bg-slate-50 border-slate-300 rounded">
      <div className="w-full pb-4 px-3 border-b border-slate-300">
        <h3 className="font-semibold text-center text-lg text-blue-800">
          Favorite charts
        </h3>
      </div>
      <div className="pt-4 px-3 text-slate-600">
        {charts ? (
          <ul>
            {charts?.map((chart: Chart) => (
              <ChartItem chart={chart} key={chart.id} />
            ))}
          </ul>
        ) : (
          <p className="text-center font-xs">
            You don't have any favorite charts yet. Save one by clicking on{' '}
            <strong>Save</strong> button
          </p>
        )}
      </div>
    </div>
  )
}
