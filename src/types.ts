export type Place = {
  id: string
  placeName: string
  coordinates: { lat: string; lng: string }
}

export type RawData = {
  date: Date
  value: number
}

export type Data = {
  data: RawData[]
  favourite: boolean
}

export type Chart = {
  id: string
  period: [Date, Date]
  dataType: DataType
  place: Place
  data: Data
}

export type DataType = 'temperature' | 'wind' | 'precipitation'
