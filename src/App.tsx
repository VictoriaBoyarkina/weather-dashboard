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
import AddButton from './components/AddButton'
import ChartsList from './components/ChartsList'
import ChartsListItem from './components/ChartsListItem'
import { addDays, subtractDays } from './utils/countDays'

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

  // Charts
  const [charts, setCharts] = useState<Chart[]>([])

  // Current chart
  const [chart, setChart] = useState<Chart | null>(null)

  // Error
  const [error, setError] = useState('')

  useEffect(
    function () {
      if (chart && chart?.dataType !== dataType) {
        setChart(null)
      }
    },
    [dataType, chart, currentPlace]
  )

  useEffect(
    function () {
      if (charts.length > 0) {
        const period = subtractDays(charts[0].period[0], charts[0].period[1])
        const endDate = addDays(startDate, period)
        setEndDate(endDate)
      }
    },
    [charts]
  )

  useEffect(() => {
    async function fetchData() {
      setError('')
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
            id: uniqid(),
            favorite: false,
          }
          setChart(chart)
        } catch {
          setError("Couldn't fetch the data")
          setChart(null)
        } finally {
          setIsloading(false)
        }
      }
    }
    fetchData()
  }, [currentPlace, startDate, endDate, dataType])

  const { saveChart, deleteChart } = useLocalStorage()

  function handleSave() {
    saveChart({ ...chart!, favorite: true })
  }

  function handleDelete() {
    setChart({ ...chart!, favorite: false })
    deleteChart(chart?.id)
  }

  function handleAdd() {
    setCharts([...charts!, chart!])
  }

  function deleteFromChart(id: string) {
    const filterdCharts = charts.filter((i) => i.id !== id)
    setCharts(filterdCharts)
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
            {error && <p>{error}</p>}
            {!currentPlace && !chart && <p>Please, choose location</p>}
            {currentPlace && chart?.data.length === 0 && (
              <p>Could find any data</p>
            )}
            {chart && chart?.data?.length !== 0 && (
              <>
                <ChartHeaders chart={chart!} />
                <div>
                  {dataType === 'temperature' && (
                    <LinearChart charts={charts} data={chart!.data} />
                  )}
                  {dataType === 'wind' && <RadialChart data={chart!.data} />}
                  {dataType === 'precipitation' && (
                    <Histogram data={chart!.data} />
                  )}
                  {charts.length > 0 && (
                    <div className="ml-[60px] mt-5 max-w-[600px]">
                      <ChartsList
                        charts={charts}
                        render={(item: Chart) => (
                          <ChartsListItem
                            deleteFromChart={deleteFromChart}
                            chart={item}
                            key={item.id}
                          />
                        )}
                      />
                    </div>
                  )}
                </div>
                <div className="flex w-full ml-[60px] gap-x-5">
                  <ExportButton chart={chart} />
                  <SaveButton onClick={chart.id ? handleDelete : handleSave}>
                    {chart.id ? 'Delete chart' : 'Save chart'}
                  </SaveButton>
                  <AddButton onClick={handleAdd}>Add to compare</AddButton>
                </div>
              </>
            )}
          </div>
        )}
      </main>
      <aside className="row-span-6 col-span-2 p-5 gap-y-7 flex flex-col items-center">
        <DateRangePicker
          disabled={charts.length > 0}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <Favorites
          render={(item: Chart) => (
            <ChartItem
              setCurrentPlace={setCurrentPlace}
              key={item.id}
              chart={item}
              setDataType={setDataType}
              setChart={setChart}
              setError={setError}
            />
          )}
        />
      </aside>
    </div>
  )
}

export default App
