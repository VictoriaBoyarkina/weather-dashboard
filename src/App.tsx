import { useEffect, useState } from 'react'
import SearchPlace from './components/SearchPlace'
import { Place, RawData } from './types'
import DataTypeSelector from './components/DataTypeSelector'
import DateRangePicker from './components/DateRangePicker'
import { fetchWeatherData } from './services/weatherAPI'
import LinearChart from './components/LinearChart'
import Histogram from './components/Histogram'
import RadialChart from './components/RadialChart'
import ExportButton from './components/ExportButton'
import Loader from './components/Loader'
import SaveButton from './components/SaveButton'
import Favorites from './components/Favorites'

const dataTypeMapping = {
  temperature: 'temperature_2m_mean',
  precipitation: 'precipitation_sum',
  wind: 'wind_speed_10m_max',
} as Record<string, string>

// const units = {
//   temperature: '°C',
//   precipitation: 'millimeter',
//   wind: 'km/h',
// }

function formatData(
  dataType: string,
  response: {
    daily: Record<string, string[]>
  }
): RawData[] {
  const dates = response.daily.time
  const data = response.daily[dataTypeMapping[dataType]]

  const result = dates.reduce((acc: RawData[], date, index) => {
    if (data[index])
      acc.push({
        date: new Date(date),
        value: Number(data[index]),
      })
    return acc
  }, [])
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
  const [data, setData] = useState<RawData[]>()

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
    <div className="grid grid-rows-5 grid-cols-6 grid-flow-col gap-4 min-h-screen bg-slate-100 font-Roboto">
      <header className="row-span-1 col-span-4 px-5">
        <div className="flex flex-col">
          <SearchPlace
            currentPlace={currentPlace}
            onSetCurrentPlace={setCurrentPlace}
          />
          <DataTypeSelector dataType={dataType} setDataType={setDataType} />
        </div>
      </header>

      <main className="row-span-4 col-span-4 px-5 text-slate-500">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="flex flex-col gap-y-6">
            {data && data.length === 0 && <p>Could find any data</p>}
            {data && data.length !== 0 && dataType === 'temperature' && (
              <LinearChart data={data} />
            )}
            {data && data.length !== 0 && dataType === 'wind' && (
              <RadialChart data={data} />
            )}
            {data && data.length !== 0 && dataType === 'precipitation' && (
              <Histogram data={data} />
            )}
            {data && data.length && (
              <div className="flex w-full ml-[60px] gap-x-5">
                <ExportButton
                  data={data}
                  dataType={dataType}
                  period={[startDate, endDate]}
                  place={currentPlace!}
                />
                <SaveButton
                  data={data}
                  dataType={dataType}
                  period={[startDate, endDate]}
                  place={currentPlace!}
                />
              </div>
            )}
          </div>
        )}
      </main>
      <aside className="row-span-5 col-span-2 p-5 gap-y-7 flex flex-col items-center">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <Favorites />
      </aside>
    </div>
  )
}

export default App
