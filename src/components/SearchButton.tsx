import { ReactNode } from 'react'
import Loader from './Loader'

interface Props {
  onClick: () => void
  children: ReactNode
  isLoading: boolean
}

export default function SearchButton({ onClick, children, isLoading }: Props) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex gap-x-2 items-center justify-center max-w-24 py-1.5  min-w-32  text-gray-500 border rounded-md border-gray-300 cursor-pointer hover:border-blue-600 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      {isLoading && <Loader />}
      {children}
    </button>
  )
}
