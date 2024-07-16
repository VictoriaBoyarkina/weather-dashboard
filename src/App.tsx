import { useEffect, useState } from 'react'
import SearchPlace from './components/SearchPlace'
import { Place } from './types'
import DataTypeSelector from './components/DataTypeSelector'
import DateRangePicker from './components/DateRangePicker'
import { fetchWeatherData } from './services/weatherAPI'
import Chart from './components/Chart'

const dataTypeMapping = {
  temperature: 'temperature_2m_mean',
  precipitation: 'precipitation_sum',
  wind: 'wind_speed_10m_max',
} as Record<string, string>

const units = {
  temperature: '°C',
  precipitation: 'millimeter',
  wind: 'km/h',
}

function formatData(
  dataType: string,
  response: {
    daily: Record<string, string[]>
  }
): Record<string, string>[] {
  const dates = response.daily.time
  const data = response.daily[dataTypeMapping[dataType]]

  const result = dates.map((date, index) => {
    return {
      date: new Date(date),
      value: data[index],
    }
  })
  return result
}

function App() {
  // Period
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  // Place
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null)

  // Data type
  const [dataType, setDataType] = useState<string>('temperature')

  const [isLoading, setIsloading] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      if (currentPlace) {
        setIsloading(true)
        try {
          const res = await fetchWeatherData(
            startDate,
            endDate,
            currentPlace.coordinates,
            dataType
          )
          const data = formatData(dataType, res)
          setData(data)
        } catch (e) {
          console.log(e)
        } finally {
          setIsloading(false)
        }
      }
    }
    fetchData()
  }, [currentPlace, startDate, endDate, dataType])

  return (
    <div className="grid grid-rows-5 grid-flow-col gap-4 min-h-screen bg-slate-100 font-Roboto">
      <header className="col-span-4 row-span-1  px-5">
        <div className="flex flex-col">
          <SearchPlace
            currentPlace={currentPlace}
            onSetCurrentPlace={setCurrentPlace}
          />
          <DataTypeSelector dataType={dataType} setDataType={setDataType} />
        </div>
      </header>

      <main className="row-span-4 col-span-4">
        <Chart data={data} startDate={startDate} endDate={endDate} />
      </main>
      <aside className="row-span-5 p-5 flex flex-col items-center">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </aside>
    </div>
  )
}

export default App
