import { useRef, useState } from 'react'
import { fetchPlacesData } from '../services/locationApi'

export default function usePlaces() {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [error, setError] = useState('')

  const getSearchResults = useRef<(value: string) => Promise<void>>()

  const clearTimerRef = useRef<number>()

  getSearchResults.current = async function (value: string) {
    clearInterval(clearTimerRef.current)
    setIsLoading(true)
    clearTimerRef.current = setTimeout(async () => {
      try {
        const result = await fetchPlacesData(value)
        setData(result.features)
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }

  return { isLoading, data, error, getSearchResults }
}
