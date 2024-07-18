import { useEffect, useState } from 'react'
import SearchPlace from './components/SearchPlace'
import { Chart, DataType, Place, RawData } from './types'
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
import ChartItem from './components/ChartItem'
import { useLocalStorage } from './context/LocalStorageProvider'
import uniqid from 'uniqid'

import ChartHeaders from './components/ChartHeaders'

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
  dataType: DataType,
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
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState(new Date())

  // Place
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null)

  // Data type
  const [dataType, setDataType] = useState<DataType>('temperature')

  // Loading
  const [isLoading, setIsloading] = useState(false)

  // Current chart
  const [chart, setChart] = useState<Chart | null>(null)

  useEffect(
    function () {
      if (chart && chart?.dataType !== dataType) {
        setChart(null)
      }
    },
    [dataType, chart, currentPlace]
  )

  console.log(chart)

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
          const chart = {
            period: [startDate, endDate] as [Date, Date],
            dataType,
            place: currentPlace!,
            data,
          }
          setChart(chart)
        } catch (e) {
          console.log(e)
        } finally {
          setIsloading(false)
        }
      }
    }
    fetchData()
  }, [currentPlace, startDate, endDate, dataType])

  const { saveChart, deleteChart } = useLocalStorage()

  function handleSave() {
    chart!.id = uniqid()
    saveChart(chart!)
  }

  function handleDelete() {
    deleteChart(chart?.id)
  }

  return (
    <div className="grid grid-rows-6 grid-cols-6 grid-flow-col gap-4 min-h-screen bg-slate-100 font-Roboto">
      <header className="row-span-1 col-span-4 px-5">
        <div className="flex flex-col">
          <SearchPlace
            currentPlace={currentPlace}
            onSetCurrentPlace={setCurrentPlace}
            chart={chart}
          />
          <DataTypeSelector dataType={dataType} setDataType={setDataType} />
        </div>
      </header>

      <main className="row-span-5 col-span-4 px-5 text-slate-500">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="flex flex-col gap-y-6">
            {!currentPlace && !chart && <p>Please, choose location</p>}
            {currentPlace && chart?.data.length === 0 && (
              <p>Could find any data</p>
            )}
            {chart && chart?.data?.length !== 0 && (
              <>
                <ChartHeaders chart={chart!} />
                <>
                  {dataType === 'temperature' && (
                    <LinearChart data={chart!.data} />
                  )}
                  {dataType === 'wind' && (
                    <RadialChart data={chart!.data} />
                  )}
                  {dataType === 'precipitation' && (
                    <Histogram data={chart!.data} />
                  )}
                </>
                <div className="flex w-full ml-[60px] gap-x-5">
                  <ExportButton
                    data={chart!.data}
                    dataType={dataType}
                    period={[startDate, endDate]}
                    place={currentPlace!}
                  />
                  <SaveButton onClick={chart.id ? handleDelete : handleSave}>
                    {chart.id ? 'Delete chart' : 'Save chart'}
                  </SaveButton>
                </div>
              </>
            )}
          </div>
        )}
      </main>
      <aside className="row-span-6 col-span-2 p-5 gap-y-7 flex flex-col items-center">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <Favorites
          render={(item: Chart) => (
            <ChartItem
              setCurrentPlace={setCurrentPlace}
              setEndDate={setEndDate}
              setStartDate={setStartDate}
              key={item.id}
              chart={item}
              setDataType={setDataType}
              setChart={setChart}
            />
          )}
        />
      </aside>
    </div>
  )
}

export default App
