export type Place = {
  id: string
  placeName: string
  coordinates: { lat: string; lng: string }
}

export type RawData = {
  date: Date
  value: number
}
