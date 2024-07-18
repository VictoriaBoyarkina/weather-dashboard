import { Chart } from '../types'
import { useLocalStorage } from '../context/LocalStorageProvider'

interface Props {
  render: (item: Chart) => React.ReactNode
}

export default function Favorites({ render }: Props) {
  const { charts } = useLocalStorage()

  return (
    <div className="flex max-w-2xl flex-col p-4 border bg-slate-50 border-slate-300 rounded">
      <div className="w-full pb-4  border-b border-slate-300">
        <h3 className="font-semibold text-center text-lg text-blue-800">
          Favorite charts
        </h3>
      </div>
      <div className="pt-4  text-slate-600">
        {charts.length ? (
          <ul className="flex flex-col  gap-y-3 overflow-y-auto max-h-[600px] px-1">
            {charts?.map(render)}
          </ul>
        ) : (
          <p className="text-center text-xs">
            You don't have any favorite charts yet. Save one by clicking on{' '}
            <strong>Save</strong> button
          </p>
        )}
      </div>
    </div>
  )
}
