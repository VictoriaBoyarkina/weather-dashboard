const API_KEY = 'b12d5ffcb958f9900ac68c6cda8dfb7a'

const BASE_URL = 'https://api.openweathermap.org/data/2.5/'

export const fetchWeatherData = async (startDate: Date, endDate) => {
  const response = await fetch(
    `${BASE_URL}onecall/timemachine?start=${startDate}&end=${endDate}&appid=${API_KEY}`
  )
  const data = await response.json()
  return data
}
