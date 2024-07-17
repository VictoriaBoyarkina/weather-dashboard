export type Place = {
  id: string
  placeName: string
  coordinates: { lat: string; lng: string }
}

export type RawData = {
  date: Date
  value: number
}

export type Chart = {
  id: string
  period: [Date, Date]
  dataType: 'temperature' | 'wind' | 'precipitation'
  place: Place
  data: RawData[]
}
