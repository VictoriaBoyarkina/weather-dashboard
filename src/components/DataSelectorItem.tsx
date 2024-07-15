import { ChangeEvent, ReactNode } from 'react'

type DataType = {
  label: string
  value: string
  icon: ReactNode
}

interface Props {
  data: DataType
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  selected?: boolean
}

export default function DataSelectorItem({ data, onChange, selected }: Props) {
  return (
    <li>
      <input
        type="radio"
        id={data.value}
        name="dataType"
        value={data.value}
        className="hidden peer"
        required
        checked={selected}
        onChange={onChange}
      />
      <label
        htmlFor={data.value}
        className="inline-flex items-center justify-between w-full pb-2 pl-1 text-gray-500 border-b border-gray-300  cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-b-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <div className="flex">
          {data.label} <span className="text-2xl ml-1">{data.icon}</span>
        </div>
      </label>
    </li>
  )
}
