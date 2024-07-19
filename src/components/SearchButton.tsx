import { ReactNode } from 'react'

interface Props {
  onClick: () => void
  children: ReactNode
}

export default function SearchButton({ onClick, children }: Props) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="max-w-24  w-full  text-gray-500 border-b border-gray-300 cursor-pointer hover:border-b-blue-600 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      {children}
    </button>
  )
}
