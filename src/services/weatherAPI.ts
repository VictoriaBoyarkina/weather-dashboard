const apiKey = import.meta.env.VITE_OPEN_MAP_API_KEY

const baseUrl = import.meta.env.VITE_OPEN_MAP_BASE_URL

export const fetchWeatherData = async (startDate: Date, endDate: Date) => {
  const response = await fetch(
    `${baseUrl}onecall/timemachine?start=${startDate}&end=${endDate}&appid=${apiKey}`
  )
  const data = await response.json()
  return data
}
