const formatDate = (date: Date) => date.toISOString().split('T')[0]

const dataTypeMapping = {
  temperature: 'temperature_2m_mean',
  precipitation: 'precipitation_sum',
  wind: 'wind_speed_10m_max',
} as Record<string, string>

const baseUrl = import.meta.env.VITE_OPEN_METEO_URL

export const fetchWeatherData = async (
  startDate: Date,
  endDate: Date,
  coordinates: {
    lat: string
    lng: string
  },
  dataType: string
) => {
  const formattedStartDate = formatDate(startDate)
  const formattedEndDate = formatDate(endDate)
  const queryData = dataTypeMapping[dataType]

  const response = await fetch(
    `${baseUrl}archive?latitude=${coordinates.lat}&longitude=${coordinates.lng}&start_date=${formattedStartDate}&end_date=${formattedEndDate}&daily=${queryData}&timezone=Europe%2FMoscow`
  )
  const data = await response.json()
  return data
}
