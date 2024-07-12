import { useState } from 'react'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

export default function DateRangePicker() {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  return (
    <div>
      <div>
        <p>Choose start date</p>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date as Date)}
        />
      </div>
      <div>
        <p>Choose end date</p>
        <DatePicker
          selected={startDate}
          onChange={(date) => setEndDate(date as Date)}
        />
      </div>
    </div>
  )
}
