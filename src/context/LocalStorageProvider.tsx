import toast from 'react-hot-toast'
import { Chart } from '../types'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

interface Props {
  children: ReactNode
}

interface LocalStorageContextInterface {
  charts: Chart[]
  saveChart(chart: Chart): void
  deleteChart(id?: string): void
}

const LocalStorageContext = createContext<LocalStorageContextInterface | null>(
  null
)

export default function LocalStorageProvider({ children }: Props) {
  const [charts, setCharts] = useState<Chart[]>([])

  // localStorage.clear()

  useEffect(() => {
    const favoriteCharts = localStorage.getItem('favorite')
    if (favoriteCharts) {
      const array = JSON.parse(favoriteCharts)
      array.forEach((chart: Chart) =>
        chart.data.forEach((i) => (i.date = new Date(i.date)))
      )
      setCharts(array)
    }
  }, [setCharts])

  function saveChart(chart: Chart) {
    const favoriteCharts = localStorage.getItem('favorite')
    const array = favoriteCharts ? JSON.parse(favoriteCharts) : []
    const duplicate = array.find((item: Chart[]) => {
      const newItem = { ...item, id: '', favorite: '' }
      const newChart = { ...chart, id: '', favorite: '' }
      return JSON.stringify(newItem) === JSON.stringify(newChart)
    })
    if (duplicate) {
      toast('This chart has already been added to favorites', {
        style: {
          border: '1px solid #1847ad',
          padding: '6px',
          color: '#1847ad',
          textAlign: 'center',
        },
      })
      return
    }
    array.push(chart)
    localStorage.setItem('favorite', JSON.stringify(array))
    array.forEach((chart: Chart) =>
      chart.data.forEach((i) => (i.date = new Date(i.date)))
    )

    setCharts(array)
  }

  function deleteChart(id: string) {
    const favoriteCharts = localStorage.getItem('favorite')
    const array = JSON.parse(favoriteCharts!)
    const filtredCharts = array.filter((chart: Chart) => chart.id !== id)
    localStorage.setItem('favorite', JSON.stringify(filtredCharts))
    filtredCharts.forEach((chart: Chart) =>
      chart.data.forEach((i) => (i.date = new Date(i.date)))
    )
    setCharts(filtredCharts)
  }

  return (
    <LocalStorageContext.Provider value={{ charts, saveChart, deleteChart }}>
      {children}
    </LocalStorageContext.Provider>
  )
}

function useLocalStorage() {
  const context = useContext(LocalStorageContext)
  if (!context)
    throw new Error("You're trying to use LocalStorageContext outside provider")

  return context
}

export { useLocalStorage }
