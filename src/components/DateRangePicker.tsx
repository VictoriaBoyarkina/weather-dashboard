import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import 'react-datepicker/dist/react-datepicker.css'

interface Props {
  startDate: Date
  endDate: Date
  setStartDate: React.Dispatch<React.SetStateAction<Date>>
  setEndDate: React.Dispatch<React.SetStateAction<Date>>
}

export default function DateRangePicker({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: Props) {
  return (
    <div className="flex flex-col gap-4 items-center p-5 border bg-slate-50 border-slate-300 rounded">
      {/* <h4 className="font-semibold text-xl text-zinc-600">Select the period</h4> */}
      <div>
        <p className="text-zinc-500 mb-1">Select start date </p>
        <DatePicker
          wrapperClassName="datePicker"
          selected={startDate}
          onChange={(date) => setStartDate(date as Date)}
        />
      </div>
      <div>
        <p className="text-zinc-500 mb-1">Select end date</p>
        <DatePicker
          wrapperClassName="datePicker"
          selected={endDate}
          onChange={(date) => setEndDate(date as Date)}
        />
      </div>
    </div>
  )
}
