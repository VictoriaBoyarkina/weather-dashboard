const mapBoxAPIKey = import.meta.env.VITE_MAP_BOX_API_KEY

const baseUrl = import.meta.env.VITE_MAP_BOX_BASE_URL

export const fetchPlacesData = async (value: string) => {
  const response = await fetch(
    `${baseUrl}mapbox.places/${value}.json?access_token=${mapBoxAPIKey}&types=place`
  )
  const data = await response.json()
  return data
}
