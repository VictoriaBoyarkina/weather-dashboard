/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react'
import { fetchPlacesData } from '../services/locationApi'

type Place = {
  id: string
  placeName: string
}

function transformData(data: any) {
  return {
    id: (data.id as string) || null,
    placeName: (data.place_name as string) || null,
    coordinates: {
      lat: (data.center[1] as number) || null,
      lng: (data.center[0] as number) || null,
    },
  }
}

export default function usePlaces() {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<Place[]>([])
  const [error, setError] = useState('')

  const getSearchResults = useRef<(value: string) => Promise<void>>()

  const clearTimerRef = useRef<number>()

  getSearchResults.current = async function (value: string) {
    clearInterval(clearTimerRef.current)
    setIsLoading(true)
    clearTimerRef.current = setTimeout(async () => {
      try {
        const result = await fetchPlacesData(value)
        const transformedData = result.features.map((obj: any) =>
          transformData(obj)
        )
        console.log(result)
        setData(transformedData)
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }

  return { isLoading, data, error, getSearchResults }
}
