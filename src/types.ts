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
  dataType: DataType
  place: Place
  data: RawData[]
  favorite: boolean
}

export type DataType = 'temperature' | 'wind' | 'precipitation'

export type ChartType = 'linear' | 'histogram' | 'radial'

export type NestedData = {
  key: string
  values: RawData[]
}
